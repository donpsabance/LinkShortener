export class ShortenedLink {
  longURL: string
  shortURL: string
  createdAtUnix: number

  constructor (longURL: string, shortURL: string, createdAtUnix: number) {
    this.longURL = longURL
    this.shortURL = shortURL
    this.createdAtUnix = createdAtUnix
  }
}
