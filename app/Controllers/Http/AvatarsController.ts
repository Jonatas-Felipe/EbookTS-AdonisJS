import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

import Avatar from 'App/Models/Avatar'

export default class AvatarsController {
  public async store ({request, response}: HttpContextContract){
    const file = request.file('avatar', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (!file) {
      return response.badRequest({error: 'Por favor envie uma imagem'})
    }

    if (file.hasErrors) {
      return response.badRequest(file.errors)
    }

    await file.move(Application.publicPath('images'), {
      name: `${new Date().getTime()}.${file.extname}`,
    })

    const data = {
      name: file.clientName,
      path: file.fileName,
    }

    const avatar = await Avatar.create(data)

    return avatar
  }
}
