import { registerHandler, loginHandler, destroyHandler, currentUserHandler, listUsersHandler, updateHandler } from './handler.js';

export default async function userRoutes(server) {
    server.post('/user', registerHandler);
    server.post('/login', loginHandler);

    
    server.get('/user', listUsersHandler);
    server.get('/user/me', currentUserHandler);

    server.put('/user/:id', updateHandler);
    server.delete('/user/:id', destroyHandler);
    
}