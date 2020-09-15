import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasOne, HasOne, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Avatar from 'App/Models/Avatar'
import Address from 'App/Models/Address'
import Product from 'App/Models/Product'
import Order from 'App/Models/Order'
import Favorite from 'App/Models/Favorite'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public avatar_id: number

  @column()
  public user_type_id: number

  @column()
  public document: string

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public birthday: string

  @column()
  public cellphone: number

  @column()
  public telephone: number

  @column()
  public status: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User){
    if(user.$dirty.password){
      user.password = await Hash.make(user.password)
    }
  }

  @hasOne(() => Avatar, {
    foreignKey: 'id',
  })
  public avatar: HasOne<typeof Avatar>

  @hasMany(() => Address)
  public addresses: HasMany<typeof Address>

  @hasMany(() => Product)
  public products: HasMany<typeof Product>

  @hasMany(() => Order, {
    foreignKey: 'id',
  })
  public orders: HasMany<typeof Order>

  @hasMany(() => Favorite, {
    foreignKey: 'id',
  })
  public favorites: HasMany<typeof Favorite>
}
