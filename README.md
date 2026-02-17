# Films_Recomandation  En cours..
Recomandation de films pour utilisateurs (Angular, Cloudinary, Postgress, Render)

node src/server.js
npx nodemon src/server.js

ng serve --open


backend/
│
├─ src/
│   ├─ controllers/
│   │   ├─ auth.controller.js
│   │   ├─ user.controller.js
│   │   ├─ film.controller.js
│   │   └─ admin.controller.js
│   │
│   ├─ routes/
│   │   ├─ auth.routes.js
│   │   ├─ user.routes.js
│   │   ├─ film.routes.js
│   │   └─ admin.routes.js
│   │
│   ├─ models/
│   │   ├─ User.js
│   │   ├─ Theme.js
│   │   ├─ Film.js
│   │   └─ UserTheme.js
│   │
│   ├─ middlewares/
│   │   ├─ auth.middleware.js
│   │   └─ admin.middleware.js
│   │
│   ├─ utils/
│   │   ├─ cloudinary.js
│   │   ├─ email.js
│   │   └─ jwt.js
│   │
│   ├─ config/
│   │   └─ db.js
│   │
│   └─ server.js
│
├─ package.json
└─ .env








frontend/
│
├─ src/app/
│   ├─ core/          # services globaux
│   │   ├─ auth.service.ts
│   │   ├─ user.service.ts
│   │   └─ film.service.ts
│   │
│   ├─ shared/        # composants réutilisables
│   │   ├─ navbar/
│   │   ├─ user-card/
│   │   └─ theme-badge/
│   │
│   ├─ pages/
│   │   ├─ auth/
│   │   │   ├─ login/
│   │   │   └─ register/
│   │   │
│   │   ├─ profile/
│   │   │   ├─ profile.component.ts
│   │   │   └─ profile.component.html
│   │   │
│   │   ├─ users/
│   │   │   └─ users-list.component.ts
│   │   │
│   │   ├─ films/
│   │   │   └─ film-recommendations.component.ts
│   │   │
│   │   └─ admin/
│   │       └─ admin-dashboard.component.ts
│   │
│   ├─ app.routes.ts
│   └─ app.config.ts
│
├─ assets/
└─ environments/
