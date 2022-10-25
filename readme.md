**GROUPOMANIA - Réseau social d'entreprise 👥**
**BACKEND**


étape de mise en route :
Initialisation du projet: 📁
créer un dossier en local

y cloner le repository à l'aide de votre CLI avec cette commande:
git clone https://github.com/Tham94/P7-Groupomania.git

Installation des packages : 📦
se positionner avec le CLI sur le dossier backend ET lancer la commande :
npm install

se positionner sur le dossier frontend et lancer la commande :
npm install

Définition des Variables d'environnement : 📝
Backend
copier le fichier .env.example du dossier \backend
le coller au même endroit puis renommer celui-ci par ".env"
Ouvrir ce fichier .env et remplacer les variables par vos propres valeurs,ex:
DATABASE_URL=mysql://root:monmotdepasse@localhost:8080/groupomania
SECRET_KEY_SALTED = CleSecrete12
PORT = 9000

ATTENTION LE PORT DOIT ÊTRE DIFFERENT DE 3000

Frontend
copier le fichier .env.example du dossier \frontend
le coller au même endroit puis renommer celui-ci par ".env"
Ouvrir ce fichier .env et remplacer les variables par vos propres valeurs,ex:
REACT_APP_API_URL= http://localhost:9000/

ATTENTION le port doit correspondre avec celui choisit dans le backend (PORT)

Lancement de l'application 🚀
se positionner sur le dossier \backend et lancer : npm start

se positionner sur le dossier \frontend et lancer : npm start

l'application sera lancé sur http://localhost:3000