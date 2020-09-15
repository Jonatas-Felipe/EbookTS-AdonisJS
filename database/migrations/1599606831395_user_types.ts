import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserTypes extends BaseSchema {
  protected tableName = 'user_types'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('user_type', 5).notNullable().unique()
      table.boolean('status').notNullable().defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
