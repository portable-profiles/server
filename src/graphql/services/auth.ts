import { Persistence } from "../../persistence/persistence";
import { ProfileService } from "./profile";
import { Tables } from "../tables";
import { AccessLevel } from "../models";
import { Profile, Fields } from "@paladin-privacy/profiles";

export class AuthService {
  public static async register(data: string, persistence: Persistence) {
    const { profileRecord } = ProfileService.createProfileRecord(data, AccessLevel.USER);
    await persistence.addItem(Tables.PROFILES, profileRecord.id, profileRecord);
    return profileRecord;
  }
}
