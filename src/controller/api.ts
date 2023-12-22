import { type Request, type Response } from 'express'
import { customAlphabet } from 'nanoid'
import { shortenedLinksRepository } from '../index.js'
import { saveToRedis } from '../utils/cache.js'
import { ShortenedLink } from '../models/shortenedLinksRepository.js'

function generateShortValue (): string {
  const nanoid = customAlphabet('6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz', 15)
  return nanoid()
}

async function generateShortenedLink (longURL: string): Promise<ShortenedLink> {
  const link: ShortenedLink = new ShortenedLink(longURL, generateShortValue(), Date.now())
  return await shortenedLinksRepository.create(link)
}

async function getLink (field: string, key: string): Promise<ShortenedLink> {
  return await shortenedLinksRepository.findOne(field, key)
}

async function generateShortLinkController (req: Request, res: Response): Promise<void> {
  if (req.body?.longURL != null) {
    // check first if it exists
    const exists = await getLink('longURL', req.body.longURL as string)
    if (exists == null) {
      const generated = await generateShortenedLink(req.body.longURL as string)
      await saveToRedis(generated.shortURL, generated.longURL)

      console.log(`generated ${generated.shortURL} for ${generated.longURL}`)
      res.status(201).json({ shortURL: req.protocol + '://' + req.get('host') + '/' + (generated.shortURL), longURL: (generated.longURL) })
    } else {
      console.log(`fetching existing for ${req.body.longURL}`)
      res.status(200).json({ shortURL: req.protocol + '://' + req.get('host') + '/' + (exists.shortURL), longURL: (exists.longURL) })
    }
  } else {
    res.status(400).json({ error: 'longURL field missing' })
  }
}

async function deleteShortLinkController (req: Request, res: Response): Promise<void> {
  const toDelete = req.params.shortURL
  const exists = await getLink('shortURL', toDelete)
  if (exists == null) {
    res.status(400).json({ error: 'shortURL does not exist' })
  } else {
    await shortenedLinksRepository.delete('shortURL', toDelete)
    res.status(204).end()
  }
}

export default { generateShortLinkController, deleteShortLinkController, getLink, generateShortValue }
