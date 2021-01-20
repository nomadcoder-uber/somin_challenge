import { ObjectType, Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { CoreEntity } from "./core.entity";
import { Podcast } from "./podcast.entity";

@InputType("EpisodeInputType", { isAbstract: true })
@Entity()
@ObjectType()
export class Episode extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  title: string;

  @Column()
  @Field((type) => String)
  @IsString()
  category: string;

  @ManyToOne(() => Podcast, (podcast) => podcast.episodes, {
    onDelete: "CASCADE",
  })
  @Field((type) => Podcast)
  podcast: Podcast;
}
