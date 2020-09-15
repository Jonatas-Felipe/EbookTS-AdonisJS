import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

import File from 'App/Models/File'

export default class FilesController {
  public async store ({request, response}: HttpContextContract){
    const productId = request.input('product_id')
    const files = request.files('files', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (!files) {
      return response.badRequest({error: 'Por favor envie pelo menos uma imagem'})
    }

    let filesResponse:any[] = []

    for(const file of files){
      if (file.hasErrors) {
        filesResponse.push(response.badRequest(file.errors))
      }

      await file.move(Application.publicPath('images'), {
        name: `${new Date().getTime()}.${file.extname}`,
      })

      const data = {
        productId,
        name: file.clientName,
        path: file.fileName,
      }

      filesResponse.push(await File.create(data))
    }

    return filesResponse
  }
}
