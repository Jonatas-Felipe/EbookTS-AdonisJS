import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.integer('author_id')
        .unsigned()
        .references('id')
        .inTable('authors')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.integer('publish_id')
        .unsigned()
        .references('id')
        .inTable('publishers')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.integer('theme_id')
        .unsigned()
        .references('id')
        .inTable('themes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.string('title', 128).notNullable()
      table.text('synopsis').notNullable()
      table.integer('pages').notNullable()
      table.float('value').notNullable()
      table.integer('amount').notNullable()
      table.string('preference').notNullable()
      table.boolean('sponsored').notNullable()
      table.boolean('status').notNullable().defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
