import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Cart from 'App/Models/Cart'
import CartProduct from 'App/Models/CartProduct'

export default class CartProductsController {
  public async store ({ request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          cart_id: schema.number(),
          product_id: schema.number(),
        }),
        messages: {
          required: '{{ field }} é obrigatório',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const checkCart = await Cart.query()
      .where({id: request.input('cart_id'), finished: true})
      .first()

    if(checkCart){
      return response.badRequest({erro: 'carrinho já finalizado.'})
    }

    const checkCartProduct = await CartProduct.query()
      .where({
        cart_id: request.input('cart_id'),
        product_id: request.input('product_id'),
        status: true,
      })
      .first()

    if(checkCartProduct){
      checkCartProduct.quantity += 1
      checkCartProduct.save()
      return checkCartProduct
    }

    const cartProduct = await CartProduct.create(request.post())
    return cartProduct
  }

  public async update ({ params, request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          quantity: schema.number(),
        }),
        messages: {
          required: 'a quantidade é obrigatória',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const cartProduct = await CartProduct.query().where({'id': params.id, 'status': true}).first()
    if(!cartProduct){
      return response.notFound({error: 'Produto não encontrado no carrinho.'})
    }

    cartProduct.quantity = request.input('quantity')

    cartProduct.save()

    return cartProduct
  }

  public async destroy ({ params, response }:HttpContextContract){
    const cartProduct = await CartProduct.query().where({'id': params.id, 'status': true}).first()
    if(!cartProduct){
      return response.notFound({error: 'Produto não encontrado no carrinho.'})
    }

    cartProduct.status = false
    cartProduct.save()

    return {message: 'Produto removido do carrinho.'}
  }
}
