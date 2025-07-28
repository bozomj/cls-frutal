import autenticator from "@/models/autenticator";
import { GetServerSidePropsContext } from "next";

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

const utils = {
  getUrlImage,
  loadImage,
  formatarData,
  redirectNotToken,
  formatarMoeda,
  extractNumberInString,
  stringForDecimalNumber,
};

export default utils;
