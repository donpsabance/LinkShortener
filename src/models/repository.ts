// using the repository pattern
interface Reader <T> {
  findOne: (key: string, value: string) => Promise<T>
}

interface Writer <T> {
  create: (item: T) => Promise<T>
  delete: (key: string, value: string) => Promise<T>
}

export type BaseRepository<T> = Reader<T> & Writer<T>
