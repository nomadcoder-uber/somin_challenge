import { Episode } from './episode.entity';
import { CoreEntity } from './core.entity';
import { User } from 'src/users/entities/user.entity';
export declare class Podcast extends CoreEntity {
    title: string;
    category: string;
    rating: number;
    episodes: Episode[];
    host: User;
}
