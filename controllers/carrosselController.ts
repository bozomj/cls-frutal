async function getImagesCarrossel() {
  const resp = await fetch("/api/v1/carrossel");
  const data = await resp.json();

  return data;
}

const carrosselController = {
  getImagesCarrossel,
};

export default carrosselController;
