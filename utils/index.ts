function getUrlImage(path?: string): string | undefined {
  const url = path ? `/uploads/${path?.split(/[/\\]/).pop()}` : undefined;

  return url ?? "/uploads/sem-images.jpg";
}

function loadImage(url: string | undefined): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (!url) return resolve("/uploads/sem-images.jpg");

    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve("/uploads/sem-images.jpg");

    return resolve(url);
  });
}

const utils = {
  getUrlImage,
  loadImage,
};

export default utils;
