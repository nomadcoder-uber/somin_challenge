import { CoreOutput } from 'src/podcast/dtos/output.dto';
import { User } from '../entities/user.entity';
export declare class EditProfileOutput extends CoreOutput {
}
declare const EditProfileInput_base: import("@nestjs/common").Type<Partial<Pick<User, "id" | "email" | "password" | "role" | "podcast" | "hashPassword" | "checkPassword">>>;
export declare class EditProfileInput extends EditProfileInput_base {
}
export {};
