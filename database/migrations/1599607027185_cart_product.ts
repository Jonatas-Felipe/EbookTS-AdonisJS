import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductsCarts extends BaseSchema {
  protected tableName = 'cart_product'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('cart_id')
        .unsigned()
        .references('id')
        .inTable('carts')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.integer('quantity').notNullable().defaultTo(1)
      table.boolean('status').notNullable().defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
