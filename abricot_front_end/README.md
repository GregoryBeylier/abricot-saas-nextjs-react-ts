# Abricot.co — SaaS de gestion de projet collaboratif

Application web de gestion de projets et de tâches avec collaboration en équipe, tableau Kanban, et génération de tâches par IA.

---

## Stack technique

| Côté | Technologies |
|------|-------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| État & Formulaires | TanStack Query, React Hook Form, Zod |
| UI & Utilitaires | Lucide React, date-fns, js-cookie, @dnd-kit/core |
| Backend | Node.js, Express, Prisma, PostgreSQL, JWT |
| IA | Google Gemini API (gemini-2.5-flash-lite) |

---

## Prérequis

- Node.js 18+
- PostgreSQL
- Un compte [Google AI Studio](https://aistudio.google.com) pour la clé Gemini

---

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd developpez_un_SaaS_de_gestion_de_tâches
```

### 2. Installer les dépendances

```bash
# Frontend
cd abricot_front_end
npm install

# Backend
cd ../abricot_back_end
npm install
```

### 3. Configurer le backend

Créer un fichier `.env` dans `abricot_back_end/` :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/abricot"
JWT_SECRET="votre_secret_jwt"
PORT=8000
```

Initialiser la base de données :

```bash
npx prisma migrate dev
npx prisma db seed
```

> Le seed crée 10 utilisateurs de test avec le mot de passe `P@ssword123`.

### 4. Configurer le frontend

Créer un fichier `.env.local` dans `abricot_front_end/` :

```env
GEMINI_API_KEY=votre_clé_api_gemini
```

> ⚠️ Ne jamais préfixer avec `NEXT_PUBLIC_` — la clé doit rester côté serveur uniquement.

### 5. Lancer les serveurs

```bash
# Backend (port 8000)
cd abricot_back_end
npm run dev

# Frontend (port 3000)
cd abricot_front_end
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Brancher une API IA (Google Gemini)

### Obtenir une clé API

1. Aller sur [Google AI Studio](https://aistudio.google.com)
2. Se connecter avec un compte Google
3. Cliquer sur **Get API key** → **Create API key**
4. Copier la clé générée

### Configurer la clé

Dans `abricot_front_end/.env.local` :

```env
GEMINI_API_KEY=AIza...
```

### Comment ça fonctionne

La clé n'est **jamais exposée au navigateur**. Le flux est le suivant :

```
Navigateur → /api/generate-tasks (route Next.js serveur) → API Gemini → réponse JSON
```

La route serveur se trouve dans `app/api/generate-tasks/route.ts`. Elle :
1. Reçoit le prompt de l'utilisateur
2. Envoie une requête à Gemini avec des instructions précises pour retourner du JSON
3. Parse la réponse et la renvoie au frontend

Pour changer de modèle IA, modifier cette ligne dans `route.ts` :

```ts
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`
```

---

## Fonctionnalités

### Authentification
- Inscription avec validation du mot de passe (majuscule, chiffre, caractère spécial, 8 caractères min)
- Connexion avec stockage du token JWT en cookie sécurisé
- Déconnexion depuis le menu profil
- Modification du profil et du mot de passe depuis **Mon compte**
- Protection des routes via `proxy.ts` (middleware Next.js)

### Dashboard
- **Vue liste** : toutes les tâches assignées à l'utilisateur connecté, avec recherche en temps réel
- **Vue Kanban** : colonnes À faire / En cours / Terminée avec **drag & drop** (souris et tactile)
- Glisser une tâche d'une colonne à l'autre met à jour le statut en base automatiquement

### Projets
- Créer un projet avec nom, description et contributeurs
- Modifier un projet (nom, description, ajout/suppression de membres)
- Supprimer un projet (OWNER uniquement)
- Chaque projet affiche une barre de progression et les avatars des membres

### Tâches (dans un projet)
- Créer une tâche avec titre, description, date d'échéance et assignés
- Modifier une tâche (titre, description, statut par pastilles colorées, assignés)
- Supprimer une tâche
- Filtrer les tâches par statut
- Rechercher par titre ou description

### Commentaires
- Ajouter un commentaire sur une tâche (depuis l'accordéon dans la page projet ou la modal de détail)
- Supprimer ses propres commentaires (ou tous si ADMIN)
- Les avatars de l'utilisateur connecté sont mis en évidence (fond abricot clair)

### Génération de tâches par IA
1. Dans une page projet, cliquer sur le bouton **IA**
2. Décrire le projet ou les fonctionnalités souhaitées en langage naturel
3. L'IA génère une liste de tâches structurées (titre + description)
4. Modifier ou supprimer les tâches générées avant de les ajouter
5. Cliquer **Ajouter les tâches** pour tout créer en une fois
6. Générer des tâches supplémentaires depuis la même modale

### Rôles
| Rôle | Droits |
|------|--------|
| OWNER | Tous les droits, peut supprimer le projet |
| ADMIN | Peut modifier les tâches et gérer les membres |
| CONTRIBUTOR | Peut commenter et supprimer ses propres commentaires |

---

## Structure du projet (Frontend)

```
app/
├── (app)/
│   ├── dashboard/        ← Vue liste + Vue Kanban
│   ├── projects/         ← Liste des projets
│   │   └── [id]/         ← Détail d'un projet
│   └── account/          ← Profil utilisateur
├── (auth)/
│   ├── login/
│   └── register/
├── api/
│   └── generate-tasks/   ← Route serveur IA (Gemini)
└── not-found.tsx         ← Page 404

components/
├── dashboard/            ← VueListe, VueKanban, TaskCard
├── layout/               ← Navbar, Footer
├── modal/                ← Toutes les modales
├── projects/             ← ProjectCard, TaskRow
├── providers/            ← ModalProvider (Context)
└── ui/                   ← StatusBadge, RoleBadge, shadcn

lib/
├── api.ts                ← Tous les appels API centralisés
└── utils.ts              ← getInitiales, roleLabels, cn
```

---

## Variables d'environnement

| Variable | Fichier | Description |
|----------|---------|-------------|
| `GEMINI_API_KEY` | `abricot_front_end/.env.local` | Clé API Google Gemini (serveur uniquement) |
| `DATABASE_URL` | `abricot_back_end/.env` | URL de connexion PostgreSQL |
| `JWT_SECRET` | `abricot_back_end/.env` | Secret pour signer les tokens JWT |
| `PORT` | `abricot_back_end/.env` | Port du serveur backend (défaut : 8000) |
