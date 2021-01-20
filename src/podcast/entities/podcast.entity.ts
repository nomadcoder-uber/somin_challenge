import { Episode } from "./episode.entity";
import { ObjectType, Field, InputType } from "@nestjs/graphql";
import { IsString, Min, Max, IsNumber } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { CoreEntity } from "./core.entity";
import { User } from "src/users/entities/user.entity";

@InputType("PodcastInputType", { isAbstract: true })
@Entity()
@ObjectType()
export class Podcast extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  title: string;

  @Column()
  @Field((type) => String)
  @IsString()
  category: string;

  @Column({ default: 0 })
  @Field((type) => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @OneToMany(() => Episode, (episode) => episode.podcast)
  @Field((type) => [Episode])
  episodes: Episode[];

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.podcast, { onDelete: "CASCADE" })
  host: User;
}
