import { graphql } from 'graphql';
import { Persistence } from '../persistence/persistence';
import { schema } from './schema';
import { Tables } from './tables';
import { AuthService } from './services/auth';
import { AdminService } from './services/admin';

export function createGraphQL(persistence: Persistence) {
  const resolvers = {
    allProfiles: ({ start, count }) => {
      return persistence.getItems(Tables.PROFILES, start, count);
    },
    configuration: () => {
      return AdminService.getConfiguration(persistence);
    },
    profile: ({ id }) => {
      return persistence.getItem(Tables.PROFILES, id);
    },
    register: ({ profile }) => {
      return AuthService.register(profile, persistence);
    },
    activateServer: ({ owner, config }) => {
      return AdminService.activateServer(owner, config, persistence);
    }
  };
  return (query: any, context: any, variables: any) =>
    graphql(schema, query, resolvers, context, variables);
}
