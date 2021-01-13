import { Podcast } from 'src/podcast/entities/podcast.entity';
declare enum UserRole {
    Host = 0,
    Listener = 1
}
export declare class User {
    id: number;
    email: string;
    password: string;
    role: UserRole;
    podcast: Podcast[];
    hashPassword(): Promise<void>;
    checkPassword(aPassword: string): Promise<boolean>;
}
export {};
