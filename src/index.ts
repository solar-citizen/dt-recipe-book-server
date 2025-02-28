import express from 'express'
import cors from 'cors'

import { config } from 'dotenv'
import { logger } from '@/src/middleware'
import { router } from '@/src/routes'

config()

const app = express()
const port = Number(process.env.APP_PORT) || 6789

app.use(cors())
app.use(logger)
app.use(express.json())
app.use(router)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
