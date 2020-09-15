import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Product from 'App/Models/Product'

export default class ProductsController {
  public async index (){
    const products = await Product.query()
      .preload('user')
      .preload('author')
      .preload('publisher')
      .preload('theme')
      .preload('files')
      .where('status', true)
    return products
  }

  public async store ({ request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          user_id: schema.number(),
          author_id: schema.number(),
          publish_id: schema.number(),
          theme_id: schema.number(),
          title: schema.string(),
          synopsis: schema.string(),
          pages: schema.number(),
          value: schema.number(),
          amount: schema.number(),
          preference: schema.string(),
        }),
        messages: {
          required: '{{field}} é obrigatório',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const product = await Product.create(request.post())
    return product
  }

  public async show ({ params, response }:HttpContextContract){
    const product = await Product.query()
      .preload('user')
      .preload('author')
      .preload('publisher')
      .preload('theme')
      .preload('files')
      .preload('comments', (comments) => {
        comments.preload('user', (user) => {
          user.where('status', true)
        }).where('status', true)
      })
      .where({'id': params.id, 'status': true})
      .first()

    if(!product){
      return response.notFound({error: 'Produto não encontrado'})
    }

    return product
  }

  public async update ({ params, request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          user_id: schema.number(),
          author_id: schema.number(),
          publish_id: schema.number(),
          theme_id: schema.number(),
          title: schema.string(),
          synopsis: schema.string(),
          pages: schema.number(),
          value: schema.number(),
          amount: schema.number(),
          preference: schema.string(),
        }),
        messages: {
          required: '{{field}} é obrigatório',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const product = await Product.query().where({id: params.id, status: true}).first()
    if(!product){
      return response.notFound({error: 'Produto não encontrado'})
    }

    product.userId = request.input('user_id')
    product.author_id = request.input('author_id')
    product.publish_id = request.input('publish_id')
    product.theme_id = request.input('theme_id')
    product.title = request.input('title')
    product.synopsis = request.input('synopsis')
    product.pages = request.input('pages')
    product.value = request.input('value')
    product.amount = request.input('amount')
    product.preference = request.input('preference')
    product.sponsored = request.input('sponsored')

    product.save()

    return product
  }

  public async destroy ({ params, response }:HttpContextContract){
    const product = await Product.query().where({id: params.id, status: true}).first()
    if(!product){
      return response.notFound({error: 'Produto não encontrado'})
    }

    product.status = false
    product.save()

    return {message: 'Produto apagado com sucesso'}
  }
}
