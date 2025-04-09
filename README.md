# ScoreMaster

ScoreMaster est une application web moderne pour la gestion de scores en temps réel, conçue pour les arbitres et les spectateurs. Elle permet de suivre les scores de matchs en direct, de partager facilement les résultats et d'interagir avec les participants.

## Fonctionnalités

### Pour les Arbitres
- **Création de matchs** : Créez facilement des matchs avec plusieurs équipes
- **Gestion des scores** : Mettez à jour les scores en temps réel avec différentes options (+1, +5, score personnalisé)
- **Partage simplifié** : Générez des liens et QR codes pour partager le match avec les spectateurs
- **Tableau de bord** : Visualisez tous vos matchs créés et accédez rapidement à leur gestion

### Pour les Spectateurs
- **Suivi en direct** : Consultez les scores en temps réel sans rafraîchissement
- **Accès simplifié** : Scannez un QR code ou utilisez un lien pour accéder au match
- **Interface adaptative** : Expérience optimisée sur mobile et desktop

## Technologies utilisées

- **Frontend** : Vue.js 3 avec TypeScript
- **État global** : Pinia
- **Routing** : Vue Router
- **Base de données** : Firebase Firestore
- **Authentification** : Firebase Auth
- **Bundler** : Vite
- **UI** : Tailwind CSS
- **Icônes** : FontAwesome
- **QR Code** : qrcode-vue3

## Structure du projet

```
src/
├── assets/         # Ressources statiques (images, styles)
├── components/     # Composants réutilisables
├── composables/    # Composables Vue.js
├── router/         # Configuration des routes
├── services/       # Services (Firebase, etc.)
├── stores/         # Stores Pinia pour la gestion d'état
├── types/          # Types TypeScript
└── views/          # Pages principales
    ├── Auth/       # Pages d'authentification
    ├── Referee/    # Pages pour les arbitres
    └── Spectator/  # Pages pour les spectateurs
```

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/scoremaster.git
cd scoremaster
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet avec vos configurations Firebase :
```
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_auth_domain
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
```

4. Lancez le serveur de développement :
```bash
npm run dev
```

5. Pour construire pour la production :
```bash
npm run build
```

## Utilisation

### Pour les Arbitres
1. Connectez-vous à votre compte
2. Créez un nouveau match en spécifiant le nom et les équipes
3. Gérez les scores en temps réel
4. Partagez le lien ou le QR code avec les spectateurs

### Pour les Spectateurs
1. Accédez au match via le lien ou le QR code partagé
2. Suivez les scores en temps réel

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
