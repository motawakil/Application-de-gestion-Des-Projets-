🚀 ProjectFlow - Gestion de Projets avec IA (Gemini)
Une application Fullstack moderne pour gérer vos projets et vos tâches, incluant un assistant intelligent propulsé par l'IA Gemini et une vérification des jours fériés.

🛠️ Installation & Configuration
1. Cloner le projet
Bash
git clone https://github.com/motawakil/Application-de-gestion-Des-Projets-.git
cd Application-de-gestion-Des-Projets-
2. Configuration du Backend (Django)
Il est fortement recommandé de créer un fichier requirements.txt dans le dossier backend/ avec le contenu suivant :



Installation :

Bash
cd backend
pip install -r requirements.txt
python manage.py migrate
3. Configuration du Frontend (React)
Bash
cd ../frontend
npm install
npm install lucide-react axios react-router-dom
🔑 Variables d'Environnement (.env)
Créez un fichier .env à la racine du projet (ou dans le dossier backend/ selon votre config load_dotenv).

Extrait de code
# Sécurité Django
SECRET_KEY=votre_secret_django
DEBUG=True

# Base de données (si non-Docker)
Bash
docker-compose up --build

# API Externe
GEMINI_API_KEY=VOTRE_CLE_API_GEMINI_ICI (dans .env)




🚀 Lancement de l'Application
Démarrer le Backend :

Bash
cd backend
python manage.py runserver
Le serveur sera sur : http://localhost:8000

Démarrer le Frontend :

Bash
cd frontend
npm run dev
# ou
npm start


L'application sera sur : http://localhost:5173 ou 3000

🌟 Fonctionnalités Clés
Auth JWT : Connexion sécurisée avec accès restreint aux données personnelles.

Dashboard Dynamique : Création, modification et suppression de projets.

Gestion de Tâches : Filtrage par priorité/statut et détection des jours fériés via API externe.

Assistant IA : Chatbot intégré utilisant l'API Gemini 1.5 Flash pour vous aider dans vos projets.

📝 Commandes Utiles
Générer les requirements : pip freeze > requirements.txt

Créer un superutilisateur : python manage.py createsuperuser