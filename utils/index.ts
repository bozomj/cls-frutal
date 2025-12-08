import autenticator from "@/models/autenticator";
import { GetServerSidePropsContext } from "next";

function getUrlImage(path?: string): string | undefined {
  path = path?.replaceAll("localhost", "192.168.0.150");

  const urlSplit = path?.split(/[/\\]/).pop();
  const url = path?.includes("clsfrutal.firebasestorage.app")
    ? path
    : `/uploads/${urlSplit}`;

  return urlSplit == undefined ? "/uploads/sem-images.jpg" : url;
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
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0"); // Mês começa do zero
  const ano = d.getFullYear();
  const diaSemana = diasSemana[d.getDay()];

  return `${diaSemana} ${dia}/${mes}/${ano}`;
}

function redirectNotToken(ctx: GetServerSidePropsContext, destination: string) {
  const token = ctx.req.cookies.token || "";

  try {
    const auth = autenticator.verifyToken(token);

    return {
      props: {
        ctx: auth.id,
      },
    };
  } catch {
    return {
      redirect: {
        destination: destination,
        permanent: false,
      },
    };
  }
}

const formatarMoeda = (value: string) => {
  const apenasNumeros = extractNumberInString(value);

  const numero = stringForDecimalNumber(apenasNumeros);
  const formatado = formatNumberForMoedaString(numero);

  return formatado;
};

function extractNumberInString(str: string): string {
  return str.replace(/\D/g, "");
}

function stringForDecimalNumber(str: string): number {
  return parseInt(str || "0", 10) / 100;
}

function formatNumberForMoedaString(number: number): string {
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function capitalizar(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(" ");
}

function resizeImageFile(
  file: File,
  maxWidth = 1280,
  maxSizeKB = 300
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx!.drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        let dataUrl = canvas.toDataURL("image/webp", quality);

        while (dataUrl.length / 1024 > maxSizeKB && quality > 0.1) {
          quality -= 0.005;
          dataUrl = canvas.toDataURL("image/webp", quality);
        }

        fetch(dataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const newFile = new File(
              [blob],
              file.name.replace(/\.\w+$/, ".webp"),
              {
                type: "image/webp",
                lastModified: Date.now(),
              }
            );
            resolve(newFile);
          });
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getUrlImageR2(url: string | null) {
  if (url == null) return "";
  return `https://pub-cf2ec8db2f184d2ab44495473e1c1c12.r2.dev/${url}`;
}

const utils = {
  getUrlImageR2,
  getUrlImage,
  loadImage,
  formatarData,
  redirectNotToken,
  formatarMoeda,
  extractNumberInString,
  stringForDecimalNumber,

  string: {
    capitalizar,
  },

  imagem: {
    resizeImageFile,
  },
};

export default utils;
