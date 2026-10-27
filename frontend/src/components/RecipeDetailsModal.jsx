import React from 'react';

const RecipeDetailsModal = ({ recipe, onClose, onEdit, onDelete }) => {
  if (!recipe) return null;

  const { _id, name, category, cookingTime, ingredients = [], instructions = [], createdAt } = recipe;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null;

  return (
    <div className="modal-overlay" onClick={onClose} id="recipe-details-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{name}</h2>
          <button
            type="button"
            className="modal-close-btn"
            id="close-details-modal"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="details-header-meta">
            <span className={`category-tag ${category}`}>{category}</span>
            <span className="cooking-time-badge">⏱️ {cookingTime} minutes</span>
            {formattedDate && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginLeft: 'auto' }}>
                Added {formattedDate}
              </span>
            )}
          </div>

          <div className="details-section">
            <h3 className="section-title">
              <span>🥗</span> Ingredients ({ingredients.length})
            </h3>
            <ul className="ingredients-list">
              {ingredients.map((item, idx) => (
                <li key={idx} className="ingredient-item">
                  <span className="ingredient-bullet">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="details-section">
            <h3 className="section-title">
              <span>📋</span> Preparation Steps ({instructions.length})
            </h3>
            <ol className="instructions-steps">
              {instructions.map((step, idx) => (
                <li key={idx} className="instruction-step">
                  <span className="step-num">{idx + 1}</span>
                  <div className="step-content">{step}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-danger"
            id={`details-delete-${_id}`}
            onClick={() => {
              onClose();
              onDelete(recipe);
            }}
          >
            🗑️ Delete Recipe
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            id={`details-edit-${_id}`}
            onClick={() => {
              onClose();
              onEdit(recipe);
            }}
          >
            ✏️ Edit Recipe
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsModal;
