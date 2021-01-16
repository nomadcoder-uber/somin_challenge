import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PodcastOutput } from './dtos/podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PodcastsService', () => {
  let service: PodcastsService;
  let podcastRepository: MockRepository<Podcast>;
  let episodeRepository: MockRepository<Episode>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PodcastsService,
        {
          provide: getRepositoryToken(Podcast),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Episode),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<PodcastsService>(PodcastsService);
    podcastRepository = module.get(getRepositoryToken(Podcast));
    episodeRepository = module.get(getRepositoryToken(Episode));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getAllPodcasts', () => {
    const getALl_PODCAST: Podcast = {
      id: 1,
      title: 'TEST',
      category: 'TEST',
      rating: 0,
      episodes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    it('should get all podcast', async () => {
      podcastRepository.find.mockReturnValue(getALl_PODCAST);
      const result = await service.getAllPodcasts();
      expect(result).toEqual({ ok: true, podcasts: getALl_PODCAST });
    });
    it('should faill on exception', async () => {
      podcastRepository.find.mockRejectedValue(new Error());
      const result = await service.getAllPodcasts();
      expect(result).toEqual({
        ok: false,
        error: 'Internal server error occurred.',
      });
    });

    describe('createPodcast', () => {
      const createPodcastArgs = {
        title: 'marble',
        category: 'action',
      };

      it('should create a new podcast', async () => {
        podcastRepository.create.mockReturnValue(createPodcastArgs);
        await service.createPodcast(createPodcastArgs);
        expect(podcastRepository.create).toHaveBeenCalledTimes(1);
        expect(podcastRepository.create).toHaveBeenCalledWith(
          createPodcastArgs,
        );
        expect(podcastRepository.save).toHaveBeenCalledTimes(1);
        expect(podcastRepository.save).toHaveBeenCalledWith(createPodcastArgs);
      });
      it('should faill on exception', async () => {
        podcastRepository.save.mockRejectedValue(new Error());
        const result = await service.createPodcast(createPodcastArgs);
        expect(result).toEqual({
          ok: false,
          error: 'Internal server error occurred.',
        });
      });
    });
    describe('getPodcast', () => {
      const findByIdArgs = {
        id: 1,
      };
      it('should find an existing podcast', async () => {
        podcastRepository.findOne.mockResolvedValue(findByIdArgs);
        const result = await service.getPodcast(1);
        expect(result).toEqual({ ok: true, podcast: findByIdArgs });
      });

      it('should fail if no podcast is found', async () => {
        podcastRepository.findOne.mockResolvedValue(null);
        const result = await service.getPodcast(1);
        expect(result).toEqual({ ok: false, error: 'Podcast Not found' });
      });
      it('should faill on exception', async () => {
        podcastRepository.findOne.mockRejectedValue(new Error());
        const result = await service.getPodcast(1);
        expect(result).toEqual({
          ok: false,
          error: 'Internal server error occurred.',
        });
      });
    });
    describe('deletePodcast', () => {
      // const get_PODCAST: Podcast = {
      //   id: 1,
      //   title: 'TEST',
      //   category: 'TEST',
      //   rating: 0,
      //   episodes: [],
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // };
      it('should delete podcast', async () => {
        jest.spyOn(service, 'getPodcast').mockImplementation(async id => {
          return { ok: true };
        });
        const result = await service.deletePodcast(1);
        expect(result).toEqual({ ok: true });
      });
      it('should fail if no podcast is found', async () => {
        jest.spyOn(service, 'getPodcast').mockImplementation(async id => {
          return { ok: false, error: 'Podcast Not found' };
        });
        const result = await service.deletePodcast(3);
        expect(result).toEqual({ ok: false, error: 'Podcast Not found' });
      });
      it('should faill on exception', async () => {
        jest.spyOn(service, 'getPodcast').mockImplementation(async id => {
          throw new Error();
        });
        const result = await service.deletePodcast(1);
        expect(result).toEqual({
          ok: false,
          error: 'Internal server error occurred.',
        });
      });

      describe('getEpisodes', () => {
        const getPodcast: Podcast = {
          id: 1,
          title: 'TEST',
          category: 'TEST',
          rating: 0,
          episodes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        it('should find an existing episodes', async () => {
          jest.spyOn(service, 'getPodcast').mockImplementation(async id => {
            return { ok: true, podcast: getPodcast };
          });
          const result = await service.getEpisodes(1);
          expect(result).toEqual({ ok: true, episodes: getPodcast.episodes });
        });
        it('should fail if no podcast is found', async () => {
          jest.spyOn(service, 'getPodcast').mockImplementation(async id => {
            return { ok: false, error: 'Podcast Not found' };
          });
          const result = await service.getEpisodes(1);
          expect(result).toEqual({ ok: false, error: 'Podcast Not found' });
        });
        it('should faill on exception', async () => {
          jest.spyOn(service, 'getPodcast').mockImplementation(async id => {
            throw new Error();
          });
          const result = await service.getEpisodes(1);
          expect(result).toEqual({
            ok: false,
            error: 'Internal server error occurred.',
          });
        });
      });
      describe('getEpisode', () => {
        const getEpisode: Episode = {
          id: 1,
          title: 'TEST',
          category: 'TEST',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const getPodcast: Podcast = {
          id: 1,
          title: 'TEST',
          category: 'TEST',
          rating: 0,
          episodes: [getEpisode],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const getEpisodeArgs = {
          podcastId: 1,
          episodeId: 1,
        };
        const errorEpisodeArgs = {
          podcastId: 1,
          episodeId: 3,
        };
        it('should find an existing episode', async () => {
          jest.spyOn(service, 'getEpisodes').mockImplementation(async id => {
            return { ok: true, episodes: getPodcast.episodes };
          });

          const searchEpisode = getPodcast.episodes.find(
            episode => episode.id === getEpisodeArgs.episodeId,
          );
          const result = await service.getEpisode(getEpisodeArgs);
          expect(result).toEqual({ ok: true, episode: getEpisode });
        });

        it('should fail if no podcast is found', async () => {
          jest.spyOn(service, 'getEpisodes').mockImplementation(async id => {
            return { ok: false, error: 'Podcast Not found' };
          });
          const result = await service.getEpisode(getEpisodeArgs);
          expect(result).toEqual({ ok: false, error: 'Podcast Not found' });
        });

        it('should fail if no episode is found', async () => {
          jest.spyOn(service, 'getEpisodes').mockImplementation(async id => {
            return { ok: true, episodes: getPodcast.episodes };
          });

          const searchEpisode = getPodcast.episodes.find(
            episode => episode.id === errorEpisodeArgs.episodeId,
          );

          const result = await service.getEpisode(errorEpisodeArgs);
          expect(result).toEqual({
            ok: false,
            error: `Episode with id ${errorEpisodeArgs.episodeId} not found in podcast with id ${getEpisodeArgs.podcastId}`,
          });
        });
        it('should faill on exception', async () => {
          jest.spyOn(service, 'getEpisodes').mockImplementation(async id => {
            throw new Error();
          });
          const result = await service.getEpisode(getEpisodeArgs);
          expect(result).toEqual({
            ok: false,
            error: 'Internal server error occurred.',
          });
        });
      });
      describe('deleteEpisode', () => {
        const getEpisodeArgs = {
          podcastId: 1,
          episodeId: 1,
        };
        const getEpisode: Episode = {
          id: 1,
          title: 'TEST',
          category: 'TEST',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const getPodcast: Podcast = {
          id: 1,
          title: 'TEST',
          category: 'TEST',
          rating: 0,
          episodes: [getEpisode],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        it('should delete episode', async () => {
          jest
            .spyOn(service, 'getEpisode')
            .mockImplementation(async getEpisodeArgs => {
              return { ok: true, episode: getEpisode };
            });
          await service.deleteEpisode(getEpisodeArgs);
          expect(episodeRepository.delete).toHaveBeenCalledTimes(1);
        });
        it('should fail if no episode is found', async () => {
          jest
            .spyOn(service, 'getEpisode')
            .mockImplementation(async getEpisodeArgs => {
              return {
                ok: false,
                error: `Episode with id ${getEpisodeArgs.episodeId} not found in podcast with id ${getEpisodeArgs.podcastId}`,
              };
            });
          const result = await service.deleteEpisode(getEpisodeArgs);
          expect(result).toEqual({
            ok: false,
            error: `Episode with id ${getEpisodeArgs.episodeId} not found in podcast with id ${getEpisodeArgs.podcastId}`,
          });
        });
        it('should faill on exception', async () => {
          jest
            .spyOn(service, 'getEpisode')
            .mockImplementation(async getEpisodeArgs => {
              throw new Error();
            });
          const result = await service.deleteEpisode(getEpisodeArgs);
          expect(result).toEqual({
            ok: false,
            error: 'Internal server error occurred.',
          });
        });
      });

      describe('createEpisode', () => {
        const getPodcast: Podcast = {
          id: 1,
          title: 'TEST',
          category: 'TEST',
          rating: 0,
          episodes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const createEpisodeArgs = {
          title: 'marble',
          category: 'action',
          podcastId: 1,
        };

        it('should create an episode', async () => {
          jest.spyOn(service, 'getPodcast').mockImplementation(async id => {
            return { ok: true, podcast: getPodcast };
          });
          episodeRepository.create.mockReturnValue(createEpisodeArgs);
          episodeRepository.save(createEpisodeArgs);
          const result = await service.createEpisode(createEpisodeArgs);
          expect(result).toEqual({ ok: true });
        });

        it('should fail if no podcast is found', async () => {
          jest.spyOn(service, 'getPodcast').mockImplementation(async id => {
            return { ok: false, error: 'Podcast Not found' };
          });
          const result = await service.createEpisode(createEpisodeArgs);
          expect(result).toEqual({ ok: false, error: 'Podcast Not found' });
        });

        it('should faill on exception', async () => {
          jest.spyOn(service, 'getPodcast').mockImplementation(async id => {
            throw new Error();
          });
          const result = await service.createEpisode(createEpisodeArgs);
          expect(result).toEqual({
            ok: false,
            error: 'Internal server error occurred.',
          });
        });
      });
      describe('updatePodcast', () => {
        const podcast: Podcast = {
          id: 1,
          title: 'TEST',
          category: 'TEST',
          rating: 0,
          episodes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const afterPodcast: Podcast = {
          ...Podcast.prototype,
          id: 1,
          title: 'TEST2',
        };
        const updatePodcastArgs = {
          id: 1,
          payload: afterPodcast,
        };
        it('should update podcast', async () => {
          jest.spyOn(service, 'getPodcast').mockImplementation(async id => {
            return { ok: true, podcast: podcast };
          });

          const updateResult: Podcast = { ...podcast, ...afterPodcast };

          await podcastRepository.save(updateResult);
          const result = await service.updatePodcast(updatePodcastArgs);
          expect(result).toEqual({ ok: true });
        });
        it('should fail if no podcast is found', async () => {
          jest.spyOn(service, 'getPodcast').mockImplementation(async id => {
            return { ok: false, error: 'Podcast Not found' };
          });

          const result = await service.updatePodcast(updatePodcastArgs);
          expect(result).toEqual({ ok: false, error: 'Podcast Not found' });
        });
        it('should faill on exception', async () => {
          jest.spyOn(service, 'getPodcast').mockImplementation(async id => {
            throw new Error();
          });
          const result = await service.updatePodcast(updatePodcastArgs);
          expect(result).toEqual({
            ok: false,
            error: 'Internal server error occurred.',
          });
        });
      });

      describe('updateEpisode', () => {
        const episode: Episode = {
          id: 1,
          title: 'TEST',
          category: 'TEST',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const afterEpisode: Episode = {
          ...Episode.prototype,
          id: 1,
          title: 'TEST2',
        };
        const getEpisodeArgs = {
          podcastId: 1,
          episodeId: 1,
        };
        const updateEpisodeArgs = {
          podcastId: 1,
          episodeId: 1,
          rest: afterEpisode,
        };
        it('should update episode', async () => {
          jest
            .spyOn(service, 'getEpisode')
            .mockImplementation(async getEpisodeArgs => {
              return { ok: true, episode };
            });

          const updateResult: Episode = { ...episode, ...afterEpisode };

          await episodeRepository.save(updateResult);
          const result = await service.updateEpisode(updateEpisodeArgs);
          expect(result).toEqual({ ok: true });
        });
        it('should fail if no episode is found', async () => {
          jest
            .spyOn(service, 'getEpisode')
            .mockImplementation(async getEpisodeArgs => {
              return {
                ok: false,
                error: `Episode with id ${getEpisodeArgs.episodeId} not found in podcast with id ${getEpisodeArgs.podcastId}`,
              };
            });

          const result = await service.updateEpisode(updateEpisodeArgs);
          expect(result).toEqual({
            ok: false,
            error: `Episode with id ${getEpisodeArgs.episodeId} not found in podcast with id ${getEpisodeArgs.podcastId}`,
          });
        });

        it('should faill on exception', async () => {
          jest.spyOn(service, 'getEpisode').mockImplementation(async id => {
            throw new Error();
          });
          const result = await service.updateEpisode(updateEpisodeArgs);
          expect(result).toEqual({
            ok: false,
            error: 'Internal server error occurred.',
          });
        });
      });
    });
  });
});
