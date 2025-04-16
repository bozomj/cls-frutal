//endpoint para listar todos os usuários

import User from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try{
        const users = await User.findAll();
        console.log('users', users);
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
}
