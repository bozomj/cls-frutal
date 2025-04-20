import database from "@/database/database";
import password from "@/models/password";
import dotenv from 'dotenv';
import autenticator from "@/models/autenticator";

dotenv.config({path: '.env.development'});




const User = {

    
    findAll: async () => {
        try{
            const result = await database.query('SELECT * FROM users;');

            
            return result;
        }catch(error){
            throw {
                message: new Error("Erro ao buscar usuários"),
                cause: { CAUSE: error }
            };
        }
    },

    findById: async (id: string) => {
        let result;
        result = await database.query('SELECT * from users where id = $1;', [id]);    
        if(result < 1){
            throw {
                message: new Error("Usuário não encontrado"),
                cause: { CAUSE: result }
            };
        }
        return result;
    },

    findByName: async (username: string) => {
        let dbClient;
        try{
            dbClient = await database.getNewClient();
            const result = await database.query('SELECT * from users where name = $1;', [username]);
            console.log(result);
            return result;
        }catch(error){
            throw {
                message: new Error("Erro ao buscar usuário"),
                cause: { CAUSE: error }
            };
        }finally{
            if(dbClient){
                await dbClient.end();
            }
        }
    },

    findByEmail: async (email: string) => {
        const result = await database.query('SELECT * from users where LOWER(email) = LOWER($1) limit 1;', [email]);
        return result;
    },
    
    


    create: async (userInputValues: any) => {
        
        try{
            await validateUniqueEmail(userInputValues.email);
        }catch(error){
            throw error;
        }

        try{
          return  await runInsertQuery(userInputValues);
          
        }catch(error){
            throw {
                message: new Error("Erro ao criar usuário"),
                cause: { CAUSE: error }
            };
        }
        

        async function validateUniqueEmail(email: string){
            const user = await User.findByEmail(email);
            if(user.length > 0){
                throw {
                    message: "O email informado já está sendo utilizado",
                    cause: user
                };
            }
        }


        async function runInsertQuery(userImputValues: any){
            
            let result;
            try{
            return    result = await database.query(
                    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;', 
                    [
                    userImputValues.name, 
                    userImputValues.email,
                    await password.hashPassword(userInputValues.password)
                ]
            );
            return result.rows[0];
            }catch(error){
                
                throw {
                    message: new Error("Erro ao criar usuário - interno"),
                    cause: { CAUSE: error },
                    
                };
            }
        }
    },

    login: async (email: string, senha: string) => {
        const user = await User.findByEmail(email);
        if(user.length < 1){
            throw {
                message: new Error("Usuário não encontrado"),
                cause: { CAUSE: user }
            };
        }
        
        
        const passwordMatch = await password.comparePassword(senha, user[0].password);

        
        
        
        if(!passwordMatch){
            throw {
                message: "Senha incorreta",
                cause: {'passwordMatch': passwordMatch}
            };
        }

        
        
        const token = autenticator.createToken(user[0].id);
        return token;
        
        

        
        
        
        
        
        
        
        
       
        
        
    }

}

export default User;
