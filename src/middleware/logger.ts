import { NextFunction, Request, Response } from 'express'

export const logger = (req: Request, _res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString().slice(0, 10)
  console.log(`[${timestamp}] ${req.method} ${req.url}`)
  next()
}
