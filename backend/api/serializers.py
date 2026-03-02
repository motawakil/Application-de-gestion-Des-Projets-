from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, Task
from rest_framework import serializers




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # create_user gère automatiquement le hachage du mot de passe
        return User.objects.create_user(**validated_data)
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'



class ProjectSerializer(serializers.ModelSerializer):
    # Permet de voir les tâches liées quand on récupère un projet
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'owner', 'tasks', 'created_at']
        read_only_fields = ['owner']





