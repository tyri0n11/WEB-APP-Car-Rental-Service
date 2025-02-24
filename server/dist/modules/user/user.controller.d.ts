import { UserService } from './user.service';
import { UpdateUserRequestDTO } from './dto/update.request.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getOne(id: string): Promise<any>;
    update(id: string, dto: UpdateUserRequestDTO): Promise<any>;
}
