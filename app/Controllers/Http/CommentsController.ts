import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Product from 'App/Models/Product'
import Comment from 'App/Models/Comment'

export default class CommentsController {
  public async store ({ request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          user_id: schema.number(),
          product_id: schema.number(),
          comment: schema.string(),
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

    const comment = await Comment.create(request.post())
    return comment
  }

  public async update ({ params, request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          comment: schema.string(),
        }),
        messages: {
          required: 'o comentario é obrigatório',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const comment = await Comment.query().where({'id': params.id, 'status': true}).first()
    if(!comment){
      return response.notFound({error: 'Comentario não encontrado'})
    }

    comment.comment = request.input('comment')
    comment.save()

    return comment
  }

  public async destroy ({ params, response }:HttpContextContract){
    const comment = await Comment.query().where({id: params.id, status: true}).first()
    if(!comment){
      return response.notFound({error: 'Comentario não encontrado'})
    }

    comment.status = false
    comment.save()

    return {message: 'Comentario apagado com sucesso.'}
  }
}
