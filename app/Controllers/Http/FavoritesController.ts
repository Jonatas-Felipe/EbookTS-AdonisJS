import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Product from 'App/Models/Product'
import Favorite from 'App/Models/Favorite'

export default class FavoritesController {
  public async store ({ request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          user_id: schema.number(),
          product_id: schema.number(),
        }),
        messages: {
          required: '{{ field }} é obrigatório',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const checkProduct = await Product.find(request.input('product_id'))
    if(!checkProduct){
      return response.notFound({error: 'Produto não encontrado'})
    }

    const favorite = await Favorite.create(request.post())
    return favorite
  }

  public async update ({ params, request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          status: schema.boolean(),
        }),
        messages: {
          required: 'o {{ field }} é obrigatório',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const favorite = await Favorite.find(params.id)
    if(!favorite){
      return response.notFound({error: 'Favoritamento não encontrado'})
    }

    favorite.status = request.input('status')
    favorite.save()

    return favorite
  }
}
