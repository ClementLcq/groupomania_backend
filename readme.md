**GROUPOMANIA - Réseau social d'entreprise 👥**  
  
**BACKEND**

**1. Créer un dossier "Groupomania" sur votre ordinateur**  

- créer dedans un premier dossier appelé "backend"  
- y cloner le repository du backend à l'aide de votre CLI et de cette commande :  
git clone https://github.com/ClementLcq/groupomania_backend  
- ouvrez ce dossier dans votre logiciel de code et lancer la commande suivante pour installer les packages :  
npm install  

**2. Utilisation du .env**  
  
- renommer le fichier dev.env en .env  
- ouvrir le fichier et remplacer les variables par vos propres valeurs :  
ATTENTION, LE PORT DOIT ETRE DIFFERENT DE 3000  

**3. Lancement de l'application**  
  
Allez dans le terminal, vérifiez que vous êtes sur la racine du dossier et lancez :  
npm run dev  



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