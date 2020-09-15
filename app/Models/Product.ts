import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'
import Author from 'App/Models/Author'
import Publisher from 'App/Models/Publisher'
import Theme from 'App/Models/Theme'
import File from 'App/Models/File'
import Comment from 'App/Models/Comment'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({columnName: 'user_id'})
  public userId: number

  @column()
  public author_id: number

  @column()
  public publish_id: number

  @column()
  public theme_id: number

  @column()
  public title: string

  @column()
  public synopsis: string

  @column()
  public pages: number

  @column()
  public value: number

  @column()
  public amount: number

  @column()
  public preference: string

  @column()
  public sponsored: boolean

  @column()
  public status: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => User, {
    foreignKey: 'id',
  })
  public user: HasOne<typeof User>

  @hasOne(() => Author, {
    foreignKey: 'id',
  })
  public author: HasOne<typeof Author>

  @hasOne(() => Publisher, {
    foreignKey: 'id',
  })
  public publisher: HasOne<typeof Publisher>

  @hasOne(() => Theme, {
    foreignKey: 'id',
  })
  public theme: HasOne<typeof Theme>

  @hasMany(() => File)
  public files: HasMany<typeof File>

  @hasMany(() => Comment, {
    foreignKey: 'id',
  })
  public comments: HasMany<typeof Comment>
}
