import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import Author from 'App/Models/Author'

export default class AuthorsController {
  public async index (){
    const authors = await Author.findMany([{status: true}])
    return authors
  }

  public async store ({ request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          name: schema.string({}, [
            rules.unique({ table: 'author', column: 'name' }),
          ]),
        }),
        messages: {
          'name.required': 'o nome é obrigatório',
          'name.unique': 'Autor já cadastrado e/ou desativado',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const author = await Author.create(request.post())
    return author
  }

  public async show ({ params, response }:HttpContextContract){
    const author = await Author.query().where({'id': params.id, 'status': true}).first()

    if(!author){
      return response.notFound({error: 'Autor não encontrado'})
    }

    return author
  }

  public async update ({ params, request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          name: schema.string(),
        }),
        messages: {
          'name.required': 'o nome é obrigatório',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const author = await Author.query().where({'id': params.id, 'status': true}).first()
    if(!author){
      return response.notFound({error: 'Autor não encontrado'})
    }

    const checkAuthor = await Author.findBy('name', request.input('name'))
    if(author.name !== request.input('name') && checkAuthor){
      return response.badRequest({error: 'Autor já cadastrado'})
    }

    author.name = request.input('name')

    author.save()

    return author
  }

  public async destroy ({ params, response }:HttpContextContract){
    const author = await Author.query().where({id: params.id, status: true}).first()
    if(!author){
      return response.notFound({error: 'Autor não encontrado'})
    }

    author.status = false
    author.save()

    return {message: 'Autor apagado com sucesso.'}
  }
}
