import axios from 'axios'
import { config } from 'dotenv'
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { isNonEmptyString } from '@/src/lib'

config()

const baseUrl = process.env.BASE_URL ?? ''

type RecipeFilterKey = 'ingredient' | 'country' | 'category'
type ValidFilterEntry = { param: RecipeFilterKey; value: string }

const recipeFilters: Record<RecipeFilterKey, string> = {
  ingredient: '/filter.php?i=',
  country: '/filter.php?a=',
  category: '/filter.php?c=',
}

export const RecipesController = {
  getRecipes: asyncHandler(async (req: Request, res: Response) => {
    const filterEntry = (Object.keys(recipeFilters) as RecipeFilterKey[])
      .map(param => ({
        param,
        value: req.query[param],
      }))
      .find((item): item is ValidFilterEntry => isNonEmptyString(item.value))

    const url = filterEntry
      ? `${baseUrl}${recipeFilters[filterEntry.param]}${encodeURIComponent(filterEntry.value)}`
      : `${baseUrl}/search.php?s=`

    const response = await axios.get(url)
    res.json(response.data)
  }),

  getRecipeById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const url = `${baseUrl}/lookup.php?i=${id}`
    const response = await axios.get(url)
    res.json(response.data)
  }),
}
