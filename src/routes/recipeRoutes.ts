import { Router } from 'express'

import { RecipesController } from '@/src/controllers'

const recipeRoutes = Router()

recipeRoutes.get('/api/recipes', RecipesController.getRecipes)
recipeRoutes.get('/api/recipes/:id', RecipesController.getRecipeById)

export { recipeRoutes }
