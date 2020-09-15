import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'

import Product from 'App/Models/Product'

export default class CartProduct extends BaseModel {
  public static table = 'cart_product'

  @column({ isPrimary: true })
  public id: number

  @column()
  public cart_id: number

  @column()
  public product_id: number

  @column()
  public quantity: number

  @column()
  public status: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Product, {
    foreignKey: 'id',
  })
  public product: HasOne<typeof Product>
}
