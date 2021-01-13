import { Repository } from 'typeorm';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { SeeProfileOutput } from './dtos/user-profile.dto';
export declare class UsersService {
    private readonly users;
    private readonly jwtService;
    constructor(users: Repository<User>, jwtService: JwtService);
    createAccount({ email, password, role, }: CreateAccountInput): Promise<CreateAccountOutput>;
    login({ email, password }: LoginInput): Promise<LoginOutput>;
    findById(id: number): Promise<SeeProfileOutput>;
    deleteProfile(id: number): Promise<boolean>;
    editProfile(userId: number, { email, password }: EditProfileInput): Promise<EditProfileOutput>;
}
