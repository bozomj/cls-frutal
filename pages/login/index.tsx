import Link from "next/link";
import Header from "@/components/Header";
import { useState } from "react";

import autenticator from "@/models/autenticator";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import router from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (email === "" || password === "") {
      setError("E-mail e senha são obrigatórios");
      return;
    }

    try {
      const response = await fetch("/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.error) {
        setError("E-mail ou senha inválidos");
      } else {
        setError("");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center p-2 justify-center h-screen bg-gray-300 text-gray-700">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-gray-50 p-8 rounded-md w-full max-w-md "
        >
          <h1 className=" text-2xl font-bold text-center">Entrar</h1>
          <span>
            {error && (
              <p className="text-red-500 text-center font-bold">{error}</p>
            )}
          </span>
          <input
            className="p-3 bg-gray-300 text-gray-900 outline-2 outline-gray-400  focus:outline-cyan-500 focus:outline-4 rounded-md "
            required
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="p-3 bg-gray-300 text-gray-900 outline-2 outline-gray-400  focus:outline-cyan-500 focus:outline-4 rounded-md  "
            required
            type="password"
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn bg-cyan-800 text-white" type="submit">
            Entrar
          </button>
          <Link
            href="/cadastro"
            className=" hover:opacity-100 opacity-80 font-bold  text-sm w-fit self-end"
          >
            Não tem uma conta?{" "}
            <span className="text-cyan-800 ">Cadastre-se</span>
          </Link>
        </form>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const token = context.req.cookies.token || null;

  if (token != null) {
    try {
      autenticator.verifyToken(token);
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    } catch (error) {
      console.log({ error: error });
    }
  }

  return {
    props: {},
  };
};

export default Login;
