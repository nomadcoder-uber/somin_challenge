import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { Subscribe } from "../entities/subscribe.entity";
import { CoreOutput } from "./output.dto";

@InputType()
export class SubscribeInput {
  @Field((type) => Int)
  podcastId: number;

  @Field((type) => Int)
  userId: number;
}

@ObjectType()
export class SubscribeOutput extends CoreOutput {
  @Field((type) => [Subscribe], { nullable: true })
  subscribe?: Subscribe[];

  // @Field((type) => [Podcast], { nullable: true })
  // potcast?: Podcast[];
}
