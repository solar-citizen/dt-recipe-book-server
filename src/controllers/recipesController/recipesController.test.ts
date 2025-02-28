import { NextFunction, Request, Response } from 'express'
import axios from 'axios'
import { RecipesController } from '@/src/controllers'
import { config } from 'dotenv'

config({ path: './.env.test' })

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('RecipesController', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock<NextFunction>

  const originalBaseUrl = process.env.BASE_URL

  beforeEach(() => {
    req = {
      query: {},
      params: {},
    }
    res = {
      json: jest.fn(),
    }
    next = jest.fn()

    jest.clearAllMocks()
  })

  afterAll(() => {
    process.env.BASE_URL = originalBaseUrl
  })

  describe('getRecipes', () => {
    const mockRecipeData = { meals: [{ idMeal: '1', strMeal: 'Test Recipe' }] }

    it('should get all recipes when no filter is provided', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockRecipeData })

      await RecipesController.getRecipes(req as Request, res as Response, next)

      expect(mockedAxios.get).toHaveBeenCalledWith(`${originalBaseUrl}/search.php?s=`)
      expect(res.json).toHaveBeenCalledWith(mockRecipeData)
      expect(next).not.toHaveBeenCalled()
    })

    it('should filter recipes by ingredient', async () => {
      req.query = { ingredient: 'chicken_breast' }
      mockedAxios.get.mockResolvedValueOnce({ data: mockRecipeData })

      await RecipesController.getRecipes(req as Request, res as Response, next)

      expect(mockedAxios.get).toHaveBeenCalledWith(`${originalBaseUrl}/filter.php?i=chicken_breast`)
      expect(res.json).toHaveBeenCalledWith(mockRecipeData)
      expect(next).not.toHaveBeenCalled()
    })

    it('should filter recipes by country', async () => {
      req.query = { country: 'Canadian' }
      mockedAxios.get.mockResolvedValueOnce({ data: mockRecipeData })

      await RecipesController.getRecipes(req as Request, res as Response, next)

      expect(mockedAxios.get).toHaveBeenCalledWith(`${originalBaseUrl}/filter.php?a=Canadian`)
      expect(res.json).toHaveBeenCalledWith(mockRecipeData)
      expect(next).not.toHaveBeenCalled()
    })

    it('should filter recipes by category', async () => {
      req.query = { category: 'Seafood' }
      mockedAxios.get.mockResolvedValueOnce({ data: mockRecipeData })

      await RecipesController.getRecipes(req as Request, res as Response, next)

      expect(mockedAxios.get).toHaveBeenCalledWith(`${originalBaseUrl}/filter.php?c=Seafood`)
      expect(res.json).toHaveBeenCalledWith(mockRecipeData)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle API errors', async () => {
      const mockError = new Error('API Error')
      mockedAxios.get.mockRejectedValueOnce(mockError)

      await RecipesController.getRecipes(req as Request, res as Response, next)

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
      mockedAxios.get.mockResolvedValueOnce({ data: mockRecipeDetailData })

      await RecipesController.getRecipeById(req as Request, res as Response, next)

      expect(mockedAxios.get).toHaveBeenCalledWith(`${originalBaseUrl}/lookup.php?i=52772`)
      expect(res.json).toHaveBeenCalledWith(mockRecipeDetailData)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle API errors when getting recipe details', async () => {
      req.params = { id: 'invalid-id' }
      const mockError = new Error('API Error')
      mockedAxios.get.mockRejectedValueOnce(mockError)

      await RecipesController.getRecipeById(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(mockError)
    })
  })
})
