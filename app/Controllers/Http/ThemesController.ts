import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import Theme from 'App/Models/Theme'

export default class ThemesController {
  public async index (){
    const themes = await Theme.findMany([{status: true}])
    return themes
  }

  public async store ({ request, response }:HttpContextContract){
    try {
      await request.validate({
        schema: schema.create({
          name: schema.string({}, [
            rules.unique({ table: 'themes', column: 'name' }),
          ]),
        }),
        messages: {
          'name.required': 'o nome é obrigatório',
          'name.unique': 'Tema já cadastrado e/ou desativado',
        },
      })
    } catch (error) {
      return response.unprocessableEntity(error.messages)
    }

    const theme = await Theme.create(request.post())
    return theme
  }

  public async show ({ params, response }:HttpContextContract){
    const theme = await Theme.query().where({'id': params.id, 'status': true}).first()

    if(!theme){
      return response.notFound({error: 'Tema não encontrado'})
    }

    return theme
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

    const theme = await Theme.query().where({'id': params.id, 'status': true}).first()
    if(!theme){
      return response.notFound({error: 'Tema não encontrado'})
    }

    const checkTheme = await Theme.findBy('name', request.input('name'))
    if(theme.name !== request.input('name') && checkTheme){
      return response.badRequest({error: 'Tema já cadastrado'})
    }

    theme.name = request.input('name')

    theme.save()

    return theme
  }

  public async destroy ({ params, response }:HttpContextContract){
    const theme = await Theme.query().where({id: params.id, status: true}).first()
    if(!theme){
      return response.notFound({error: 'Tema não encontrado'})
    }

    theme.status = false
    theme.save()

    return {message: 'Tema apagado com sucesso.'}
  }
}
