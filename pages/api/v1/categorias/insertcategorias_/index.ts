import insertCategorias from "@/seeds/insertCategorias";

import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.query);
  const { tokenUrl } = req.query;

  if (!tokenUrl || tokenUrl !== process.env.USERMASTER_TOKEN_URL) {
    return res.status(404).end();
  }

  try {
    await insertCategorias();

    res.status(201).json({ message: "Categorias inserido com sucesso!" });
  } catch (e: any) {
    // 🔍 Navega com segurança pela árvore de causas do seu erro
    const pgErrorCode = e?.cause?.cause?.code || "code_error";

    if (pgErrorCode === "23505") {
      return res.status(409).json({
        message:
          "O seed de categorias já foi executado no sistema anteriormente!",
      });
    }

    // Se for qualquer outro erro real do banco (ex: coluna que não existe ou queda de conexão)
    return res.status(500).json({
      message: "Erro ao inserir Categorias",
      cause: process.env.NODE_ENV === "development" ? e : undefined,
    });
  }
}
