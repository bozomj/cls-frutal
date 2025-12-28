import migrator from "@/models/migrator";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);
router.post(postHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const migrations = await migrator.listPendingMigrations();
  return res.status(200).json({ migrations });
}

let isRunning = false;

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  if (isRunning) {
    return res.status(409).json({ error: "Migration já em execução" });
  }

  isRunning = true;
  try {
    const migration = await migrator.runPendingMigrations();
    const message =
      migration.length > 0
        ? "migrações executadas com sucesso"
        : "não há migrações pendentes";

    return res.status(migration.length > 0 ? 200 : 204).json({
      message: message,
      migrations: migration,
    });
  } finally {
    isRunning = false;
  }
}
