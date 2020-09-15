import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import Publisher from 'App/Models/Publisher'

export default class PublishersController {
  public async index (){
    const publishers = await Publisher.findMany([{status: true}])
    return publishers
  }

  public async store ({ request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          name: schema.string({}, [
            rules.unique({ table: 'publishers', column: 'name' }),
          ]),
        }),
        messages: {
          'name.required': 'o nome é obrigatório',
          'name.unique': 'Editora já cadastrado e/ou desativado',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const publisher = await Publisher.create(request.post())
    return publisher
  }

  public async show ({ params, response }:HttpContextContract){
    const publisher = await Publisher.query().where({'id': params.id, 'status': true}).first()

    if(!publisher){
      return response.notFound({error: 'Editora não encontrado'})
    }

    return publisher
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

    const publisher = await Publisher.query().where({'id': params.id, 'status': true}).first()
    if(!publisher){
      return response.notFound({error: 'Editora não encontrado'})
    }

    const checkPublisher = await Publisher.findBy('name', request.input('name'))
    if(publisher.name !== request.input('name') && checkPublisher){
      return response.badRequest({error: 'Editora já cadastrado'})
    }

    publisher.name = request.input('name')

    publisher.save()

    return publisher
  }

  public async destroy ({ params, response }:HttpContextContract){
    const publisher = await Publisher.query().where({id: params.id, status: true}).first()
    if(!publisher){
      return response.notFound({error: 'Editora não encontrado'})
    }

    publisher.status = false
    publisher.save()

    return {message: 'Editora apagado com sucesso.'}
  }
}
