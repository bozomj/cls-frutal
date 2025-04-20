import autenticator from "@/models/autenticator";
import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import { createRouter } from "next-connect";


const router = createRouter<NextApiRequest, NextApiResponse>();


export default router.handler();
router.get(getLogin);


async function getLogin(req: NextApiRequest, res: NextApiResponse){
    const token = req.cookies.token || '';
    

    try{
        const result =  autenticator.verifyToken(token);
        res.status(200).json({ status: true, result: result});
    }catch(error){
        res.status(200).json({ status: false, result: 'Não autorizado' });
    }

    
    
}
