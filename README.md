# 🍳 CulinaryCraft - Full Stack MERN Recipe Book Application

A modern, responsive, full-stack Recipe Book web application built with the **MERN** stack (**MongoDB**, **Express.js**, **React with Vite**, and **Node.js**).

---

## 📁 Project Structure

```text
recipe-book/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB Atlas Mongoose connection
│   │   ├── controllers/
│   │   │   └── recipeController.js# All 5 CRUD controller methods
│   │   ├── models/
│   │   │   └── Recipe.js          # Mongoose schema with validations
│   │   ├── routes/
│   │   │   └── recipeRoutes.js    # Express REST API routes
│   │   └── server.js              # Express app entry, CORS & middleware
│   ├── .env.example               # Backend environment variables template
│   └── package.json               # Backend dependencies and scripts
├── frontend/
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx   # Delete confirmation modal dialog
│   │   │   ├── RecipeCard.jsx     # Recipe presentation card
│   │   │   ├── RecipeDetailsModal.jsx # Ingredients & steps view
│   │   │   └── RecipeFormModal.jsx# Add / Edit validated form
│   │   ├── services/
│   │   │   └── recipeService.js   # Axios HTTP client configured for REST API
│   │   ├── App.jsx                # Main application component & state
│   │   ├── index.css              # Custom modern responsive CSS design system
│   │   └── main.jsx               # React entry point
│   ├── .env.example               # Frontend environment variables template
│   ├── index.html                 # Main HTML with SEO meta tags & Google fonts
│   ├── vite.config.js             # Vite configuration with API proxying
│   └── package.json               # Frontend dependencies and scripts
└── README.md                      # Complete setup & API documentation
```

---

## 🛠️ Features Implemented

1. **Add Recipe**:
   - Recipe Name, Category (Breakfast, Lunch, Dinner, Snack, Dessert), Cooking Time in minutes, Ingredients (multi-line), and Preparation Steps (multi-line).
   - Validates all fields: Cooking time must be a positive number (> 0), requires at least one ingredient and step.
   - User-friendly success and error notifications.
2. **View Recipes**:
   - Attractive, responsive card grid showing Recipe Name, Category tag, and Cooking Time.
   - Category filtering pills (All, Breakfast, Lunch, Dinner, Snack, Dessert) and dynamic live search bar.
3. **View Recipe Details**:
   - Modal popup showing full ingredients list with bullets and numbered preparation steps.
4. **Edit Recipe**:
   - Edit button pre-fills the form with existing data.
   - Sends `PUT /api/recipes/:id` to MongoDB and immediately updates the UI without page reload.
5. **Delete Recipe**:
   - Delete button triggers a confirmation dialog.
   - Sends `DELETE /api/recipes/:id` and removes the card instantly upon success.

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| **GET** | `/api/recipes` | Fetch all recipes (supports optional `?category=` and `?search=` filters) |
| **GET** | `/api/recipes/:id` | Fetch single recipe by MongoDB ID |
| **POST** | `/api/recipes` | Create a new recipe |
| **PUT** | `/api/recipes/:id` | Update an existing recipe by MongoDB ID |
| **DELETE** | `/api/recipes/:id` | Delete a recipe by MongoDB ID |

---

## 🚀 Installation and Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)

---

### Step 1: Configure & Start Backend

1. Navigate to the `backend/` directory:
   ```bash
   cd recipe-book/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Open `backend/.env` and replace `MONGODB_URI` with your connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.yourcluster.mongodb.net/recipe_book?retryWrites=true&w=majority
   ```

4. Run the backend server:
   - For production / standard mode:
     ```bash
     npm start
     ```
   - For development mode with auto-reload (nodemon):
     ```bash
     npm run dev
     ```
   You will see:
   ```text
   Server running in development mode on port 5000
   MongoDB Connected: <cluster-host>
   ```

---

### Step 2: Configure & Start Frontend

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd recipe-book/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the frontend `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
   *(By default, `VITE_API_URL=http://localhost:5000/api`)*

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 📦 Single Repository Git Setup

To push this entire project to a single GitHub repository:

```bash
cd recipe-book
git init
git add .
git commit -m "Initial commit: Complete MERN Stack Recipe Book Application"
git branch -M main
git remote add origin https://github.com/<your-username>/recipe-book.git
git push -u origin main
```
