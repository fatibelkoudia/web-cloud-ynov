# web-cloud-ynov

Application mobile et web réalisée avec **Expo / React Native** et **Firebase**, dans le cadre du TP Dev Cloud  Ynov.

## Application déployée

[https://fatibelkoudia.github.io/web-cloud-ynov/](https://fatibelkoudia.github.io/web-cloud-ynov/)

## Fonctionnalités

- Navigation par onglets (Accueil, Connexion, Profil)
- Authentification Firebase multi-méthodes :
  - Email / Mot de passe
  - GitHub (popup)
  - Facebook (popup)
  - Téléphone (OTP)
  - Anonyme
- Redirection automatique vers le profil après connexion
- Déploiement web automatique via GitHub Actions → GitHub Pages
- Build Android via EAS

## Installation

```bash
npm install
npm start
```

## Variables d'environnement

Créer un fichier `.env` à la racine :

```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_GITHUB_CLIENT_ID=
EXPO_PUBLIC_GITHUB_CLIENT_SECRET=
EXPO_PUBLIC_FACEBOOK_APP_ID=
EXPO_PUBLIC_FACEBOOK_APP_SECRET=
```

## Déploiement

Le workflow GitHub Actions (`build_deploy_web_android.yml`) se déclenche à chaque push sur `main` :
- Export web → déployé sur GitHub Pages
- Build Android → déclenché via EAS
<img width="1306" height="535" alt="image" src="https://github.com/user-attachments/assets/6a42bb9f-9505-44ed-bb1f-f4ccec26fc9f" />



### Test de l'authentification par téléphone
Pour tester la connexion par SMS (OTP) utilisez les identifiants suivants configurés dans Firebase :
- **Numéro :** `+33612345678`
- **Code OTP :** `123456`
