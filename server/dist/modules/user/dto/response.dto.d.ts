import { Role, User } from '@prisma/client';
export declare class UserResponseDTO implements User {
    constructor(partial: Partial<UserResponseDTO>);
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    isVerified: boolean;
    drivingLicenceId: string;
    role: Role;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
