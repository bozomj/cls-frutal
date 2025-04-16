
import Link from 'next/link';
import Header from '@/components/Header';
export default function Cadastro() {
  return (
    <>
      <Header />
      <div className='flex flex-col items-center justify-center h-screen bg-gray-50'>
        <form className='flex flex-col gap-4 bg-cyan-900 p-8 rounded-md w-full max-w-md '>
        <h1 className='text-white text-2xl font-bold text-center'>CADASTRO</h1>
        <input className='p-2 rounded-md bg-cyan-50 text-cyan-900 outline-none' type="text" placeholder="nome" />
        <input className='p-2 rounded-md bg-cyan-50 text-cyan-900 outline-none' type="email" placeholder="Email" />
        <input className='p-2 rounded-md bg-cyan-50 text-cyan-900 outline-none' type="password" placeholder="Senha" />
        <input className='p-2 rounded-md bg-cyan-50 text-cyan-900 outline-none' type="password" placeholder="Confirmar Senha" />
        <button className='p-2 rounded-md bg-cyan-300 text-cyan-900 cursor-pointer font-bold' type="submit">Cadastrar</button>
        <Link href="/login" className=' hover:font-bold  text-sm  text-white w-fit '>Já tem uma conta? <span className='text-cyan-300 '>Faça Login</span></Link>
      </form>
    
    </div>
    </>
  )

} 