import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import Header from "@/components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import utils from "@/utils";

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
    created_at: "",
    imagens: [],
    description: "",
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (!id) return;

    getPost(id).then((v) => {
      setItem(v[0]);

      setImagens(v[0].imagens);
      setImgPrincipal(v[0].imagens[0]?.url ?? null);

      console.log(v[0]);
    });
  }, [id]);

  function toggleImg() {
    const im = document.getElementById("imgfull");
    console.log(im);
    im?.classList.toggle("hidden");
  }

  return (
    <>
      <header className="">
        <Header
          onSubmit={async (e) => {
            console.log(e);
          }}
        />
      </header>
      <main className=" p-2 flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center text-black">
        <section className="flex flex-col gap-2 w-full">
          <div
            id="imgfull"
            className="w-full absolute top-0 z-[5] hidden left-0 min-h-[100vh] bg-cyan-50/50 flex items-center "
            onClick={() => {
              toggleImg();
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img tabIndex={0} src={getFileName(imgPrincial)} alt="" />
          </div>
          <div className="flex gap-1 border-3 border-cyan-900 p-2 rounded-2xl">
            <span className="w-[400px] block  order-2 self-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                tabIndex={1}
                src={getFileName(imgPrincial)}
                alt=""
                className="w-[400px] min-h-[200px]"
                onClick={toggleImg}
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
          <section className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full h-10 w-10 bg-gray-400 flex items-center justify-center text-gray-300">
                <FontAwesomeIcon icon={faUser} className="text-2xl" />{" "}
              </span>
              <span className="text-[1em]">{item.name}</span>
            </div>

            <div className="flex gap-2 items-center">
              <a
                target="_blank"
                href={`https://wa.me/55${item.phone}?text=ola gostariad e falar com voce`}
                className="rounded-3xl bg-green-800 w-10 h-10 flex items-center justify-center p-2 text-white self-end "
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
              </a>
              <a
                href=""
                target="_blank"
                className="rounded-3xl bg-cyan-800 w-10 h-10 flex items-center justify-center p-2 text-white self-end "
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
              >
                {/* compartilhar */}
                <FontAwesomeIcon icon={faShare} />
              </a>
            </div>
          </section>

          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold  ">{item.title}</h1>
              <h2 className="text-[0.8em]">
                <span>Publicado {formatarData(item.created_at)} </span>
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
  return utils.getUrlImage(path);
}
