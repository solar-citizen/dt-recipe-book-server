import { Router } from 'express'

import { recipeRoutes } from './recipesRoutes'

const router = Router()

router.use('/', recipeRoutes)

export { router }
