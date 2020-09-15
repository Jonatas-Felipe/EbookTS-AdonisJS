import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DetectUserIsLogged {
  public async handle ({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    const loggedIn = await auth.check()
    if(!loggedIn){
      return response.badRequest({error: 'Token Inválido'})
    }
    await next()
  }
}
