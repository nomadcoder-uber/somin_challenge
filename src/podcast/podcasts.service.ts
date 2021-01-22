import { Injectable } from "@nestjs/common";
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from "./dtos/create-episode.dto";
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from "./dtos/create-podcast.dto";
import { UpdateEpisodeInput } from "./dtos/update-episode.dto";
import { UpdatePodcastInput } from "./dtos/update-podcast.dto";
import { Episode } from "./entities/episode.entity";
import { Podcast } from "./entities/podcast.entity";
import { CoreOutput } from "./dtos/output.dto";
import {
  PodcastOutput,
  EpisodesOutput,
  EpisodesSearchInput,
  GetAllPodcastsOutput,
  GetEpisodeOutput,
} from "./dtos/podcast.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import {
  CreateReviewInput,
  CreateReviewOutput,
} from "./dtos/create-review.dto";
import { Review } from "./entities/review.entity";
import { SubscribeInput, SubscribeOutput } from "./dtos/subscribe.dto";
import { Subscribe } from "./entities/subscribe.entity";

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subscribe)
    private readonly subscribeRepository: Repository<Subscribe>
  ) {}

  private readonly InternalServerErrorOutput = {
    ok: false,
    error: "Internal server error occurred.",
  };

  async getAllPodcasts(): Promise<GetAllPodcastsOutput> {
    try {
      const podcasts = await this.podcastRepository.find();
      return {
        ok: true,
        podcasts,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async createPodcast({
    title,
    category,
  }: CreatePodcastInput): Promise<CreatePodcastOutput> {
    try {
      const newPodcast = this.podcastRepository.create({ title, category });
      const { id } = await this.podcastRepository.save(newPodcast);
      return {
        ok: true,
        id,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async getPodcast(id: number): Promise<PodcastOutput> {
    try {
      const podcast = await this.podcastRepository.findOne(
        { id },
        { relations: ["episodes", "review"] }
      );
      if (!podcast) {
        return {
          ok: false,
          error: `Podcast with id ${id} not found`,
        };
      }
      return {
        ok: true,
        podcast,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async deletePodcast(id: number): Promise<CoreOutput> {
    try {
      const { ok, error } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }
      await this.podcastRepository.delete({ id });
      return { ok };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async updatePodcast({
    id,
    payload,
  }: UpdatePodcastInput): Promise<CoreOutput> {
    try {
      const { ok, error, podcast } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }

      if (
        payload.rating !== null &&
        (payload.rating < 1 || payload.rating > 5)
      ) {
        return {
          ok: false,
          error: "Rating must be between 1 and 5.",
        };
      } else {
        const updatedPodcast: Podcast = { ...podcast, ...payload };
        await this.podcastRepository.save(updatedPodcast);
        return { ok };
      }
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async getEpisodes(podcastId: number): Promise<EpisodesOutput> {
    const { podcast, ok, error } = await this.getPodcast(podcastId);
    if (!ok) {
      return { ok, error };
    }
    return {
      ok: true,
      episodes: podcast.episodes,
    };
  }

  async getEpisode({
    podcastId,
    episodeId,
  }: EpisodesSearchInput): Promise<GetEpisodeOutput> {
    const { episodes, ok, error } = await this.getEpisodes(podcastId);
    if (!ok) {
      return { ok, error };
    }
    const episode = episodes.find((episode) => episode.id === episodeId);
    if (!episode) {
      return {
        ok: false,
        error: `Episode with id ${episodeId} not found in podcast with id ${podcastId}`,
      };
    }
    return {
      ok: true,
      episode,
    };
  }

  async createEpisode({
    podcastId,
    title,
    category,
  }: CreateEpisodeInput): Promise<CreateEpisodeOutput> {
    try {
      const { podcast, ok, error } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      const newEpisode = this.episodeRepository.create({ title, category });
      newEpisode.podcast = podcast;
      const { id } = await this.episodeRepository.save(newEpisode);
      return {
        ok: true,
        id,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async deleteEpisode({
    podcastId,
    episodeId,
  }: EpisodesSearchInput): Promise<CoreOutput> {
    try {
      const { episode, error, ok } = await this.getEpisode({
        podcastId,
        episodeId,
      });
      if (!ok) {
        return { ok, error };
      }
      await this.episodeRepository.delete({ id: episode.id });
      return { ok: true };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async updateEpisode({
    podcastId,
    episodeId,
    ...rest
  }: UpdateEpisodeInput): Promise<CoreOutput> {
    try {
      const { episode, ok, error } = await this.getEpisode({
        podcastId,
        episodeId,
      });
      if (!ok) {
        return { ok, error };
      }
      const updatedEpisode = { ...episode, ...rest };
      await this.episodeRepository.save(updatedEpisode);
      return { ok: true };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async createReview(
    createReviewInput: CreateReviewInput
  ): Promise<CreateReviewOutput> {
    try {
      const podcast = await this.podcastRepository.findOne(
        createReviewInput.podcastId
      );
      if (!podcast) {
        return {
          ok: false,
          error: "Podcast not found",
        };
      }
      const user = await this.userRepository.findOne(createReviewInput.userId);
      if (!user) {
        return {
          ok: false,
          error: "User not found",
        };
      }
      await this.reviewRepository.save(
        this.reviewRepository.create({ ...createReviewInput, podcast, user })
      );
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "Could not create review",
      };
    }
  }
  async searchPodcast(title: string): Promise<PodcastOutput> {
    try {
      const podcast = await this.podcastRepository.findOne(
        { title },
        { relations: ["episodes", "review"] }
      );
      if (!podcast) {
        return {
          ok: false,
          error: `Podcast with title ${title} not found`,
        };
      }
      return {
        ok: true,
        podcast,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }
  async subscribeToPodcast(
    subscribeInput: SubscribeInput
  ): Promise<SubscribeOutput> {
    try {
      const podcast = await this.podcastRepository.findOne(
        subscribeInput.podcastId
      );
      if (!podcast) {
        return {
          ok: false,
          error: "Podcast not found",
        };
      }
      const user = await this.userRepository.findOne(subscribeInput.userId);
      if (!user) {
        return {
          ok: false,
          error: "User not found",
        };
      }
      await this.subscribeRepository.save(
        this.subscribeRepository.create({ ...subscribeInput, podcast, user })
      );
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "Could not create subscribe",
      };
    }
  }
  async seeSubscriptions(
    subscribeInput: SubscribeInput
  ): Promise<SubscribeOutput> {
    const podcast = await this.podcastRepository.findOne(
      subscribeInput.podcastId
    );
    if (!podcast) {
      return {
        ok: false,
        error: "Podcast not found",
      };
    }

    const user = await this.userRepository.findOne(subscribeInput.userId, {
      relations: ["subscribe"],
    });
    if (!user) {
      return {
        ok: false,
        error: "User not found",
      };
    }

    if (!user.subscribe) {
      return {
        ok: false,
        error: "Subscribe not exist",
      };
    }

    // user.subscribe.find((podcast) => podcast.id === )

    // find((episode) => episode.id === episodeId);

    return {
      ok: true,
      subscribe: user.subscribe,
    };
  }
}
