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

function formatarData(data: string) {
  const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const d = new Date(data);
  const dia = String(d.getUTCDate()).padStart(2, "0");
  const mes = String(d.getUTCMonth() + 1).padStart(2, "0"); // Mês começa do zero
  const ano = d.getUTCFullYear();
  const diaSemana = diasSemana[d.getUTCDay()];

  return `${diaSemana} ${dia}/${mes}/${ano}`;
}

const utils = {
  getUrlImage,
  loadImage,
  formatarData,
};

export default utils;
