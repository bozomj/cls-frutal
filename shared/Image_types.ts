export type ImageDBType = {
  id: string;
  file: File;
  post_id?: string;
  url: string;
};

export type imageProfileType = {
  id: string;
  url: string;
  file: File;
  selected: boolean;
};
