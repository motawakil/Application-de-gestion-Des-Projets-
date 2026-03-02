from django.conf import settings 
from rest_framework import viewsets, permissions

from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer, UserSerializer
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from django_filters.rest_framework import DjangoFilterBackend

import google.generativeai as genai
# Utilise la clé configurée dans settings.py
genai.configure(api_key=settings.GEMINI_API_KEY)

class UserCreateView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    # Cette fonction permet de faire GET /api/register/me/
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def get_permissions(self):
        # Permet à tout le monde de s'inscrire (POST), 
        # mais demande d'être connecté pour le reste
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]




class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Un utilisateur ne voit QUE ses projets
        return Project.objects.filter(owner=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'priority', 'due_date', 'project'] # Filtrage activé

    def get_queryset(self):
        # Uniquement les tâches des projets appartenant à l'utilisateur
        return Task.objects.filter(project__owner=self.request.user)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email
    })





@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chatbot_query(request):
    user_message = request.data.get('message')
    
    if not user_message:
        return Response({'error': 'Message vide'}, status=400)

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # On donne un contexte à Gemini pour qu'il agisse en assistant de projet
        chat = model.start_chat(history=[])
        prompt = f"Tu es un assistant de gestion de projet nommé ProjectFlow AI. Aide l'utilisateur avec sa question : {user_message}"
        
        response = chat.send_message(prompt)
        
        return Response({'response': response.text})
    except Exception as e:
        return Response({'error': str(e)}, status=500)