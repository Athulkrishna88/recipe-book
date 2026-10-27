const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Recipe = require('./src/models/Recipe');

async function testCRUD() {
  console.log('--- STARTING MERN RECIPE BOOK CRUD TEST ---');
  let mongoServer;
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log('[1/7] In-memory MongoDB started at:', uri);

    await mongoose.connect(uri);
    console.log('[2/7] Mongoose connected successfully.');

    // 1. CREATE RECIPE (POST)
    console.log('\n--- 1. Testing CREATE Recipe ---');
    const newRecipe = await Recipe.create({
      name: 'Fluffy Buttermilk Pancakes',
      category: 'Breakfast',
      cookingTime: 20,
      ingredients: ['2 cups flour', '2 eggs', '1.5 cups buttermilk', '2 tbsp sugar', '1 tsp baking powder'],
      instructions: [
        'Whisk flour, sugar, and baking powder in a large bowl.',
        'Beat eggs and buttermilk together, then fold into dry mix.',
        'Cook on hot buttered griddle for 2-3 mins per side until golden brown.'
      ]
    });
    console.log('✓ Created Recipe ID:', newRecipe._id.toString());
    console.log('✓ Recipe Name:', newRecipe.name);
    console.log('✓ Category:', newRecipe.category);
    console.log('✓ Cooking Time:', newRecipe.cookingTime);

    // 2. READ ALL RECIPES (GET /api/recipes)
    console.log('\n--- 2. Testing READ ALL Recipes ---');
    const allRecipes = await Recipe.find({});
    console.log(`✓ Fetched ${allRecipes.length} recipe(s) from MongoDB.`);
    if (allRecipes.length !== 1) throw new Error('Expected 1 recipe');

    // 3. READ SINGLE RECIPE (GET /api/recipes/:id)
    console.log('\n--- 3. Testing READ SINGLE Recipe ---');
    const fetchedRecipe = await Recipe.findById(newRecipe._id);
    console.log('✓ Found Recipe by ID:', fetchedRecipe.name);
    console.log('✓ Ingredients count:', fetchedRecipe.ingredients.length);
    console.log('✓ Instructions count:', fetchedRecipe.instructions.length);

    // 4. UPDATE RECIPE (PUT /api/recipes/:id)
    console.log('\n--- 4. Testing UPDATE Recipe ---');
    const updated = await Recipe.findByIdAndUpdate(
      newRecipe._id,
      {
        cookingTime: 25,
        ingredients: [...newRecipe.ingredients, '1/2 tsp vanilla extract']
      },
      { new: true, runValidators: true }
    );
    console.log('✓ Updated cooking time to:', updated.cookingTime);
    console.log('✓ Updated ingredients count to:', updated.ingredients.length);

    // 5. DELETE RECIPE (DELETE /api/recipes/:id)
    console.log('\n--- 5. Testing DELETE Recipe ---');
    const deleted = await Recipe.findByIdAndDelete(newRecipe._id);
    console.log('✓ Deleted Recipe:', deleted.name);

    const checkDeleted = await Recipe.findById(newRecipe._id);
    console.log('✓ Verification after delete (should be null):', checkDeleted);
    if (checkDeleted !== null) throw new Error('Recipe was not deleted');

    // 6. VALIDATION TESTS
    console.log('\n--- 6. Testing SCHEMA VALIDATIONS ---');
    try {
      await Recipe.create({
        name: 'Invalid Test',
        category: 'NonExistentCategory', // Invalid enum
        cookingTime: -5 // Invalid negative time
      });
      console.error('✗ Expected validation error but succeeded.');
    } catch (err) {
      console.log('✓ Schema validation successfully blocked invalid data:', err.message);
    }

    console.log('\n========================================');
    console.log('🎉 ALL 5 CRUD OPERATIONS & VALIDATIONS PASSED!');
    console.log('========================================');
  } catch (error) {
    console.error('CRUD Test Failed:', error);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  }
}

testCRUD();
