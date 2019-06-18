import { Profile, Fields, Visibility } from '@portable-profiles/profiles';
import { createGraphQL } from '../resolver';
import { MemoryPersistence } from '../../persistence/memory-persistence';
import { Tables } from '../tables';

const TEST_NAME = 'Test server';
const TEST_DESCRIPTION = 'Server for testing';
const TEST_DOMAIN = 'test.paladinprivacy.com';

const ActivateMutation = `
  mutation ActivateMutation($owner: JSON!, $config: ConfigurationInput!) {
    activateServer(owner: $owner, config: $config) {
      name
      description
      domain
      private
    }
  }
`;

const RegisterMutation = `
  mutation RegisterMutation($profile: JSON!) {
    register(profile: $profile) {
      spec
      id
      revision
      nickname
      createdOn
      modifiedOn
      data
      banned
      level
    }
  }
`;

const GetProfileQuery = `
  query GetProfileQuery($id: String!) {
    profile(id: $id) {
      spec
      id
      revision
      nickname
      createdOn
      modifiedOn
      data
      banned
      level
    }
  }
`;

function verifyProfile(res: any, profile: Profile) {
  expect(res).toBeTruthy();
  expect(res.id).toEqual(profile.getId());
  expect(res.nickname).toEqual(profile.getField(Fields.Nickname));
  expect(res.revision).toEqual(profile.getProfile().body.revision);
  expect(res.createdOn).toEqual(profile.getProfile().body.createdOn);
  expect(res.modifiedOn).toEqual(profile.getProfile().body.modifiedOn);
  expect(res.data).toEqual(profile.toString());
  expect(res.banned).toEqual(false);
}

test('register a profile and perform basic actions against it', async () => {
  // Create the API endpoint
  const memory = new MemoryPersistence();
  const graphql = createGraphQL(memory);

  // Create a admin profile and convert it to JSON
  const admin = new Profile();
  admin.initialize();
  admin.setField(Fields.Nickname, 'Alice', Visibility.Public);
  admin.setField(Fields.Email, 'alice@example.com', Visibility.Private);
  admin.sign();
  const adminProfile = admin.toString();

  // Activate the server
  const config = {
    name: TEST_NAME,
    description: TEST_DESCRIPTION,
    domain: TEST_DOMAIN,
    private: true,
  };
  const activateResult = await graphql(
    ActivateMutation,
    {},
    {
      owner: adminProfile,
      config,
    }
  );
  expect(activateResult.data.activateServer).toEqual(config);

  // Create a profile and convert it to JSON
  const alice = new Profile();
  alice.initialize();
  alice.setField(Fields.Nickname, 'Alice', Visibility.Public);
  alice.setField(Fields.Email, 'alice@example.com', Visibility.Private);
  alice.sign();
  const profile = alice.toString();

  // Execute a register mutation
  const registerResult = await graphql(RegisterMutation, {}, { profile });
  verifyProfile(registerResult.data.register, alice);

  // Verify register in database
  expect(memory.database[Tables.PROFILES][alice.getId()]).toEqual(
    registerResult.data.register
  );

  // Get the profile
  const profileResult = await graphql(
    GetProfileQuery,
    {},
    { id: alice.getId() }
  );
  verifyProfile(profileResult.data.profile, alice);

  // Log in as the profile
});
