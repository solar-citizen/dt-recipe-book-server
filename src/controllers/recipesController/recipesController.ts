import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import axios from 'axios'
import { config } from 'dotenv'

config()

const baseUrl = process.env.BASE_URL || ''

export const RecipesController = {
  getRecipes: asyncHandler(async (req: Request, res: Response) => {
    const { ingredient, country, category } = req.query

    let url = ''

    if (ingredient) {
      url = `${baseUrl}/filter.php?i=${ingredient}`
    } else if (country) {
      url = `${baseUrl}/filter.php?a=${country}`
    } else if (category) {
      url = `${baseUrl}/filter.php?c=${category}`
    } else {
      url = `${baseUrl}/search.php?s=`
    }

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
