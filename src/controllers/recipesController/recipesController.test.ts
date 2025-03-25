import axios from 'axios'
import { config } from 'dotenv'
import { NextFunction, Request, Response } from 'express'

import { RecipesController } from '@/src/controllers'

config({ path: './.env.test' })

jest.mock('axios', () => ({
  get: jest.fn(),
}))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { get } = axios as jest.Mocked<typeof axios>

describe('RecipesController', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.MockedFunction<NextFunction>

  const originalBaseUrl = process.env.BASE_URL ?? ''

  beforeEach(() => {
    req = {
      query: {},
      params: {},
    }
    res = {
      json: jest.fn(),
    }
    next = jest.fn() as jest.MockedFunction<NextFunction>

    jest.clearAllMocks()
  })

  afterAll(() => {
    process.env.BASE_URL = originalBaseUrl
  })

  describe('getRecipes', () => {
    const mockRecipeData = { meals: [{ idMeal: '1', strMeal: 'Test Recipe' }] }

    it('should get all recipes when no filter is provided', async () => {
      get.mockResolvedValueOnce({ data: mockRecipeData })

      await RecipesController.getRecipes(req as Request, res as Response, next as NextFunction)

      expect(get).toHaveBeenCalledWith(`${originalBaseUrl}/search.php?s=`)
      expect(res.json).toHaveBeenCalledWith(mockRecipeData)
      expect(next).not.toHaveBeenCalled()
    })

    it('should filter recipes by ingredient', async () => {
      req.query = { ingredient: 'chicken_breast' }
      get.mockResolvedValueOnce({ data: mockRecipeData })

      await RecipesController.getRecipes(req as Request, res as Response, next as NextFunction)

      expect(get).toHaveBeenCalledWith(`${originalBaseUrl}/filter.php?i=chicken_breast`)
      expect(res.json).toHaveBeenCalledWith(mockRecipeData)
      expect(next).not.toHaveBeenCalled()
    })

    it('should filter recipes by country', async () => {
      req.query = { country: 'Canadian' }
      get.mockResolvedValueOnce({ data: mockRecipeData })

      await RecipesController.getRecipes(req as Request, res as Response, next as NextFunction)

      expect(get).toHaveBeenCalledWith(`${originalBaseUrl}/filter.php?a=Canadian`)
      expect(res.json).toHaveBeenCalledWith(mockRecipeData)
      expect(next).not.toHaveBeenCalled()
    })

    it('should filter recipes by category', async () => {
      req.query = { category: 'Seafood' }
      get.mockResolvedValueOnce({ data: mockRecipeData })

      await RecipesController.getRecipes(req as Request, res as Response, next as NextFunction)

      expect(get).toHaveBeenCalledWith(`${originalBaseUrl}/filter.php?c=Seafood`)
      expect(res.json).toHaveBeenCalledWith(mockRecipeData)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle API errors', async () => {
      const mockError = new Error('API Error')
      get.mockRejectedValueOnce(mockError)

      await RecipesController.getRecipes(req as Request, res as Response, next as NextFunction)

      expect(next).toHaveBeenCalledWith(mockError)
    })
  })

  describe('getRecipeById', () => {
    const mockRecipeDetailData = {
      meals: [
        {
          idMeal: '52772',
          strMeal: 'Teriyaki Chicken Casserole',
          strInstructions: 'Cook instructions',
          strArea: 'Japanese',
        },
      ],
    }

    it('should get recipe details by id', async () => {
      req.params = { id: '52772' }
      get.mockResolvedValueOnce({ data: mockRecipeDetailData })

      await RecipesController.getRecipeById(req as Request, res as Response, next as NextFunction)

      expect(get).toHaveBeenCalledWith(`${originalBaseUrl}/lookup.php?i=52772`)
      expect(res.json).toHaveBeenCalledWith(mockRecipeDetailData)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle API errors when getting recipe details', async () => {
      req.params = { id: 'invalid-id' }
      const mockError = new Error('API Error')
      get.mockRejectedValueOnce(mockError)

      await RecipesController.getRecipeById(req as Request, res as Response, next as NextFunction)

      expect(next).toHaveBeenCalledWith(mockError)
    })
  })
})
