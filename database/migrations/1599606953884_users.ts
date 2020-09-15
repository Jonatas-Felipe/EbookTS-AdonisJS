import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('avatar_id')
        .unsigned()
        .references('id')
        .inTable('avatars')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')
        .notNullable()
      table.integer('user_type_id')
        .unsigned()
        .references('id')
        .inTable('user_types')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')
        .notNullable()
      table.string('document', 11).notNullable().unique()
      table.string('name', 64).notNullable()
      table.text('description')
      table.string('email', 256).notNullable().unique()
      table.string('password', 96).notNullable()
      table.date('birthday').notNullable()
      table.integer('cellphone', 11)
      table.integer('telephone', 11)
      table.boolean('status').notNullable().defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
