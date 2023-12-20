import { type Request, type Response } from 'express'
import apiController from '../controller/api.js'
import { saveToRedis, getFromRedis } from '../utils/cache.js'

async function redirect (req: Request, res: Response): Promise<void> {
  const link = await getFromRedis(req.params.shortURL)

  if (link === '') {
    const dbResult = await apiController.getLink('shortURL', req.params.shortURL)

    if (dbResult == null) {
      res.status(404).end()
    } else {
      await saveAndRedirect(dbResult.shortURL, dbResult.longURL, res)
      console.log('    -> redirecting with database')
    }
  } else {
    await saveAndRedirect(req.params.shortURL, link, res)
    console.log('    -> redirecting with redis')
  }
}

async function saveAndRedirect (shortURL: string, longURL: string, res: Response): Promise<void> {
  await saveToRedis(shortURL, longURL)
  res.redirect(longURL)
}

export default { redirect }
