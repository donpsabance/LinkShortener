import { type Client } from 'pg'
import { type BaseRepository } from './repository.js'

export class PostgresRepository<T> implements BaseRepository<T> {
  private readonly _client: Client
  private readonly _tableName: string
  constructor (client: Client, tableName: string) {
    this._client = client
    this._tableName = tableName
  }

  async create (item: T): Promise<T> {
    // wrap each key in quotes, otherwise Postgres will lower case fold them
    // which makes it difficult to cast it back to an object
    const properties = Object.keys(item as object).map(key => `"${key}"`).join()
    let preparedValues = ''

    for (let i = 0; i < Object.keys(item as object).length; i++) {
      preparedValues += '$' + (i + 1) + ', '
    }
    preparedValues = preparedValues.slice(0, -2)

    const query = {
      text: 'INSERT INTO ' + this._tableName + ' (' + properties + ') VALUES (' + preparedValues + ') RETURNING *',
      values: Object.values(item as object)
    }
    const res = await this._client.query(query)
    return res.rows[0] as T
  }

  async findOne (key: string, value: string): Promise<T> {
    const query = {
      text: 'SELECT * FROM ' + this._tableName + ' WHERE "' + key + '" = $1',
      values: [value]
    }
    const res = await this._client.query(query)
    return res.rows[0] as T
  }

  async delete (key: string, value: string): Promise<T> {
    const query = {
      name: 'delete-longurl',
      text: 'DELETE FROM ' + this._tableName + ' WHERE "' + key + '" = $1',
      values: [value]
    }
    const res = await this._client.query(query)
    return res.rows[0] as T
  }
}
