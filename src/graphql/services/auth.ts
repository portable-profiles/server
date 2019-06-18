import { IPersistence } from '../../persistence/persistence';
import { ProfileService } from './profile';
import { Tables } from '../tables';
import { AccessLevel } from '../models';
import { AdminService } from './admin';
import crypto = require('crypto');

export class AuthService {
  public static async register(data: string, persistence: IPersistence) {
    const { profileRecord } = ProfileService.createProfileRecord(
      data,
      AccessLevel.USER
    );
    await persistence.addItem(Tables.PROFILES, profileRecord.id, profileRecord);
    return profileRecord;
  }

  public static async challenge(id: string, persistence: IPersistence) {
    const keychain = await AdminService.getKeychain(persistence);
    const token = crypto.randomBytes(48).toString('base64');
    const body = { id, token };
    const signature = keychain.sign(JSON.stringify(body)).signature;
    return JSON.stringify({
      body,
      signature,
    });
  }

  public static async authenticate(
    challenge: any,
    signature: any,
    persistence: IPersistence
  ) {
    // Get this server's keychain
    const keychain = await AdminService.getKeychain(persistence);

    // Parse the challenge and retrieve the server's signature
    const challengeObj = JSON.parse(challenge);
    const challengeSignature = challengeObj.signature;

    // Extract the user ID from the challenge
    const challengeBodyObj = JSON.parse(challengeObj.body);
    const id = challengeBodyObj.id;

    // Make sure that the challenge is valid
    if (!keychain.verify(challengeObj.body, challengeSignature)) {
      throw new Error('The challenge is not properly signed by this server');
    }

    // Get the user and their keychain
    const user = await persistence.getItem(Tables.PROFILES, id);
    const userProfile = ProfileService.parseProfile(user);
    const userKeychain = userProfile.getKeychain();

    // Check that the challenge was signed
    if (!userKeychain.verify(challenge, signature)) {
      throw new Error('The challenge is not properly signed by the user');
    }
  }
}
