function getUrlImage(path?: string) {
  if (path) return `/uploads/${path?.split(/[/\\]/).pop()}`;
  return "";
}

const utils = {
  getUrlImage,
};

export default utils;
