import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Cart from 'App/Models/Cart'

export default class CartsController {
  public async store ({ request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          user_id: schema.number(),
        }),
        messages: {
          'user_id.required': 'o user_id é obrigatório',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const checkCart = await Cart.findBy('finished', false)
    if(checkCart){
      return checkCart
    }

    const cart = await Cart.create(request.post())
    return cart
  }

  public async show ({ params, response }:HttpContextContract){
    const cart = await Cart.query()
      .preload('products', (query) => {
        query.preload('product').where('cart_product.status', true)
      })
      .where({'id': params.id, 'status': true})
      .first()

    if(!cart){
      return response.notFound({error: 'Carrinho não encontrado'})
    }

    return cart
  }

  public async update ({ params, request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          finished: schema.boolean(),
        }),
        messages: {
          'finished.required': 'o finished é obrigatório',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const cart = await Cart.query().where({'id': params.id, 'status': true}).first()
    if(!cart){
      return response.notFound({error: 'Carrinho não encontrado'})
    }

    cart.finished = request.input('finished')

    cart.save()

    return cart
  }

  public async destroy ({ params, response }:HttpContextContract){
    const cart = await Cart.query().where({id: params.id, status: true}).first()
    if(!cart){
      return response.notFound({error: 'Carrinho não encontrado'})
    }

    cart.status = false
    cart.save()

    return {message: 'Carrinho apagado com sucesso.'}
  }
}
