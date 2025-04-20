import database from "@/database/database";
import User from "@/models/user";

// async function cleanDatabase(){
//     const client = await database.getNewClient();
//     await client.query("drop schema public cascade; create schema public;");
//     await client.end();
    
// }

// beforeAll(async () => {
    
//     await cleanDatabase();
    
    
// });

describe('User', () => {
    it('lista usuario por id', async () => {
         const user = await User.findById("2c05779f-831c-4054-bc00-87d966d2012c");
        
        console.log('usuario por id', user);
         expect(user).toEqual(expect.any(Array));
    });

    it('mostrar tabelas', async () => {
        const tables = await database.query('select table_name from information_schema.tables where table_schema = \'public\';');
        
        console.log('tables', tables);
        expect(tables).toEqual(expect.any(Array));
    });

    it('cria usuario', async () => {
        const user = await User.create({name: 'teste', email: 'teste@teste.com', password: '123456'});
        console.log('user', user);
        // expect(user).toEqual(expect.any(Object));
    });
});