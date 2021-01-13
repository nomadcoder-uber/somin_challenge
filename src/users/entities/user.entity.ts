import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsEnum } from 'class-validator';
import { Podcast } from 'src/podcast/entities/podcast.entity';

enum UserRole {
  Host,
  Listener,
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Field(type => Number)
  id: number;

  @Column()
  @Field(type => String)
  @IsEmail()
  email: string;

  @Column()
  @Field(type => String)
  password: string;

  @Column()
  @Field(type => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Field(type => [Podcast])
  @OneToMany(type => Podcast, podcast => podcast.host)
  podcast: Podcast[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
