import database from "@/database/database";

const User = {
    findAll: async () => {
        let dbClient;
        try{
             dbClient = await database.getNewClient();
            
              const result = await database.query('SELECT * from users;');
            return result;
        }catch(error){
            
            throw {
                message: new Error("Erro ao buscar usuários"),
                cause: { CAUSE: error }
            };
        }
        
    },

    findById: (id: number) => {
        return [
     
        ]
    }

    
}

export default User;
