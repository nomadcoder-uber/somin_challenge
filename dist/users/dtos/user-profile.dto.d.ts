import { CoreOutput } from 'src/podcast/dtos/output.dto';
import { User } from '../entities/user.entity';
export declare class SeeProfileInput {
    userId: number;
}
export declare class SeeProfileOutput extends CoreOutput {
    user?: User;
}
