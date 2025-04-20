
import Link from 'next/link';
import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import router from 'next/router';
import autenticator from '@/models/autenticator';



  


const  Login = ()=>{
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect( () => {
    console.log('isAuthenticated', isAuthenticated);
     getLogin();
  }, []);

   

  async function getLogin(){
    const authenticated = await autenticator.isAuthenticated();
    
    if(authenticated){
      setIsAuthenticated(true);
      router.replace('/');
    }else{
      // setError('E-mail ou senha inválidos');
    }
    
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    
    if(email === '' || password === ''){
      setError('E-mail e senha são obrigatórios');
      return;
    }
    console.log('event', event);

    
    const response = await fetch('/api/v1/user', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    
    
    if(data.error){
      setError('E-mail ou senha inválidos');
    }else{
      setError('');
      // router.push('/');
      
    }
  }
  
  if(isAuthenticated) {
    return null
  }
  else{

    return (
      <>
      <Header />
      <div className='flex flex-col items-center justify-center h-screen bg-gray-50'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 bg-cyan-900 p-8 rounded-md w-full max-w-md '>
        <h1 className='text-white text-2xl font-bold text-center'>LOGIN</h1>
      <span>{error && <p className='text-red-500 text-center font-bold'>{error}</p>}</span>
        <input className='p-2 rounded-md bg-cyan-50 text-cyan-900 outline-none' required type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input className='p-2 rounded-md bg-cyan-50 text-cyan-900 outline-none' required type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
        <button className='p-2 rounded-md bg-cyan-300 text-cyan-900 cursor-pointer' type="submit">Entrar</button>
        <Link href="/cadastro" className=' hover:font-bold  text-sm  text-white w-fit '>Não tem uma conta? <span className='text-cyan-300 '>Cadastre-se</span></Link>
      </form>
      
    </div>

    </>
  )
}

} 

export default Login;