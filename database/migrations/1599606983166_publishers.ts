import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Publishers extends BaseSchema {
  protected tableName = 'publishers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 64).notNullable().unique()
      table.boolean('status').notNullable().defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
