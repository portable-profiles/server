import { ProfileService } from "./profile";
import { Tables, ConfigKeys } from "../tables";
import { AccessLevel } from "../models";
import { Persistence } from "../../persistence/persistence";
import { PaladinKeychain } from "@paladin-privacy/profiles";

export class AdminService {
  public static async activateServer(owner: string, config: any, persistence: Persistence) {
    // Create the admin account
    const { profileRecord } = ProfileService.createProfileRecord(owner, AccessLevel.SUPER_ADMIN);
    await persistence.addItem(Tables.PROFILES, profileRecord.id, profileRecord);

    // Generate cryptography
    const keychain = PaladinKeychain.create();

    // Store settings
    await persistence.addItem(Tables.CONFIG, ConfigKeys.NAME, config.name);
    await persistence.addItem(Tables.CONFIG, ConfigKeys.DESCRIPTION, config.description);
    await persistence.addItem(Tables.CONFIG, ConfigKeys.PRIVATE, config.private);
    await persistence.addItem(Tables.CONFIG, ConfigKeys.PUBLIC_KEY, keychain.getPublic());
    await persistence.addItem(Tables.CONFIG, ConfigKeys.PRIVATE_KEY, keychain.getPrivate());
    await persistence.addItem(Tables.CONFIG, ConfigKeys.INSTALLED, true);
  }
}
