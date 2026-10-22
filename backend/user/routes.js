import {registerController,loginController,destroyController,currentUserController,listUsersController,updateController} from './controller.js';

export default async function userRoutes(server) {
  server.post('/user', registerController);
  server.post('/login', loginController);

  server.get('/user', listUsersController);
  server.get('/user/me', currentUserController);

  server.put('/user/:id', updateController);
  server.delete('/user/:id', destroyController);
}