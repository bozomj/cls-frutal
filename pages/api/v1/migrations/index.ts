import migrator from "@/models/migrator";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";


const router = createRouter<NextApiRequest, NextApiResponse>();

 router.get(getHandler);
 router.post(postHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse){

    
    const migrations = await migrator.listPendingMigrations();
    return   res.status(200).json({migrations});
   
}

async function postHandler(req: NextApiRequest, res: NextApiResponse){
    
    const migration = await migrator.runPendingMigrations();
    const message = migration.length > 0 ? "migrações executadas com sucesso" : "não há migrações pendentes";

    return res.status( migration.length > 0 ? 200 : 200 ).json({
        message: message,
        migrations: migration
    });
}

