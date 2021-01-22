import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { CoreEntity } from "./core.entity";
import { Podcast } from "./podcast.entity";

@InputType("SubscribeInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class Subscribe extends CoreEntity {
  @ManyToOne((type) => Podcast, (podcast) => podcast.subscribe, {
    onDelete: "CASCADE",
  })
  @Field((type) => Podcast)
  podcast: Podcast;

  @RelationId((subscribe: Subscribe) => subscribe.podcast)
  podcastId: number;

  @ManyToOne((type) => User, (user) => user.subscribe)
  @Field((type) => User)
  user: User;

  @RelationId((subscribe: Subscribe) => subscribe.user)
  userId: number;
}
