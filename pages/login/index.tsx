
import Link from 'next/link';
import Header from '@/components/Header';

export default function Login() {
  return (
    <>
      <Header />
      <div className='flex flex-col items-center justify-center h-screen bg-gray-50'>
        <form className='flex flex-col gap-4 bg-cyan-900 p-8 rounded-md w-full max-w-md '>
        <h1 className='text-white text-2xl font-bold text-center'>LOGIN</h1>
        <input className='p-2 rounded-md bg-cyan-50 text-cyan-900 outline-none' type="email" placeholder="Email" />
        <input className='p-2 rounded-md bg-cyan-50 text-cyan-900 outline-none' type="password" placeholder="Senha" />
        <button className='p-2 rounded-md bg-cyan-300 text-cyan-900 cursor-pointer' type="submit">Entrar</button>
        <Link href="/cadastro" className=' hover:font-bold  text-sm  text-white w-fit '>Não tem uma conta? <span className='text-cyan-300 '>Cadastre-se</span></Link>
      </form>
      
    </div>

    </>
  )

} 