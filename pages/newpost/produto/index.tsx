import Card from "@/components/card";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Header from "@/components/Header";
import autenticator from "@/models/autenticator";
import { PostType } from "@/models/post";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

import Link from "next/link";
import { useState } from "react";

const post: PostType = {
  title: "",
  description: "",
  userId: "",
  valor: 0,
  categoria_id: "",
  createdAt: Date.now(),
};

export default function Produto() {
  const [categoria, setCategoria] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [valor, setValor] = useState("");
  const [urls, setImg] = useState<string[]>([]);
  const [imagens, setImagens] = useState<File[]>([]);
  const [postError, setError] = useState<{
    title: string;
    description: string;
    userId: string;
    valor: string;
    categoria_id: string;
    createdAt: string;
    id: string;
  }>({
    title: "",
    categoria_id: "",
    description: "",
    userId: "",
    valor: "",
    createdAt: "",
    id: "",
  });

  const categoriasValues = [
    { value: "", label: "Selecione a categoria" },
    { value: "veiculos", label: "Veículos" },
    { value: "imoveis", label: "Imóveis" },
    { value: "eletronicos", label: "Eletrônicos" },
    { value: "roupas", label: "Roupas e Acessórios" },
    { value: "moveis", label: "Móveis" },
    { value: "servicos", label: "Serviços" },
    { value: "animais", label: "Animais" },
    { value: "empregos", label: "Empregos" },
    { value: "outros", label: "Outros" },
  ];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    salvar();
  }

  const formatarMoeda = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const apenasNumeros = extractNumberInString(input);

    const numero = stringForDecimalNumber(apenasNumeros);
    const formatado = formatNumberForMoedaString(numero);

    setValor(formatado);
    post.valor = numero;
  };

  function extractNumberInString(str: string): string {
    return str.replace(/\D/g, "");
  }

  function stringForDecimalNumber(str: string): number {
    return parseInt(str || "0", 10) / 100;
  }

  function formatNumberForMoedaString(number: number): string {
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  async function uploadImage(id: string) {
    if (imagens.length > 3)
      return { error: "O numero de imagens devem ser no maximo 3!!" };
    const formdata = new FormData();
    for (const image of imagens) {
      formdata.append("image", image);
    }
    formdata.append("postid", id || "idcorreto");

    if (imagens.length > 0) {
      const uploadedImagens = await fetch("/api/v1/uploadImages", {
        method: "POST",
        body: formdata,
      });

      return uploadedImagens.json();
    }

    return null;
  }

  async function getIdUserAuthenticated() {
    return (await autenticator.isAuthenticated()).result.id;
  }

  const salvar = async () => {
    post.createdAt = Date.now();
    post.userId = await getIdUserAuthenticated();

    postError.description = post.description == "" ? "campo obrigatorio" : "";
    postError.title = post.title == "" ? "Campo obrigatorio" : "";
    postError.valor = post.valor <= 0 ? "Campo obrigatorio" : "";
    postError.categoria_id = post.categoria_id == "" ? "Campo obrigatorio" : "";

    setError({ ...postError });

    const posted = await fetch("/api/v1/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    const jsonresult = await posted.json();

    if (jsonresult.message == "erro ao inserir post") {
      throw jsonresult;
    }

    await uploadImage(jsonresult[0].id);

    post.categoria_id = "";
    post.description = "";
    post.title = "";
    post.valor = 0;
    post.createdAt = 0;
    post.id = "";
    post.userId = "";
    post.url = "";

    setValor("");
    setCategoria("");
    setTitle("");
    setDescription("");

    setImagens([]);
    setImg([]);
  };

  return (
    <>
      <Header />
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center p-2">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-cyan-950 rounded p-4 md:w-[480px] m-4 w-full "
        >
          <span className="text-red-800">{postError.title}</span>
          <input
            type="text"
            value={title}
            placeholder="Titulo"
            className="p-3 bg-cyan-50 text-gray-900 outline-0 "
            onChange={(e) => {
              post.title = e.target.value;
              setTitle(post.title);
            }}
          />
          <span className="text-red-800">{postError.description}</span>
          <textarea
            placeholder="Descrição"
            value={description}
            className={`p-3 bg-cyan-50 text-gray-900 outline-0 ${
              postError.description ? "border-2 border-red-600" : "border-none"
            } `}
            onChange={(e) => {
              post.description = e.target.value;
              setDescription(post.description);
            }}
          />
          <span className="text-red-800">{postError.categoria_id}</span>
          <select
            name=""
            id=""
            className={`p-3 bg-cyan-50  outline-0 
              ${categoria === "" ? "text-gray-400" : "text-gray-800"}`}
            onChange={(e) => {
              setCategoria(e.target.value);
              post.categoria_id = e.target.value;
            }}
          >
            {categoriasValues.map((e) => (
              <option
                key={e.value}
                value={e.value}
                disabled={e.value === ""}
                selected={e.value === ""}
                className={`${
                  e.value === "" ? "text-gray-400" : "text-gray-800"
                }`}
              >
                {e.label}
              </option>
            ))}
          </select>
          <span className="text-red-800">{postError.valor}</span>
          <input
            type="text"
            placeholder="R$: 0,00"
            value={valor}
            className="text-gray-900 outline-0 p-3 bg-cyan-50"
            onChange={(e) => {
              formatarMoeda(e);
            }}
          />

          <label>
            <span className="bg-cyan-700 block w-fit p-2 rounded">
              <FontAwesomeIcon icon={faImage} className="text-3xl" />
            </span>
            <input
              type="file"
              multiple
              max={3}
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;

                // const preview = document.getElementById("preview");
                if (files) {
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];

                    // Verifica se o arquivo é uma imagem
                    if (file.type.startsWith("image/")) {
                      // Cria uma URL temporária para o arquivo
                      const imgURL = URL.createObjectURL(file);

                      setImagens((e) => [...e, file]);
                      setImg((e) => [...e, imgURL]);
                    }
                  }
                }
              }}
            />
          </label>

          <div id="preview" className="flex gap-2 flex-col">
            {urls.map((e, index) => {
              return (
                <div key={index} className="relative w-fit">
                  <Card key={index}>
                    <div
                      className="absolute bg-amber-600 rounded-[50%] p-1 right-0 top-0"
                      onClick={() => {
                        setImg((prev) => prev.filter((_, i) => i !== index));
                        setImagens((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      X
                    </div>
                    <Image src={e} alt="" width={150} height={150} />
                  </Card>
                </div>
              );
            })}
          </div>

          <span className="flex gap-2 ite">
            <Link href={""} className="flex-1">
              Cancelar
            </Link>
            <button className="bg-cyan-600 p-2 flex-1 rounded">Salvar</button>
          </span>
        </form>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const token = context.req.cookies.token || "";
  let auth = null;
  try {
    auth = autenticator.verifyToken(token);
  } catch (error) {
    console.log({
      redirect: error,
    });
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ctx: auth.id,
    },
  };
};
