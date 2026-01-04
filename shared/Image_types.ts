export type ImageDBType = {
  id: string;
  file: File;
  post_id?: string;
  url: string;
  status?: ImageStatus;
};

export type imageProfileType = {
  id: string;
  url: string;
  file: File;
  selected: boolean;
};

export enum ImageStatus {
  PENDING = "pending",
  ACTIVE = "active",
  REJECTED = "rejected",
  DELETED = "deleted",
}
