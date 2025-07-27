import Link from "next/link";
import Header from "@/components/Header";
import { useState } from "react";
import router from "next/router";

export default function Cadastro() {
  const [error, setError] = useState<Record<string, string>>({});
  const [phoneValue, setPhonevalue] = useState("");

  const phoneHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value.replace(/\D/g, "").slice(0, 15);
    setPhonevalue(number);
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("telefone") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const err: Record<string, string> = {};

    formData.forEach((value, key) => {
      if (value === "") {
        err[key] = "campo obrigatorio";
        err["isError"] = "Todos os Campos são Obrigatorios";
      }
    });

    if (password !== confirmPassword) {
      err["confirmPassword"] = "As senhas não conferem";
      err["isError"] = "Todos os Campos são Obrigatorios";
    }

    if (phone.length < 11) {
      err["telefone"] = "Precisa ter pelo menos 11 digitos";
      err["isError"] = "Todos os Campos são Obrigatorios";
    }

    setError(err);

    if (!err.isError) {
      handleCreateUser(name, email, password, phone);
    }

    async function handleCreateUser(
      name: string,
      email: string,
      password: string,
      phone: string
    ) {
      const user = await fetch("/api/v1/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await user.json();

      if (data.status === 201) {
        setError({ succes: "Usuario cadastrado com sucesso" });
        setTimeout(() => {
          router.replace("/login");
        }, 1000);
        return;
      }
      setError(data.cause);
    }
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-2">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-cyan-900 p-8 rounded-md w-full max-w-md "
        >
          <div className="font-bold">
            <h1 className="text-white text-2xl text-center">CADASTRO</h1>
            <p className="text-red-500 text-center h-[2em]">
              {error.isError ?? ""}
              {error.succes ?? ""}
            </p>
          </div>

          <input
            name="name"
            className={`p-2 rounded-md bg-cyan-50 text-cyan-900  ${
              error.name ? "outline-1 outline-red-500 " : "outline-none"
            }`}
            type="text"
            placeholder="nome"
          />

          <input
            name="email"
            className={`p-2 rounded-md bg-cyan-50 text-cyan-900  ${
              error.email ? "outline-1 outline-red-500 " : "outline-none"
            }`}
            type="email"
            placeholder="Email"
          />

          <input
            type="text"
            placeholder="Telefone"
            name="telefone"
            value={phoneValue}
            onChange={phoneHandler}
            className={`p-2 rounded-md bg-cyan-50 text-cyan-900  ${
              error.telefone ? "outline-1 outline-red-500 " : "outline-none"
            }`}
          />

          <input
            name="password"
            className={`p-2 rounded-md bg-cyan-50 text-cyan-900  ${
              error.password ? "outline-1 outline-red-500 " : "outline-none"
            }`}
            type="password"
            placeholder="Senha"
          />

          <input
            name="confirmPassword"
            className={`p-2 rounded-md bg-cyan-50 text-cyan-900  ${
              error.confirmPassword
                ? "outline-1 outline-red-500 "
                : "outline-none"
            }`}
            type="password"
            placeholder="Confirmar Senha"
          />

          <button
            className="p-2 rounded-md bg-cyan-300 text-cyan-900 cursor-pointer font-bold"
            type="submit"
          >
            Cadastrar
          </button>

          <Link
            href="/login"
            className=" hover:font-bold  text-sm  text-white w-fit "
          >
            Já tem uma conta? <span className="text-cyan-300 ">Faça Login</span>
          </Link>
        </form>
      </div>
    </>
  );
}
