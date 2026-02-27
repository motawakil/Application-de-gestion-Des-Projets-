from rest_framework import viewsets, permissions

from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer, UserSerializer
from django.contrib.auth.models import User

class UserCreateView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny] # Tout le monde peut s'inscrire

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Sécurité : un utilisateur ne voit que SES projets
        return Project.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # On lie automatiquement le projet à l'utilisateur connecté
        serializer.save(owner=self.request.user)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Sécurité : uniquement les tâches des projets de l'utilisateur
        return Task.objects.filter(project__owner=self.request.user)