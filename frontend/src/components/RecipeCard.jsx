import React from 'react';

const RecipeCard = ({ recipe, onView, onEdit, onDelete }) => {
  const { _id, name, category, cookingTime, ingredients = [], instructions = [] } = recipe;

  return (
    <article className="recipe-card" id={`recipe-card-${_id}`}>
      <div className="card-header-bar" />
      <div className="card-body">
        <div className="card-top">
          <span className={`category-tag ${category}`}>{category}</span>
          <span className="cooking-time-badge" title="Cooking Time">
            ⏱️ {cookingTime} min
          </span>
        </div>

        <h3 className="card-title">{name}</h3>

        <div className="card-preview">
          <div className="card-preview-item">
            <span>🥗</span>
            <span><strong>{ingredients.length}</strong> ingredient{ingredients.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="card-preview-item">
            <span>📋</span>
            <span><strong>{instructions.length}</strong> preparation step{instructions.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="card-actions">
          <button
            type="button"
            className="btn btn-primary btn-card"
            id={`view-recipe-${_id}`}
            onClick={() => onView(recipe)}
          >
            View Details
          </button>
          
          <button
            type="button"
            className="btn-icon-action"
            id={`edit-recipe-${_id}`}
            title="Edit Recipe"
            onClick={() => onEdit(recipe)}
          >
            ✏️
          </button>

          <button
            type="button"
            className="btn-icon-action btn-icon-delete"
            id={`delete-recipe-${_id}`}
            title="Delete Recipe"
            onClick={() => onDelete(recipe)}
          >
            🗑️
          </button>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
