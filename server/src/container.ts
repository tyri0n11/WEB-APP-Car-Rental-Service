import { UserController } from './controllers/userController';
import { UserService, UserServiceImpl } from './services/userService';

class Container {
    private instances: { [key: string]: any } = {};

    register(key: string, instance: any): void {
        this.instances[key] = instance;
    }

    resolve<T>(key: string): T {
        return this.instances[key];
    }
}

const container = new Container();
container.register('userService', new UserServiceImpl());
container.register('userController', new UserController(container.resolve<UserService>('userService')));

export default container;