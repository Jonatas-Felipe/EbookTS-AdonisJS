import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import Address from 'App/Models/Address'

export default class AdressesController {
  public async index (){
    const addresses = Address.findMany([{status: true}])
    return addresses
  }

  public async store ({request, response}: HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          user_id: schema.number(),
          zipcode: schema.string({}, [
            rules.maxLength(8),
            rules.minLength(8),
          ]),
          street: schema.string(),
          number: schema.number(),
          neighborhood: schema.string(),
          city: schema.string(),
          state: schema.string({}, [
            rules.maxLength(2),
            rules.minLength(2),
          ]),
        }),
        messages: {
          required: '{{ field }} é obrigatório',
          'zipcode.maxLength': 'O cep deve possuir apenas os números',
          'zipcode.minLength': 'O cep deve possuir apenas os números',
          'state.maxLength': 'O estado deve possuir apenas 2 caracteres',
          'state.minLength': 'O estado deve possuir apenas 2 caracteres',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const addresses = await Address.create(request.post())
    return addresses
  }

  public async show ({params, response}: HttpContextContract){
    const { id } = params
    const address = await Address.query().where({id: id, status: true}).first()

    if(!address){
      return response.notFound({error: 'Endereço não encontrado'})
    }

    return address
  }

  public async update ({params, request, response}: HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          user_id: schema.number(),
          zipcode: schema.string({}, [
            rules.maxLength(8),
            rules.minLength(8),
          ]),
          street: schema.string(),
          number: schema.number(),
          neighborhood: schema.string(),
          city: schema.string(),
          state: schema.string({}, [
            rules.maxLength(2),
            rules.minLength(2),
          ]),
        }),
        messages: {
          required: '{{ field }} é obrigatório',
          'zipcode.maxLength': 'O cep deve possuir apenas os números',
          'zipcode.minLength': 'O cep deve possuir apenas os números',
          'state.maxLength': 'O estado deve possuir apenas 2 caracteres',
          'state.minLength': 'O estado deve possuir apenas 2 caracteres',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const { id } = params
    const address = await Address.query().where({id: id, status: true}).first()

    if(!address){
      return response.notFound({error: 'Endereço não encontrado'})
    }

    address.userId = request.input('user_id')
    address.zipcode = request.input('zipcode')
    address.street = request.input('street')
    address.number = request.input('number')
    address.neighborhood = request.input('neighborhood')
    address.city = request.input('city')
    address.state = request.input('state')
    address.complement = request.input('complement')

    address.save()

    return address
  }

  public async destroy ({params, response}: HttpContextContract){
    const { id } = params
    const address = await Address.query().where({id: id, status: true}).first()

    if(!address){
      return response.notFound({error: 'Endereço não encontrado'})
    }

    address.status = false

    address.save()

    return {message: 'apagado com sucesso'}
  }
}
