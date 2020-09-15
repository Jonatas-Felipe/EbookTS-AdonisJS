import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Order from 'App/Models/Order'

export default class OrdersController {
  public async index (){
    const orders = await Order.findMany([{status: true}])
    return orders
  }

  public async store ({ request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          user_id: schema.number(),
          address_id: schema.number(),
          cart_id: schema.number(),
          total: schema.number(),
          type: schema.string(),
        }),
        messages: {
          required: '{{ field }} é obrigatório',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const order = await Order.create(request.post())
    return order
  }

  public async show ({ params, response }:HttpContextContract){
    const order = await Order.query().where({'id': params.id, 'status': true}).first()

    if(!order){
      return response.notFound({error: 'Pedido não encontrado'})
    }

    return order
  }

  public async update ({ params, request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          user_id: schema.number(),
          address_id: schema.number(),
          cart_id: schema.number(),
          total: schema.number(),
          type: schema.string(),
        }),
        messages: {
          required: '{{ field }} é obrigatório',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const order = await Order.query().where({'id': params.id, 'status': true}).first()
    if(!order){
      return response.notFound({error: 'Pedido não encontrado'})
    }

    order.address_id = request.input('address_id')
    order.total = request.input('total')
    order.type = request.input('type')

    order.save()

    return order
  }

  public async destroy ({ params, response }:HttpContextContract){
    const order = await Order.query().where({id: params.id, status: true}).first()
    if(!order){
      return response.notFound({error: 'Pedido não encontrado'})
    }

    order.status = false
    order.save()

    return {message: 'Pedido apagado com sucesso.'}
  }
}
