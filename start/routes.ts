/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('login', 'AuthController.login')
Route.post('avatars', 'AvatarsController.store')
Route.post('users', 'UsersController.store')
Route.post('addresses', 'AddressesController.store')

Route.group(() => {
  Route.resource('users', 'UsersController').apiOnly().except(['store'])
  Route.resource('addresses', 'AddressesController').apiOnly().except(['store'])
  Route.resource('authors', 'AuthorsController').apiOnly()
  Route.resource('publishers', 'PublishersController').apiOnly()
  Route.resource('themes', 'ThemesController').apiOnly()
  Route.resource('products', 'ProductsController').apiOnly()
  Route.post('files', 'FilesController.store')
  Route.resource('carts', 'CartsController').apiOnly().except(['index'])
  Route.resource('cart-product', 'CartProductsController').apiOnly().except(['index', 'show'])
  Route.resource('orders', 'OrdersController').apiOnly()
  Route.resource('favorites', 'FavoritesController').only(['store', 'update'])
  Route.resource('comments', 'CommentsController').apiOnly().except(['index', 'show'])
}).middleware('checkLogin')

