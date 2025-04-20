import autenticator from '@/models/autenticator';
import { faCalendar, faEnvelope, faUser, faFolder, faClipboard  } from '@fortawesome/free-regular-svg-icons';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Dashboard({ctx}: {ctx: any}){
    const [user, setUser] = useState<any>({});

    useEffect(() => {
       getUser(ctx);
    }, []);
    
  return (
    <>
    <header>

    <Header titulo='Dashboard'/>
    </header>
    <main className='flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between  items-center'>
    <div className='w-full h-[100vh] flex'>
        <section className='group bg-cyan-950 max-w-[5rem] overflow-x-hidden  p-4 flex items-start flex-col gap-2 hover:max-w-[25rem] transition-all duration-500 border-r-2 '>

            <div className='flex flex-col  gap-2'>
                <span className='rounded-full  w-[3rem] h-[3rem] group-hover:block   bg-white   group-hover:w-[8rem] group-hover:h-[8rem] transition-all duration-500'></span>
                <span className='flex gap-2 p-3  group-hover:flex'>
                    <FontAwesomeIcon icon={faUser} className='text-2xl'/>


                    <p className='text-white whitespace-nowrap  opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:block'  >{user.name ?? ''}</p>
                </span>


            </div>

            <ul >
                <li>
                    <div className='flex items-center gap-2 p-3'>
                        <span>
                            <FontAwesomeIcon icon={faEnvelope} className='text-2xl'/>
                        </span>
                        <span className='opacity-0 group-hover:block whitespace-nowrap group-hover:opacity-100 transition-all duration-500' >
                            {user.email ?? ''}
                        </span>
                    </div>
                </li>
                <li>
                    <div className='flex items-center    gap-2 p-3 min-w-[15rem]'>
                        <span>

                        <FontAwesomeIcon icon={faCalendar} className='text-2xl'/>
                        </span>
                        <span className=' opacity-0 group-hover:block whitespace-nowrap group-hover:opacity-100 transition-all duration-500'>

                        {user.createdAt ?? ''}
                        </span>
                    </div>
                </li>
                <li>
                    <div className='flex items-center  gap-2 p-3 min-w-[15rem]'>
                        <span>

                        <FontAwesomeIcon icon={faClipboard} className='text-2xl'/>
                        </span>
                        <span className=' opacity-0 group-hover:block whitespace-nowrap group-hover:opacity-100 transition-all duration-500'>

                        Produtos
                        </span>
                    </div>
                </li>
                
            </ul>
            
        </section>
        <section className='flex-1 p-2 h-full'>
            <div className='h-[250px] bg-gray-400 rounded-lg '>

            </div>
        </section>
        
    </div>
        
    </main>
    
    </>
  )

  async function getUser(id: string){
    const query = `/api/v1/user/id/${id}`;
    const response = await fetch(query);
    const data = await response.json();
    
    setUser(data);
    
    

    
}
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

    const token = context.req.cookies.token || '';
    let auth = null;
    try{    
        auth =  autenticator.verifyToken(token);
        
    }catch(error){
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }
    
    
console.log('aui',auth.id);
    
    return {
        props: {
           ctx: auth.id
        }
    };

   
    
}




export default Dashboard;




