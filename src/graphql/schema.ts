import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  scalar JSON

  type AccessLevel {
    SUPER_ADMIN,
    ADMIN,
    MEMBER
  }

  input ConfigurationInput {
    name: String!
    description: String!
    domain: String!
    private: Boolean
  }

  type Configuration {
    name: String
    description: String
    private: Boolean
    installed: Boolean
    publicKey: String
  }

  type Profile {
    spec: String
    id: String
    revision: Int
    nickname: String
    createdOn: Int
    modifiedOn: Int
    data: JSON
    banned: Boolean
    level: AccessLevel
  }

  type RegistrationChallenge {
    id: String
  }

  type AuthChallenge {
    token: String
  }

  input AuthResponseInput {
    id: String
    token: String
    signature: String
  }

  input SessionInput {
    jwt: String
  }

  type Session {
    jwt: String
    id: String
    admin: Boolean
    profile: Profile
  }

  type Query {
    configuration: Configuration
    profiles(start: Int = 0, count: Int = 100): [Profile]
    profile(id: String!): Profile
  }

  type Mutation {
    # Register mutations
    register(profile: JSON!): Profile

    # Login mutations
    challenge(id: String!): AuthChallenge
    authenticate(response: AuthResponseInput!): Session

    # Profile mutations
    updateProfile(session: SessionInput!, profile: JSON!): Profile

    # Admin mutations
    activateServer(owner: JSON!, config: ConfigurationInput!): Configuration
    banProfile(session: SessionInput!, id: String!): Profile
    unbanProfile(session: SessionInput!, id: String!): Profile
  }
`);
