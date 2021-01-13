import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/podcast/dtos/output.dto';
import { User } from '../entities/user.entity';

@ArgsType()
export class SeeProfileInput {
  @Field(type => Number)
  userId: number;
}

@ObjectType()
export class SeeProfileOutput extends CoreOutput {
  @Field(type => User, { nullable: true })
  user?: User;
}
