import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'

export default class UsersController {
  public async index (){
    const users = await User.query()
      .preload('avatar')
      .where('status', true)
    return users
  }

  public async store ({ request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          avatar_id: schema.number(),
          user_type_id: schema.number(),
          document: schema.string({}, [
            rules.unique({ table: 'users', column: 'document' }),
          ]),
          name: schema.string(),
          description: schema.string(),
          email: schema.string({}, [
            rules.email(),
            rules.unique({ table: 'users', column: 'email' }),
          ]),
          password: schema.string(),
          birthday: schema.string(),
          cellphone: schema.number.optional([
            rules.requiredIfNotExists('telephone'),
            rules.phone(),
          ]),
          telephone: schema.number.optional([
            rules.requiredIfNotExists('cellphone'),
            rules.phone(),
          ]),
        }),
        messages: {
          required: '{{ field }} é obrigatório',
          'email.email': 'Insira um e-mail válido',
          'email.unique': 'E-mail já cadastrado e/ou usuário desativado',
          'document.unique': 'Documento já cadastrado e/ou usuário desativado',
          'cellphone.requiredIfNotExists': 'O celular é obrigatório já que não foi enviado o telefone',
          'cellphone.phone': 'Número de celular inválido',
          'cellphone.number': 'Envie apenas números',
          'telephone.requiredIfNotExists': 'O telefone é obrigatório já que não foi enviado o celular',
          'telephone.phone': 'Número de telefone inválido',
          'telephone.number': 'Envie apenas números',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const chekDocument = await User.findBy('document', request.input('document'))
    if(chekDocument){
      if(chekDocument.status){
        return response.badRequest({error: 'Documento já cadastrado'})
      }else{
        return response.badRequest({error: 'Documento já cadastrado e usuário desativado'})
      }
    }

    const user = await User.create(request.post())

    return user
  }

  public async show ({ params, response }:HttpContextContract){
    const user = await User.query()
      .preload('avatar')
      .preload('addresses', (query) => {
        query.where('status', true)
      })
      .preload('products', (query) => {
        query.where('status', true)
      })
      .preload('orders')
      .preload('favorites', (favorites) => {
        favorites.preload('product', (product) => {
          product.where('status', true)
        }).where('status', true)
      })
      .where({'id': params.id, 'status': true})
      .first()

    if(!user){
      return response.notFound({error: 'Usuário não encontrado'})
    }

    return user
  }

  public async update ({ params, request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          avatar_id: schema.number(),
          user_type_id: schema.number(),
          document: schema.string.optional(),
          name: schema.string(),
          description: schema.string(),
          email: schema.string.optional({}, [
            rules.email(),
          ]),
          password: schema.string(),
          birthday: schema.string(),
          cellphone: schema.number.optional([
            rules.requiredIfNotExists('telephone'),
            rules.phone(),
          ]),
          telephone: schema.number.optional([
            rules.requiredIfNotExists('cellphone'),
            rules.phone(),
          ]),
        }),
        messages: {
          required: '{{ field }} é obrigatório',
          'email.email': 'Insira um e-mail válido',
          'cellphone.requiredIfNotExists': 'O celular é obrigatório já que não foi enviado o telefone',
          'cellphone.phone': 'Número de celular inválido',
          'cellphone.number': 'Envie apenas números',
          'telephone.requiredIfNotExists': 'O telefone é obrigatório já que não foi enviado o celular',
          'telephone.phone': 'Número de telefone inválido',
          'telephone.number': 'Envie apenas números',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const user = await User.query().where({id: params.id, status: true}).first()
    if(!user){
      return response.notFound({error: 'Usuário não encontrado'})
    }

    const chekEmail = await User.findBy('email', request.input('email'))
    if(user.email !== request.input('email') && chekEmail){
      return response.badRequest({error: 'E-mail já cadastrado'})
    }

    const chekDocument = await User.findBy('document', request.input('document'))
    if(user.document !== request.input('document') && chekDocument){
      return response.badRequest({error: 'Documento já cadastrado'})
    }

    const updated = User.query().where('id', params.id).update(request.post())
    if(!updated){
      return response.badRequest({error: 'Erro ao editar dados'})
    }

    const userUpdated = await User.findBy('id', params.id)

    return userUpdated
  }

  public async destroy ({ params, response }:HttpContextContract){
    const user = await User.query().where({id: params.id, status: true}).first()
    if(!user){
      return response.notFound({error: 'Usuário não encontrado'})
    }

    user.status = false
    user.save()

    return {message: 'Usuário apagado com sucesso'}
  }
}
