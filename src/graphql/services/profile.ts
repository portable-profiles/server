import { Profile, Fields } from '@portable-profiles/profiles';
import { AccessLevel } from '../models';

export interface ProfileRecord {
  spec: string;
  id: string;
  revision: number;
  nickname: string;
  createdOn: number;
  modifiedOn: number;
  data: any;
  banned: boolean;
}

export interface CreateProfileResponse {
  profile: Profile;
  profileRecord: ProfileRecord;
}

export class ProfileService {
  public static parseProfile(data: string) {
    // Parse and validate JSON
    let json;
    try {
      json = JSON.parse(data);
    } catch (error) {
      console.error('json not valid');
      throw new Error('The profile data provided is not valid JSON');
    }

    // Create profile and make sure it's valid
    const profile = new Profile(json);
    if (!profile.isValid()) {
      console.error('profile not valid');
      throw new Error('The specified profile did not pass a validation check');
    }

    return profile;
  }

  public static createProfileRecord(
    data: string,
    level: AccessLevel = AccessLevel.USER,
    banned = false
  ): CreateProfileResponse {
    const profile = ProfileService.parseProfile(data);

    // Get the profile's nickname
    let nickname = null;
    try {
      nickname = profile.getField(Fields.Nickname);
    } catch (error) {}

    // Create the database object
    const profileObject = profile.getProfile();
    const profileRecord = {
      spec: profileObject.spec,
      id: profileObject.body.id,
      revision: profileObject.body.revision,
      nickname,
      createdOn: profileObject.body.createdOn,
      modifiedOn: profileObject.body.modifiedOn,
      data,
      banned,
      level,
    };

    return { profile, profileRecord };
  }
}
