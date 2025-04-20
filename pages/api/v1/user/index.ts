//endpoint para listar todos os usuários

import User from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { cookies } from 'next/headers';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);
router.post(postHandler);

export default router.handler();

 async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    try{
        const users = await User.findAll();
        
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({ error: 'Erro ao buscar usuários', cause: error });
    }
}


async function postHandler(req: NextApiRequest, res: NextApiResponse) {

    
    const body = JSON.parse(req.body);
    const email = body.email;
    const password = body.password;
    
    const cookie = req.cookies;
    console.log('cookies', cookie);
    
    try{

        const token = await User.login(email, password);
        
        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600;`);

        res.status(200).json({message: 'Usuário logado com sucesso'});
    }catch(error: any){
    
        res.status(500).json({ error: 'Erro ao logar usuário', cause: error });
    }
    
    
    
    


}

