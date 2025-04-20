
import user from '@/models/user';
import Link from 'next/link';
import Header from '@/components/Header';
import { useState } from 'react';
import router from 'next/router';

export default function Cadastro() {
  const [error, setError] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get('name') as string ;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    let err = '';
    

    
    formData.forEach((value) => {
      
      if(value === ''){
        err = 'Todos os campos são obrigatórios';
        return ;
      }
      
    });
    
    if(err === ''){
      if(password !== confirmPassword ){
        err ='As senhas não conferem';
        
      }
    }
    
    setError(err);
    if(err === '') {

      
        handleCreateUser(name, email, password);
      
      
        
        
      
      
    }
    
    
    
    
    

    
    async function handleCreateUser(name: string, email: string, password: string){
      
      
     
      const user = await fetch('/api/v1/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password }),
        }) as any;

        const data = await user.json();
        
        if(data.status === 201){
         setError('Usuario criado com sucesso');
         setTimeout(() => {
          router.replace('/login');
         }, 1000);
         return;
        }
        setError(data.cause);
        
        


    }
  }


  return (
    <>
      <Header />
      <div className='flex flex-col items-center justify-center h-screen bg-gray-50'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 bg-cyan-900 p-8 rounded-md w-full max-w-md '>
        <h1 className='text-white text-2xl font-bold text-center'>CADASTRO</h1>
          <span>{error && <p className='text-red-500 text-center font-bold'>{error}</p>}</span>
        <input name='name' className='p-2 rounded-md bg-cyan-50 text-cyan-900 outline-none' type="text" placeholder="nome" />
        <input name='email' className='p-2 rounded-md bg-cyan-50 text-cyan-900 outline-none' type="email" placeholder="Email" />
        <input name='password' className='p-2 rounded-md bg-cyan-50 text-cyan-900 outline-none' type="password" placeholder="Senha" />
        <input name='confirmPassword' className='p-2 rounded-md bg-cyan-50 text-cyan-900 outline-none' type="password" placeholder="Confirmar Senha" />
        <button className='p-2 rounded-md bg-cyan-300 text-cyan-900 cursor-pointer font-bold' type="submit">Cadastrar</button>
        <Link href="/login" className=' hover:font-bold  text-sm  text-white w-fit '>Já tem uma conta? <span className='text-cyan-300 '>Faça Login</span></Link>
      </form>
    
    </div>
    </>
  )

} 

