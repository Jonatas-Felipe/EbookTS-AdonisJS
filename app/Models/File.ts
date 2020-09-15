import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({columnName: 'product_id'})
  public productId: number

  @column()
  public name: string

  @column({
    consume: (path: string) => `http://${Env.get('HOST')}:${Env.get('PORT')}/images/${path}`,
  })
  public path: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
