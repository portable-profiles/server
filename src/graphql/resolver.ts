import { graphql } from 'graphql';
import { IPersistence } from '../persistence/persistence';
import { schema } from './schema';
import { Tables, ConfigKeys } from './tables';
import { AuthService } from './services/auth';
import { AdminService } from './services/admin';

export function createGraphQL(persistence: IPersistence) {
  const resolvers = {
    allProfiles: ({ start, count }) => {
      return persistence.getItems(Tables.PROFILES, start, count);
    },
    profile: ({ id }) => {
      return persistence.getItem(Tables.PROFILES, id);
    },
    register: ({ profile }) => {
      return AuthService.register(profile, persistence);
    },
    challenge: ({ id }) => {
      return AuthService.challenge(id, persistence);
    },
    authenticate: ({ challenge, signature }) => {
      return AuthService.authenticate(challenge, signature, persistence);
    },
    activateServer: async ({ owner, config }) => {
      await AdminService.activateServer(owner, config, persistence);
      return config;
    },
    Configuration: {
      name: () => persistence.getItem(Tables.CONFIG, ConfigKeys.NAME),
      description: () =>
        persistence.getItem(Tables.CONFIG, ConfigKeys.DESCRIPTION),
      private: () => persistence.getItem(Tables.CONFIG, ConfigKeys.PRIVATE),
      installed: () => persistence.getItem(Tables.CONFIG, ConfigKeys.INSTALLED),
      publicKey: () =>
        persistence.getItem(Tables.CONFIG, ConfigKeys.PUBLIC_KEY),
    },
  };
  return (query: any, context: any, variables: any) =>
    graphql(schema, query, resolvers, context, variables);
}
