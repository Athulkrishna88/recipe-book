import React, { useState, useEffect, useCallback } from 'react';
import recipeService from './services/recipeService';
import RecipeCard from './components/RecipeCard';
import RecipeFormModal from './components/RecipeFormModal';
import RecipeDetailsModal from './components/RecipeDetailsModal';
import ConfirmModal from './components/ConfirmModal';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [detailsRecipe, setDetailsRecipe] = useState(null);

  const [deletingRecipe, setDeletingRecipe] = useState(null);
  const [deleteProcessing, setDeleteProcessing] = useState(false);

  // Helper for auto-dismissing notifications
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr && curr.message === message ? null : curr));
    }, 4500);
  };

  // Fetch recipes from backend API
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await recipeService.getAll(params);
      if (res.success) {
        setRecipes(res.data);
      }
    } catch (err) {
      console.error('Failed to load recipes:', err);
      showNotification(
        err.message || 'Unable to connect to backend server. Make sure MongoDB & backend are running.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingRecipe(null);
    setIsFormOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  // Handle Create or Update submission
  const handleSaveRecipe = async (recipeData) => {
    setFormSubmitting(true);
    try {
      if (editingRecipe) {
        // Edit flow (PUT)
        const res = await recipeService.update(editingRecipe._id, recipeData);
        if (res.success) {
          // Update state immediately without full page reload
          setRecipes((prev) =>
            prev.map((r) => (r._id === editingRecipe._id ? res.data : r))
          );
          if (detailsRecipe && detailsRecipe._id === editingRecipe._id) {
            setDetailsRecipe(res.data);
          }
          showNotification(`Recipe "${res.data.name}" updated successfully!`, 'success');
          setIsFormOpen(false);
          setEditingRecipe(null);
        }
      } else {
        // Add flow (POST)
        const res = await recipeService.create(recipeData);
        if (res.success) {
          setRecipes((prev) => [res.data, ...prev]);
          showNotification(`Recipe "${res.data.name}" added successfully!`, 'success');
          setIsFormOpen(false);
        }
      }
    } catch (err) {
      console.error('Save recipe error:', err);
      showNotification(err.message || 'Failed to save recipe. Please check your inputs.', 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete flow trigger (Confirmation Dialog)
  const handleRequestDelete = (recipe) => {
    setDeletingRecipe(recipe);
  };

  // Execute Delete
  const handleConfirmDelete = async () => {
    if (!deletingRecipe) return;
    setDeleteProcessing(true);
    try {
      const res = await recipeService.delete(deletingRecipe._id);
      if (res.success) {
        // Update UI immediately
        setRecipes((prev) => prev.filter((r) => r._id !== deletingRecipe._id));
        if (detailsRecipe && detailsRecipe._id === deletingRecipe._id) {
          setDetailsRecipe(null);
        }
        showNotification(`Recipe "${deletingRecipe.name}" was deleted successfully.`, 'success');
        setDeletingRecipe(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
      showNotification(err.message || 'Failed to delete recipe.', 'error');
    } finally {
      setDeleteProcessing(false);
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="nav-inner">
          <div className="brand" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>
            <div className="brand-icon">🍳</div>
            <h1 className="brand-title">Culinary<span>Craft</span></h1>
          </div>
          <div className="nav-actions">
            <button
              type="button"
              className="btn btn-primary"
              id="add-recipe-btn"
              onClick={handleOpenAdd}
            >
              <span>+</span> Add Recipe
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-badge">✨ Full-Stack MERN Architecture</div>
          <h2 className="hero-title">Delicious Recipes, Crafted With Love</h2>
          <p className="hero-subtitle">
            Manage your personal cookbook, organize by category, track preparation time,
            and inspect ingredients with full MongoDB Atlas synchronization.
          </p>
        </section>

        {/* Global Alert Notification */}
        {notification && (
          <div className={`alert-banner alert-${notification.type}`} role="alert" id="status-notification">
            <span>{notification.message}</span>
            <button
              type="button"
              className="alert-close"
              onClick={() => setNotification(null)}
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filter and Search Bar */}
        <section className="filter-bar">
          <div className="category-pills" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                id={`filter-pill-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              id="search-input"
              className="search-input"
              placeholder="Search recipes by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Content Section: Loading, Empty, or Recipe Cards */}
        {loading ? (
          <div className="state-container" id="loading-state">
            <div className="spinner" />
            <h3 className="state-title">Loading Recipes...</h3>
            <p className="state-desc">Connecting to MongoDB database and fetching delicious recipes.</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="state-container" id="empty-state">
            <div className="state-icon">📖</div>
            <h3 className="state-title">No Recipes Found</h3>
            <p className="state-desc">
              {searchQuery || selectedCategory !== 'All'
                ? 'No recipes match your current filter or search criteria. Try choosing another category or clear the search query.'
                : 'Your cookbook is currently empty. Get started by adding your first culinary masterpiece!'}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              id="empty-add-btn"
              onClick={handleOpenAdd}
            >
              Create New Recipe
            </button>
          </div>
        ) : (
          <section className="recipe-grid" id="recipe-card-list">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onView={(item) => setDetailsRecipe(item)}
                onEdit={(item) => handleOpenEdit(item)}
                onDelete={(item) => handleRequestDelete(item)}
              />
            ))}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          <strong>CulinaryCraft MERN Stack Recipe Book</strong> &bull; Built with React, Vite, Node.js, Express &amp; MongoDB Atlas
        </p>
      </footer>

      {/* Add / Edit Recipe Modal */}
      <RecipeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveRecipe}
        editingRecipe={editingRecipe}
        isSubmitting={formSubmitting}
      />

      {/* View Recipe Details Modal */}
      <RecipeDetailsModal
        recipe={detailsRecipe}
        onClose={() => setDetailsRecipe(null)}
        onEdit={(item) => handleOpenEdit(item)}
        onDelete={(item) => handleRequestDelete(item)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!deletingRecipe}
        title="Delete Recipe"
        message={`Are you sure you want to permanently delete "${deletingRecipe?.name}"? This action removes the document from MongoDB.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingRecipe(null)}
        isProcessing={deleteProcessing}
      />
    </div>
  );
}

export default App;
