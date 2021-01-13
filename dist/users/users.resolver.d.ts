import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { SeeProfileInput, SeeProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    createAccount(createAccountInput: CreateAccountInput): Promise<CreateAccountOutput>;
    login(loginInput: LoginInput): Promise<LoginOutput>;
    me(authUser: User): User;
    seeProfile(userProfileInput: SeeProfileInput): Promise<SeeProfileOutput>;
    deleteProfile(userProfileInput: SeeProfileInput): Promise<boolean>;
    editProfile(authUser: User, editProfileInput: EditProfileInput): Promise<EditProfileOutput>;
}
