import autenticator from '@/models/autenticator';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

function Dashboard({ctx}: {ctx: any}){
    
  return (
    <div>
        <h1>Dashboard</h1>
        <h1>{ctx}</h1>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

    const token = context.req.cookies.token || '';
    let auth = null;
    try{    
        auth =  autenticator.verifyToken(token);
        console.log('auth', auth.id);
    }catch(error){
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }
    
    

    
    return {
        props: {
           
        }
    };

   
    
}

export default Dashboard;




