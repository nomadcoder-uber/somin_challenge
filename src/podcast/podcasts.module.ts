import { Module } from "@nestjs/common";
import { PodcastsService } from "./podcasts.service";
import {
  EpisodeResolver,
  ListenerResolver,
  PodcastsResolver,
} from "./podcasts.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Podcast } from "./entities/podcast.entity";
import { Episode } from "./entities/episode.entity";
import { Review } from "./entities/review.entity";
import { User } from "src/users/entities/user.entity";
import { Subscribe } from "./entities/subscribe.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Podcast, Episode, Review, User, Subscribe]),
  ],
  providers: [
    PodcastsService,
    PodcastsResolver,
    EpisodeResolver,
    ListenerResolver,
  ],
})
export class PodcastsModule {}
