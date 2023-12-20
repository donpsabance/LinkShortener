import { redisClient } from '../index.js'

export async function saveToRedis (key: string, value: string, expire: number = 604800): Promise<void> {
  await redisClient.set(key, value, { EX: expire })
  console.log('    -> saving to redis ' + key + ':' + value + ' for ' + expire)
}

export async function getFromRedis (key: string): Promise<string> {
  const value = await redisClient.get(key) ?? ''
  if (value !== '') console.log('    -> retrieved from redis ' + key + ':' + value + ' for ')
  return value
}
