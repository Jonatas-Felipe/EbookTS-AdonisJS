import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Avatars extends BaseSchema {
  protected tableName = 'avatars'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 64).notNullable()
      table.string('path', 64).notNullable()
      table.boolean('status').notNullable().defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
