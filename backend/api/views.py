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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chatbot_query(request):
    """
    Endpoint qui envoie un message utilisateur à Gemini
    et retourne la réponse générée.
    """

    user_message = request.data.get('message')

    if not user_message:
        return Response({'error': 'Message vide'}, status=400)

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')

        chat = model.start_chat(history=[])

        prompt = (
            "Tu es un assistant de gestion de projet nommé ProjectFlow AI. "
            f"Aide l'utilisateur avec sa question : {user_message}"
        )

        response = chat.send_message(prompt)

        return Response({'response': response.text})

    except Exception as e:
        return Response({'error': str(e)}, status=500)
