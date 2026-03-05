from datetime import timedelta
from django.utils import timezone

from django.conf import settings
from django.contrib.auth.models import User

from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer, UserSerializer

import google.generativeai as genai

# Configuration de la clé API Gemini depuis settings.py
genai.configure(api_key=settings.GEMINI_API_KEY)



class UserCreateView(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les utilisateurs.
    Permet l'inscription (POST) et la gestion CRUD si authentifié.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer

    # Route personnalisée: GET /api/register/me/
    # Retourne les informations de l'utilisateur connecté
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    # Permissions dynamiques :
    # - POST (create) accessible à tous
    # - autres actions nécessitent authentification
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]



class ProjectViewSet(viewsets.ModelViewSet):
    """
    Gestion des projets.
    Chaque utilisateur ne voit que ses propres projets.
    """

    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Limite les projets à ceux du user connecté
    def get_queryset(self):
        return Project.objects.filter(
            owner=self.request.user
        ).order_by('-created_at')

    # Lors de la création, on force le owner = user connecté
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    """
    Gestion des tâches.
    Les tâches sont filtrées selon le propriétaire du projet.
    """

    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Active le filtrage automatique via query params
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'priority', 'due_date', 'project']

    # Ne retourne que les tâches appartenant aux projets du user
    def get_queryset(self):
        return Task.objects.filter(
            project__owner=self.request.user
        )
    # 🔹 GET /api/tasks/by-date/?date=2026-03-04
    @action(detail=False, methods=['get'])
    def by_date(self, request):
        date = request.query_params.get("date")

        if not date:
            return Response({"error": "Date manquante"}, status=400)

        tasks = self.get_queryset().filter(due_date=date)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)



    # 🔹 GET /api/tasks/next-days/?days=3
    @action(detail=False, methods=['get'])
    def next_days(self, request):
        days = request.query_params.get("days")

        if not days:
            return Response({"error": "Nombre de jours manquant"}, status=400)

        try:
            days = int(days)
        except ValueError:
            return Response({"error": "Valeur invalide"}, status=400)

        today = timezone.now().date()
        target_date = today + timedelta(days=days)

        tasks = self.get_queryset().filter(
            due_date__gte=today,
            due_date__lte=target_date
        )

        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    """
    Retourne les informations simples du user connecté.
    """
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email
    })

import json


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chatbot_query(request):

    user_message = request.data.get("message")
    user = request.user

    if not user_message:
        return Response({"error": "Message vide"}, status=400)

    # Configuration de la date pour l'IA
    today = timezone.now().date()
    today_str = today.isoformat()

    model = genai.GenerativeModel("gemini-2.5-flash") 

    # MISE À JOUR DU PROMPT : On demande à l'IA de répondre si c'est général


    prompt = f"""
Tu es un assistant de gestion de tâches nommé ProjectFlow AI. Nous sommes aujourd'hui le {today_str}.

Si la question concerne les tâches (recherche par date ou période), retourne un JSON avec l'intention.
Si la question est générale (salutations, questions sur toi, etc.), utilise l'intention "general" ET rédige une réponse amicale dans le champ "reply".

Format JSON attendu :

1) Pour une date précise :
{{
  "intent": "get_tasks_by_date",
  "date": "YYYY-MM-DD"
}}

2) Pour les X prochains jours :
{{
  "intent": "get_tasks_next_days",
  "days": number
}}

3) Sinon (salutations, aide, etc.) :
{{
  "intent": "general",
  "reply": "Ta réponse conversationnelle ici en tant qu'assistant"
}}

Question utilisateur :
{user_message}

NE RETOURNE QUE DU JSON.
"""

    response = model.generate_content(prompt)
    raw = response.text.strip()
    
    if raw.startswith("```"):
        raw = raw.replace("```json", "").replace("```", "").strip()
    
    try:
        data = json.loads(raw)
    except:
        return Response({"error": "Réponse IA invalide"}, status=500)

    # --- LOGIQUE DE DISPATCH ---

    # 1. Recherche par date précise
    if data["intent"] == "get_tasks_by_date":
        date_query = data.get("date")
        tasks = Task.objects.filter(project__owner=user, due_date=date_query)
        serializer = TaskSerializer(tasks, many=True)
        
        count = len(serializer.data)
        msg = f"J'ai trouvé {count} tâche(s) pour le {date_query}." if count > 0 else f"Aucune tâche n'est prévue pour le {date_query}."
        
        return Response({
            "response": msg,
            "tasks": serializer.data
        })

    # 2. Recherche pour les X prochains jours (CORRECTION DE L'ERREUR)
    if data["intent"] == "get_tasks_next_days":
        days = int(data.get("days", 0))
        target_date = today + timedelta(days=days)

        # 🔥 On définit bien la variable 'tasks' ici
        tasks = Task.objects.filter(
            project__owner=user,
            due_date__gte=today,
            due_date__lte=target_date
        )
        
        serializer = TaskSerializer(tasks, many=True)
        msg = f"Voici vos tâches pour les {days} prochains jours :"
        
        return Response({
            "response": msg,
            "tasks": serializer.data
        })

    # 3. Cas général (L'IA parle normalement)
    # On récupère le champ "reply" généré par Gemini
    return Response({
        "response": data.get("reply", "Je suis ProjectFlow AI, comment puis-je vous aider ?")
    })