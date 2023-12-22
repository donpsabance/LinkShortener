import express, { type Application, type Response, type Request, type NextFunction } from 'express'
import 'dotenv/config'
import redirectRoute from './routes/redirect.js'
import apiRoute from './routes/api.js'
import type { ShortenedLink } from './models/shortenedLinksRepository.js'
import { createClient } from 'redis'
import { PostgresRepository } from './models/postgresRepository.js'
import pg from 'pg'
import fs from 'fs'

const app: Application = express()
const port = (process.env.SERVER_PORT ?? 8000)

const postgresClient = new pg.Client()
export const redisClient = createClient({
  url: 'redis://redis:6380'
})

await postgresClient.connect()
await redisClient.connect()
createTables()

redisClient.on('error', err => { console.log('Redis Client Error', err) })

export const shortenedLinksRepository: PostgresRepository<ShortenedLink> = new PostgresRepository<ShortenedLink>(postgresClient, 'mapping')

function createTables (): void {
  console.log('creating tables...')
  fs.readFile(process.cwd() + '/tables.sql', 'utf8', (err, data) => {
    if (err != null) {
      console.error(err)
      return
    }
    console.log(data)
    void postgresClient.query(data)
  })
}

app.listen(port, () => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const startTime = new Date().getTime()
    console.log(`incoming: request ${req.method} ${req.url}`)

    res.on('finish', () => {
      console.log(`outgoing: result ${req.method} ${req.url}:${res.statusCode}`)
      console.log(`    ->${(new Date().getTime() - startTime)} ms`)
    })
    next()
  })

  // routes
  app.use('/', redirectRoute)
  app.use('/api/', apiRoute)

  console.log(`running server on http://localhost:${port}`)
})
