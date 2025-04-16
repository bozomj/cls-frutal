//endpoint para verificar o status do banco de dados

import { createRouter } from 'next-connect';
import database from "@/database/database";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from 'uuid';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Middleware para verificar métodos permitidos
const checkAllowedMethods = (allowedMethods: string[]) => {
    return (req: NextApiRequest, res: NextApiResponse, next: any) => {
        if (!allowedMethods.includes(req.method || '')) {
            res.status(405).json({
                error: 'Método não permitido',
                allowedMethods: allowedMethods
            });
            return;
        }
        next();
    };
};

// Aplicando o middleware
router.use(checkAllowedMethods(['GET']));

// Rota GET
router.get(async (req, res) => {
    try {
        // Obter informações sobre conexões e versão
        const [connectionsResult, versionResult, maxConnectionsResult] = await Promise.all([
            database.query(`
                SELECT COUNT(*) 
                FROM pg_stat_activity 
                WHERE datname = 'mydb'
            `),
            database.query('SHOW server_version'),
            database.query('SHOW max_connections')
        ]);
        
        res.status(200).json({
            message: 'Status do banco de dados',
            status: 'ok',

            connections: {
                current: connectionsResult[0].count,
                max: maxConnectionsResult[0].max_connections
            },
            version: versionResult[0].server_version ?? "Não foi possível obter a versão do servidor"
        });
    } catch(error) {
        res.status(500).json({ error: 'Erro ao verificar o status do banco de dados' });
    }
});

// Rota POST (exemplo com UUID)
router.post(async (req, res) => {
    try {
        const id = uuidv4();
        res.status(200).json({ 
            message: 'Recurso criado com sucesso',
            id: id,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar recurso' });
    }
});

// Rota PUT (exemplo)
router.put(async (req, res) => {
    res.status(200).json({ message: 'Método PUT não implementado' });
});

// Rota DELETE (exemplo)
router.delete(async (req, res) => {
    res.status(200).json({ message: 'Método DELETE não implementado' });
});

export default router.handler({
    onError: (err, req, res) => {
        console.error(err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    },
    onNoMatch: (req, res) => {
        res.status(405).json({ 
            error: 'Método não permitido',
            allowedMethods: ['GET', 'POST', 'PUT', 'DELETE']
        });
    }
});
