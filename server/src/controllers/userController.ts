import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
    constructor(private userService: UserService) {}

    createUser(req: Request, res: Response): void {
        const user = req.body;
        const createdUser = this.userService.createUser(user);
        res.json(createdUser);
    }

    getUser(req: Request, res: Response): void {
        const userId = parseInt(req.params.id, 10);
        const user = this.userService.getUserById(userId);

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }
}