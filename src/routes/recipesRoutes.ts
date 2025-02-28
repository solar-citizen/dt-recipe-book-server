import { Router } from 'express'
import { RecipesController } from '@/src/controllers'

const recipeRoutes = Router()

recipeRoutes.get('/recipes', RecipesController.getRecipes)
recipeRoutes.get('/recipes/:id', RecipesController.getRecipeById)

export { recipeRoutes }
