import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

const RecipeFormModal = ({ isOpen, onClose, onSave, editingRecipe, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Breakfast',
    ingredients: '',
    instructions: '',
    cookingTime: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingRecipe) {
      setFormData({
        name: editingRecipe.name || '',
        category: editingRecipe.category || 'Breakfast',
        ingredients: Array.isArray(editingRecipe.ingredients)
          ? editingRecipe.ingredients.join('\n')
          : editingRecipe.ingredients || '',
        instructions: Array.isArray(editingRecipe.instructions)
          ? editingRecipe.instructions.join('\n')
          : editingRecipe.instructions || '',
        cookingTime: editingRecipe.cookingTime || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'Breakfast',
        ingredients: '',
        instructions: '',
        cookingTime: ''
      });
    }
    setErrors({});
  }, [editingRecipe, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Recipe name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Recipe name must be at least 2 characters.';
    }

    if (!formData.category) {
      newErrors.category = 'Category selection is required.';
    }

    if (!formData.cookingTime) {
      newErrors.cookingTime = 'Cooking time is required.';
    } else {
      const timeNum = Number(formData.cookingTime);
      if (isNaN(timeNum) || timeNum <= 0) {
        newErrors.cookingTime = 'Cooking time must be a positive number greater than 0.';
      }
    }

    const ingArray = formData.ingredients
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean);
    if (ingArray.length === 0) {
      newErrors.ingredients = 'Please provide at least one ingredient.';
    }

    const stepArray = formData.instructions
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    if (stepArray.length === 0) {
      newErrors.instructions = 'Please provide at least one preparation step.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      cookingTime: Number(formData.cookingTime),
      ingredients: formData.ingredients
        .split('\n')
        .map(i => i.trim())
        .filter(Boolean),
      instructions: formData.instructions
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
    };

    onSave(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="recipe-form-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {editingRecipe ? '✏️ Edit Recipe' : '🍳 Add New Recipe'}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            id="close-form-modal"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="recipe-name" className="form-label">
                Recipe Name <span className="req">*</span>
              </label>
              <input
                type="text"
                id="recipe-name"
                name="name"
                className="form-input"
                placeholder="e.g., Creamy Garlic Butter Salmon"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.name && <div className="form-error-text">{errors.name}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="recipe-category" className="form-label">
                  Category <span className="req">*</span>
                </label>
                <select
                  id="recipe-category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <div className="form-error-text">{errors.category}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="recipe-time" className="form-label">
                  Cooking Time (Minutes) <span className="req">*</span>
                </label>
                <input
                  type="number"
                  id="recipe-time"
                  name="cookingTime"
                  min="1"
                  className="form-input"
                  placeholder="e.g., 25"
                  value={formData.cookingTime}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.cookingTime && <div className="form-error-text">{errors.cookingTime}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="recipe-ingredients" className="form-label">
                Ingredients <span className="req">*</span>
              </label>
              <textarea
                id="recipe-ingredients"
                name="ingredients"
                className="form-textarea"
                rows="4"
                placeholder="Enter each ingredient on a new line&#10;e.g.,&#10;2 Salmon fillets&#10;3 cloves garlic, minced&#10;2 tbsp butter&#10;Salt and black pepper"
                value={formData.ingredients}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <div className="form-hint">💡 Tip: Press Enter to put each ingredient on a separate line.</div>
              {errors.ingredients && <div className="form-error-text">{errors.ingredients}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="recipe-instructions" className="form-label">
                Preparation Steps <span className="req">*</span>
              </label>
              <textarea
                id="recipe-instructions"
                name="instructions"
                className="form-textarea"
                rows="5"
                placeholder="Enter each step on a new line&#10;e.g.,&#10;Season salmon fillets with salt and black pepper on both sides.&#10;Melt butter in a large skillet over medium-high heat.&#10;Add minced garlic and sauté for 1 minute until fragrant.&#10;Sear salmon skin-side down for 4 minutes until golden."
                value={formData.instructions}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <div className="form-hint">💡 Tip: Press Enter to put each preparation step on a separate line.</div>
              {errors.instructions && <div className="form-error-text">{errors.instructions}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              id="cancel-recipe-form"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              id="submit-recipe-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2, margin: 0 }} />
                  Saving...
                </>
              ) : (
                editingRecipe ? 'Update Recipe' : 'Add Recipe'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeFormModal;
