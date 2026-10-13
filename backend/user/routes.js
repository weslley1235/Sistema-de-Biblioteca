import { registerHandler, loginHandler, destroyHandler, currentUserHandler } from './handler.js';

export default async function userRoutes(server) {
    server.post('/user', registerHandler);
    server.post('/login', loginHandler);
    server.delete('/user/:id', destroyHandler);
    server.get('/user/me', currentUserHandler);

}