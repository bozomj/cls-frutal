import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import Header from "@/components/Header";

async function getPost(id: string) {
  const res = await fetch(`/api/v1/posts/${id}`);
  return await res.json();
}

type Imagem = {
  url: string;
  id: string;
  post_id: string;
};

export default function DetailsPostPage() {
  const id = useRouter().query.id as string;
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [imgPrincial, setImgPrincipal] = useState<string>();
  const [item, setItem] = useState({
    id: "",
    title: "",
    valor: "",
    createdAt: "",
    imagens: [],
    description: "",
    name: "",
  });

  useEffect(() => {
    if (!id) return;

    getPost(id).then((v) => {
      setItem(v[0]);

      setImagens(v[0].imagens);
      setImgPrincipal(v[0].imagens[0]?.url ?? null);
    });
  }, [id]);

  function setSearch(e: string) {
    throw new Error(`Function not implemented. ${e}`);
  }

  return (
    <>
      <header className="">
        <Header
          onSubmit={async (e) => {
            setSearch(e);
          }}
        />
      </header>
      <main className=" p-2 flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center text-black">
        <section className="flex flex-col gap-2 w-full">
          <div className="flex gap-1">
            <span className="w-[400px] block  order-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getFileName(imgPrincial)}
                alt=""
                className="w-[400px]"
              />
            </span>
            <div className="flex flex-col w-25  gap-2 order-1">
              {...imagens.map((img) => {
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="cursor-pointer hover:outline-3 outline-cyan-600 focus:outline-3 rounded"
                    src={getFileName(img?.url)}
                    alt=""
                    tabIndex={10}
                    key={img?.id}
                    onClick={() => {
                      setImgPrincipal(img.url);
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="rounded-full h-10 w-10 bg-gray-400"></span>
              <span className="text-[1em]">{item.name}</span>
            </div>
            <div className="rounded bg-cyan-800 w-fit p-2 text-white self-end">
              compartilhar
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold  ">{item.title}</h1>
              <h2 className="text-[0.8em]   ">
                {formatarData(item.createdAt)}
              </h2>
            </div>
            <span className="font-bold text-green-700">R$: {item.valor}</span>
            <div className="border-t-1 border-t-gray-400 py-2 my-4">
              <h3 className="font-bold">Sobre este item</h3>
              <p>{item.description}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function formatarData(data: string) {
  const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const d = new Date(data);
  const dia = String(d.getUTCDate()).padStart(2, "0");
  const mes = String(d.getUTCMonth() + 1).padStart(2, "0"); // Mês começa do zero
  const ano = d.getUTCFullYear();
  const diaSemana = diasSemana[d.getUTCDay()];

  return `${diaSemana} ${dia}/${mes}/${ano}`;
}

function getFileName(path?: string): string {
  if (path == null)
    return "https://www2.camara.leg.br/atividade-legislativa/comissoes/comissoes-permanentes/cindra/imagens/sem.jpg.gif/image";
  if (
    path ==
    "https://www2.camara.leg.br/atividade-legislativa/comissoes/comissoes-permanentes/cindra/imagens/sem.jpg.gif/image"
  )
    return path;
  return "/uploads/" + path?.split(/[/\\]/).pop() || "";
}
