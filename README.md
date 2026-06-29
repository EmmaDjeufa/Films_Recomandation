

````
# 🎬 Film Recommendation App

Application de recommandation de films pour utilisateurs  
(**Angular + Node.js + PostgreSQL + Cloudinary + Render**)

---

## 🚀 Lancer le projet

### 🔧 Backend

```bash
node src/server.js
````

ou en mode dev :

```bash
npx nodemon src/server.js
```

---

### 💻 Frontend (Angular)

```bash
npx ng serve --open
```

---

## 📁 Architecture du projet

```
Films_Recomandation
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── film.controller.js
│   │   │   └── admin.controller.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── film.routes.js
│   │   │   └── admin.routes.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Theme.js
│   │   │   ├── Film.js
│   │   │   └── UserTheme.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── admin.middleware.js
│   │   │
│   │   ├── utils/
│   │   │   ├── cloudinary.js
│   │   │   ├── email.js
│   │   │   └── jwt.js
│   │   │
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │
│   │   ├── core/                 # Services globaux
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── film.service.ts
│   │   │
│   │   ├── shared/               # Composants réutilisables
│   │   │   ├── navbar/
│   │   │   ├── user-card/
│   │   │   └── theme-badge/
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── profile.component.ts
│   │   │   │   └── profile.component.html
│   │   │   │
│   │   │   ├── users/
│   │   │   │   └── users-list.component.ts
│   │   │   │
│   │   │   ├── films/
│   │   │   │   └── film-recommendations.component.ts
│   │   │   │
│   │   │   └── admin/
│   │   │       └── admin-dashboard.component.ts
│   │   │
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   │
│   ├── assets/
│   └── environments/
```

---

## 🧠 Stack technique

* **Frontend** : Angular
* **Backend** : Node.js + Express
* **Base de données** : PostgreSQL
* **Stockage images** : Cloudinary
* **Déploiement** : Render

---

### (Notes de l'architecture d'inscription)

Utilisateur
      │
      │ Inscription
      ▼
Express
      │
      ├── crée l'utilisateur
      ├── génère un code 482913
      ├── enregistre ce code en BD
      └── envoie le code par Brevo
                │
                ▼
        email utilisateur

Utilisateur
      │
      │ saisit 482913
      ▼
Angular
      │
      ▼
Express
      │
      ├── compare le code
      ├── vérifie la date
      └── is_verified = true

Connexion autorisée

```
