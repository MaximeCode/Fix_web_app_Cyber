# Hello World

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install helloworld.

Use node v16 use :

```bash
nvm install 16
```

```bash
npm i
```

## Usage

Start the application dev with :

```bash
npm run start
```

Created the dist with :

```bash
npm run dist
```

Analyse the coding rules with :

```bash
npm run lint
```

## Améliorations en matière de sécurité

Cette application a été sécurisée grâce aux modifications suivantes mises en œuvre depuis la dernière validation :

### Améliorations en matière de sécurité backend

- **Hachage des mots de passe** : ajout de bcryptjs pour un hachage sécurisé des mots de passe dans le modèle utilisateur (hook pré-enregistrement et méthode comparePassword).
- **Authentification et autorisation** : implémentation d'une authentification basée sur JWT avec des cookies HttpOnly. Création d'un middleware d'authentification pour protéger les routes sensibles (/contacts, /feedback, /admin).
- **Validation des entrées** : ajout de schémas Joi pour valider les entrées des formulaires (formulaires de contact et de commentaires) afin d'empêcher les données malveillantes.
- **Limitation du débit** : intégration d'express-rate-limit pour limiter les requêtes (100 par 15 minutes par IP).
- **En-têtes de sécurité** : ajout de Helmet pour sécuriser les en-têtes HTTP.
- **Configuration CORS** : restriction de CORS pour n'autoriser que localhost:8080 avec des informations d'identification.
- **Gestion des sessions** : remplacement de localStorage par des cookies HttpOnly sécurisés pour les jetons JWT.
- **Dépendances** : ajout de packages de sécurité (bcryptjs, joi, express-rate-limit, helmet, jsonwebtoken, dompurify).

### Améliorations de la sécurité frontale

- **Prévention XSS** : intégration de DOMPurify pour assainir le contenu généré par les utilisateurs dans les messages d'administration.
- **Sécurité des requêtes** : ajout de `withCredentials: true` aux requêtes Axios pour une gestion correcte des cookies.
- **Sécurité des formulaires** : modification de la connexion de GET à POST avec des données de corps.

### Base de données et configuration

- **Initialisation des utilisateurs** : création d'un script d'initialisation (`npm run seed`) pour insérer des exemples d'utilisateurs avec des mots de passe hachés.
- **Mises à jour de la configuration** : ajout d'une clé secrète JWT à la configuration.
- **Protection des routes** : application d'un middleware d'authentification aux routes GET /contacts, GET /feedback et DELETE.

### Nettoyage du code

- Suppression des instructions console.log exposées du code côté client.
- Correction de bugs de route (par exemple, la suppression des commentaires utilise désormais /feedback/:id).

### Corrections supplémentaires

- Correction de la route de suppression du contrôleur de commentaires.
- Mise à jour de tous les contrôleurs pour accepter le paramètre de configuration.
- Vérification que tous les formulaires utilisent la méthode POST.

Ces modifications corrigent des vulnérabilités critiques, notamment les mots de passe en texte clair, l'absence d'authentification, les risques XSS et CSRF, ainsi que les problèmes de validation des entrées. L'application respecte désormais les meilleures pratiques en matière de sécurité pour une application web.
