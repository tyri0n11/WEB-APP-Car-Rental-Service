import express from 'express';
import bodyParser from 'body-parser';
import container from './container';
import { UserController } from './controllers/userController';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const userController = container.resolve<UserController>('userController');

app.post('/api/users', userController.createUser.bind(userController));
app.get('/api/users/:id', userController.getUser.bind(userController));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});