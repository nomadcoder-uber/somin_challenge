import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString, Length } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { CoreEntity } from "./core.entity";
import { Podcast } from "./podcast.entity";

@InputType("ReviewInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class Review extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  @Length(20)
  contents: string;

  @Field((type) => Int)
  @Column()
  @IsNumber()
  rating: number;

  @Field((type) => Podcast)
  @ManyToOne((type) => Podcast, (podcast) => podcast.review, {
    onDelete: "CASCADE",
  })
  podcast: Podcast;

  @RelationId((review: Review) => review.podcast)
  podcastId: number;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.review, {
    onDelete: "CASCADE",
  })
  user: User;

  @RelationId((review: Review) => review.user)
  userId: number;
}
