import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { Episode } from 'src/podcast/entities/episode.entity';

const GRAPHQL_ENDPOINT = '/graphql';

const testUser = {
  email: 'soso@las.com',
  password: '12345',
};
const testPodcast = {
  title: 'Marble',
  category: 'action',
};
const testEpisode = {
  title: 'blue',
  category: 'sky',
};
describe('App (e2e)', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let jwtToken: string;
  let podcastRepository: Repository<Podcast>;
  let episodeRepository: Repository<Episode>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    podcastRepository = module.get<Repository<Podcast>>(
      getRepositoryToken(Podcast),
    );
    episodeRepository = module.get<Repository<Episode>>(
      getRepositoryToken(Episode),
    );
    await app.init();
  });
  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });
  describe('Podcasts Resolver', () => {
    describe('createPodcast', () => {
      it('should create a podcast', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `mutation{
            createPodcast(input:{
              title:"${testPodcast.title}",
              category:"${testPodcast.category}"
            }){
              ok
              error
            }
          }`,
          })
          .expect(200)
          .expect(res => {
            expect(res.body.data.createPodcast.ok).toBe(true);
            expect(res.body.data.createPodcast.error).toBe(null);
          });
      });
    });

    describe('getAllPodcasts', () => {
      it('should get all Podcasts', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
          {
            getAllPodcasts{
              ok
              error
              podcasts{
                title
              }
            }
          }
          `,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  getAllPodcasts: {
                    ok,
                    error,
                    podcasts: [{ title }],
                  },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(title).toBe(testPodcast.title);
          });
      });
    });

    describe('getPodcast', () => {
      let PodId: number;
      beforeAll(async () => {
        const [podcast] = await podcastRepository.find();
        PodId = podcast.id;
      });
      it('should get a podcast', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
          {
            getPodcast(input:{
              id:${PodId}
            }){
              ok
              error
              podcast{
                id
              }
            }
          }`,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  getPodcast: {
                    ok,
                    error,
                    podcast: { id },
                  },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(id).toBe(PodId);
          });
      });
      it('should not find if podcast is not exist ', () => {
        const getPodId = 486;
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
            {
              getPodcast(input:{
                id:${getPodId}
              }){
                ok
                error
                podcast{
                  id
                }
              }
            }`,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  getPodcast: { ok, error, podcast },
                },
              },
            } = res;
            expect(ok).toBe(false);
            expect(error).toBe(`Podcast with id ${getPodId} not found`);
            expect(podcast).toBe(null);
          });
      });
    });
    describe('updatePodcast', () => {
      const NEW_TITLE = 'Twilight';
      let PodId: number;
      beforeAll(async () => {
        const [podcast] = await podcastRepository.find();
        PodId = podcast.id;
      });

      it('should change title', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
            mutation{
              updatePodcast(input:{
                id:${PodId}
                payload:{
                  title:"${NEW_TITLE}"
                }
              }){
                error
                ok
              }
            }
        `,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  updatePodcast: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });
      it('should have new title', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
            {
              getPodcast(input:{
                id:${PodId}
              }){
                ok
                error
                podcast{
                  title
                }
              }
            }`,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  getPodcast: {
                    ok,
                    podcast: { title },
                  },
                },
              },
            } = res;
            expect(title).toBe(NEW_TITLE);
            expect(ok).toBe(true);
          });
      });
    });

    describe('createEpisode', () => {
      let PodId: number;
      beforeAll(async () => {
        const [podcast] = await podcastRepository.find();
        PodId = podcast.id;
      });
      it('should create episode', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `mutation{
            createEpisode(input:{
              title:"${testEpisode.title}",
              category:"${testEpisode.category}",
              podcastId:${PodId}
            }){
              ok
              error
            }
          }`,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  createEpisode: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });
      it('should not create episode if Podcast not exists', () => {
        const errorPodId = 486;
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `mutation{
            createEpisode(input:{
              title:"${testEpisode.title}",
              category:"${testEpisode.category}",
              podcastId:${errorPodId}
            }){
              ok
              error
            }
          }`,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  createEpisode: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(false);
            expect(error).toBe(`Podcast with id ${errorPodId} not found`);
          });
      });
    });
    describe('getEpisodes', () => {
      let PodId: number;
      let EpiId: number;
      beforeAll(async () => {
        const [podcast] = await podcastRepository.find();
        PodId = podcast.id;
        const [episode] = await episodeRepository.find();
        EpiId = episode.id;
      });
      it('should get all episodes', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `{
            getEpisodes(input:{
              id:${PodId}
            }){
              ok
              error
              episodes{
                id
                title
              }
            }
          }`,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  getEpisodes: {
                    ok,
                    error,
                    episodes: [{ id, title }],
                  },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(id).toBe(EpiId);
            expect(title).toBe(testEpisode.title);
          });
      });
    });
    it('should fail if Podcast not exists', () => {
      const errorPodId = 486;
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `{
          getEpisodes(input:{
            id:${errorPodId}
          }){
            ok
            error
            episodes{
              id
            }
          }
        }`,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                getEpisodes: { ok, error, episodes },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toBe(`Podcast with id ${errorPodId} not found`);
          expect(episodes).toBe(null);
        });
    });

    describe('updateEpisode', () => {
      const NEW_Title = 'yellow';
      const NEW_Category = 'flower';

      let PodId: number;
      let EpiId: number;
      beforeAll(async () => {
        const [podcast] = await podcastRepository.find();
        PodId = podcast.id;
        const [episode] = await episodeRepository.find();
        EpiId = episode.id;
      });
      it('should change title', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
          mutation{
            updateEpisode(input:{
              podcastId:${PodId},
              episodeId:${EpiId},
              title:"${NEW_Title}",
              category:"${NEW_Category}"
            }){
              ok
              error
            }
          }
        `,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  updateEpisode: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });
      it('should have new title', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `{
            getEpisodes(input:{
              id:${PodId}
            }){
              ok
              error
              episodes{
                title
                category
              }
            }
          }`,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  getEpisodes: {
                    ok,
                    error,
                    episodes: [{ title, category }],
                  },
                },
              },
            } = res;
            expect(title).toBe(NEW_Title);
            expect(category).toBe(NEW_Category);
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });
    });

    describe('deleteEpisode', () => {
      let PodId: number;
      let EpiId: number;

      beforeAll(async () => {
        const [podcast] = await podcastRepository.find();
        PodId = podcast.id;
        const [episode] = await episodeRepository.find();
        EpiId = episode.id;
      });
      it('should delete an episode', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
          mutation{
            deleteEpisode(input:{
              podcastId:${PodId},
              episodeId:${EpiId}
            }){
              error
              ok
            }
          }
            `,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  deleteEpisode: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });
      it('should fail if podcast not exist', () => {
        const deletePodId = 486;
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
          mutation{
            deleteEpisode(input:{
              podcastId:${deletePodId},
              episodeId:${EpiId}
            }){
              error
              ok
            }
          }
          `,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  deleteEpisode: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(false);
            expect(error).toBe(`Podcast with id ${deletePodId} not found`);
          });
      });
      it('should fail if episode not exist', () => {
        const deleteEpiId = 486;
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
            mutation{
              deleteEpisode(input:{
                podcastId:${PodId},
                episodeId:${deleteEpiId}
              }){
                error
                ok
              }
            }
            `,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  deleteEpisode: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(false);
            expect(error).toBe(
              `Episode with id ${deleteEpiId} not found in podcast with id ${PodId}`,
            );
          });
      });
    });
    describe('deletePodcast', () => {
      let PodId: number;
      beforeAll(async () => {
        const [podcast] = await podcastRepository.find();
        PodId = podcast.id;
      });
      it('should delete a podcast', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
            mutation{
              deletePodcast(input:{
                id:${PodId}
              }){
                ok
                error
              }
            }
            `,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  deletePodcast: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });
      it('should fail if podcast not exist', () => {
        const deletePodId = 486;
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
            mutation{
              deletePodcast(input:{
                id:${deletePodId}
              }){
                ok
                error
              }
            }
            `,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  deletePodcast: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(false);
            expect(error).toBe(`Podcast with id ${deletePodId} not found`);
          });
      });
    });
  });

  describe('Users Resolver', () => {
    describe('createAccount', () => {
      it('should create account', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
        mutation{
          createAccount(input:{
            email:"${testUser.email}",
            password:"${testUser.password}",
            role:Host
          }){
            ok
            error
          }
        }
        `,
          })
          .expect(200)
          .expect(res => {
            expect(res.body.data.createAccount.ok).toBe(true);
            expect(res.body.data.createAccount.error).toBe(null);
          });
      });
      it('should fail if account already exists', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
          mutation {
            createAccount(input: {
              email:"${testUser.email}",
              password:"${testUser.password}",
              role:Host
            }) {
              ok
              error
            }
          }
        `,
          })
          .expect(200)
          .expect(res => {
            expect(res.body.data.createAccount.ok).toBe(false);
            expect(res.body.data.createAccount.error).toBe(
              'There is a user with that email already',
            );
          });
      });
    });
    describe('login', () => {
      it('should login with correct credentials', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
          mutation {
            login(input:{
              email:"${testUser.email}",
              password:"${testUser.password}",
            }) {
              ok
              error
              token
                }
            }`,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: { login },
              },
            } = res;
            expect(login.ok).toBe(true);
            expect(login.error).toBe(null);
            expect(login.token).toEqual(expect.any(String));
            jwtToken = login.token;
          });
      });
      it('should not be able to login with wrong credentials', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
            mutation {
              login(input:{
                email:"${testUser.email}",
                password:"xxx",
              }) {
                ok
                error
                token
              }
            }
          `,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: { login },
              },
            } = res;
            expect(login.ok).toBe(false);
            expect(login.error).toBe('Wrong password');
            expect(login.token).toBe(null);
          });
      });
    });
    describe('seeProfile', () => {
      let userId: number;
      beforeAll(async () => {
        const [user] = await usersRepository.find();
        userId = user.id;
      });
      it("should see a user's profile", () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .set('X-JWT', jwtToken)
          .send({
            query: `
      {
        seeProfile(userId:${userId}){
          ok
          error
          user {
            id
          }
        }
      }
      `,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  seeProfile: {
                    ok,
                    error,
                    user: { id },
                  },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(id).toBe(userId);
          });
      });
      it('should not find a profile', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .set('X-JWT', jwtToken)
          .send({
            query: `
      {
        seeProfile(userId:666){
          ok
          error
          user {
            id
          }
        }
      }
      `,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  seeProfile: { ok, error, user },
                },
              },
            } = res;
            expect(ok).toBe(false);
            expect(error).toBe('User Not Found');
            expect(user).toBe(null);
          });
      });
    });
    describe('me', () => {
      it('should find my profile', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .set('X-JWT', jwtToken)
          .send({
            query: `
        {
          me {
            email
          }
        }
      `,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  me: { email },
                },
              },
            } = res;
            expect(email).toBe(testUser.email);
          });
      });
      it('should not allow logged out user', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
      {
        me {
          email
        }
      }
    `,
          })
          .expect(200)
          .expect(res => {
            const {
              body: { errors },
            } = res;
            const [error] = errors;
            expect(error.message).toBe('Forbidden resource');
          });
      });
    });
    describe('editProfile', () => {
      const NEW_EMAIL = 'bobo@new.com';
      it('should change email', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .set('X-JWT', jwtToken)
          .send({
            query: `
          mutation {
            editProfile(input:{
              email: "${NEW_EMAIL}"
            }) {
              ok
              error
            }
          }
      `,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  editProfile: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });
      it('should have new email', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .set('X-JWT', jwtToken)
          .send({
            query: `
        {
          me {
            email
          }
        }
      `,
          })
          .expect(200)
          .expect(res => {
            const {
              body: {
                data: {
                  me: { email },
                },
              },
            } = res;
            expect(email).toBe(NEW_EMAIL);
          });
      });
    });
  });
});
