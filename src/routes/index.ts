import { Router } from 'express'

import { recipeRoutes } from './recipeRoutes'

const router = Router()

router.use('/', recipeRoutes)

export { router }
