const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

// Helper to normalize string input or array input for ingredients and steps
const normalizeList = (input) => {
  if (Array.isArray(input)) {
    return input.map(item => String(item).trim()).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean);
  }
  return [];
};

// @desc    Get all recipes
// @route   GET /api/recipes
exports.getRecipes = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database unavailable: MongoDB is not currently connected. Please verify your MONGODB_URI in backend/.env',
        data: []
      });
    }

    const { category, search } = req.query;
    let query = {};


    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recipes',
      error: error.message
    });
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipe ID format'
      });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe not found with id: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Error fetching recipe:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recipe details',
      error: error.message
    });
  }
};

// @desc    Create new recipe
// @route   POST /api/recipes
exports.createRecipe = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Cannot create recipe: MongoDB is not currently connected. Please verify your MONGODB_URI in backend/.env'
      });
    }

    const { name, category, ingredients, instructions, cookingTime } = req.body;


    const parsedCookingTime = Number(cookingTime);
    if (isNaN(parsedCookingTime) || parsedCookingTime <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Cooking time must be a valid positive number greater than 0'
      });
    }

    const cleanedIngredients = normalizeList(ingredients);
    const cleanedInstructions = normalizeList(instructions);

    if (cleanedIngredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one ingredient'
      });
    }

    if (cleanedInstructions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one preparation step'
      });
    }

    const recipe = await Recipe.create({
      name: name ? name.trim() : '',
      category,
      ingredients: cleanedIngredients,
      instructions: cleanedInstructions,
      cookingTime: parsedCookingTime
    });

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: recipe
    });
  } catch (error) {
    console.error('Error creating recipe:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating recipe',
      error: error.message
    });
  }
};

// @desc    Update recipe by ID
// @route   PUT /api/recipes/:id
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipe ID format'
      });
    }

    const { name, category, ingredients, instructions, cookingTime } = req.body;
    const updateData = {};

    if (name !== undefined) {
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Recipe name cannot be empty'
        });
      }
      updateData.name = name.trim();
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (cookingTime !== undefined) {
      const parsedCookingTime = Number(cookingTime);
      if (isNaN(parsedCookingTime) || parsedCookingTime <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Cooking time must be a valid positive number greater than 0'
        });
      }
      updateData.cookingTime = parsedCookingTime;
    }

    if (ingredients !== undefined) {
      const cleaned = normalizeList(ingredients);
      if (cleaned.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one ingredient is required'
        });
      }
      updateData.ingredients = cleaned;
    }

    if (instructions !== undefined) {
      const cleaned = normalizeList(instructions);
      if (cleaned.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one preparation step is required'
        });
      }
      updateData.instructions = cleaned;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedRecipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe not found with id: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully',
      data: updatedRecipe
    });
  } catch (error) {
    console.error('Error updating recipe:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating recipe',
      error: error.message
    });
  }
};

// @desc    Delete recipe by ID
// @route   DELETE /api/recipes/:id
exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipe ID format'
      });
    }

    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe not found with id: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully',
      data: { id: recipe._id }
    });
  } catch (error) {
    console.error('Error deleting recipe:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting recipe',
      error: error.message
    });
  }
};
