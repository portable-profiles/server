
export enum AccessLevel {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER"
}

export interface Configuration {
  name: string;
  description: string;
  private: boolean;
}
