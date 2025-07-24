import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const id = router.query.id as string;
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [imgPrincial, setImgPrincipal] = useState<string>();

  const [render, setRender] = useState(false);

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
      if (v.length < 1) {
        router.push("/");
        return;
      }

      setItem(v[0]);

      setImagens(v[0].imagens);
      setImgPrincipal(v[0].imagens[0]?.url ?? null);

      setRender(true);
    });
  }, [id, router]);

  function toggleImg() {
    const im = document.getElementById("imgfull");
    console.log(im);
    im?.classList.toggle("hidden");
  }

  if (!render) return <></>;

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
            className="w-full absolute top-0 z-[5]  left-0 min-h-[100vh] bg-cyan-950/50 flex justify-center items-center px-1 hidden"
            onClick={() => {
              toggleImg();
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              tabIndex={0}
              src={utils.getUrlImage(imgPrincial)}
              alt=""
              className="w-full rounded  shadow-2xl shadow-black outline-3 outline-cyan-600"
            />
          </div>

          <section
            id="lista_imagems"
            className="flex gap-1 border-3 border-cyan-900 p-2 rounded-2xl"
          >
            <div className="w-[400px] block cursor-pointer    order-2 self-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                id="imagem_principal"
                className="w-[400px] min-h-[200px] rounded-md hover:outline-3 hover:outline-cyan-600"
                tabIndex={1}
                src={utils.getUrlImage(imgPrincial)}
                alt=""
                onClick={toggleImg}
              />
            </div>

            <div id="galeria" className="flex flex-col w-25  gap-2 order-1">
              {imagens.length > 0 &&
                imagens.map((img) => {
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="cursor-pointer hover:outline-3 outline-cyan-600 focus:outline-3 rounded"
                      src={utils.getUrlImage(img.url)}
                      alt=""
                      tabIndex={10}
                      key={img?.id}
                      onClick={() => setImgPrincipal(img.url)}
                    />
                  );
                })}
            </div>
          </section>

          <section>
            <div
              id="actions"
              className="flex justify-between items-center py-4"
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-2xl rounded-full p-2 w-6  bg-gray-400 flex items-center justify-center cursor-pointer text-gray-300 hover:bg-gray-600 transition duration-200 "
                />

                <span className="text-[1em]">{item.name}</span>
              </div>

              <div className="flex gap-2 items-center text-2xl">
                <a
                  target="_blank"
                  className="rounded-3xl bg-green-800 w-10 h-10 flex items-center justify-center p-2 text-white self-end hover:bg-green-600 transition duration-200"
                  href={`https://wa.me/55${item.phone}?text=ola gostariad e falar com voce`}
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>
                <a
                  href=""
                  target="_blank"
                  className="rounded-3xl bg-cyan-800 w-10 h-10 flex items-center justify-center p-2 text-white self-end hover:bg-cyan-500 transition duration-200"
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                >
                  <FontAwesomeIcon icon={faShare} />
                </a>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold  ">{item.title}</h1>
                <span className="text-[0.8em]">
                  Publicado {formatarData(item.created_at)}
                </span>
              </div>

              <span className="font-bold text-green-700">R$: {item.valor}</span>
              <div className="border-t-1 border-t-gray-400 py-2 my-4">
                <h2 className="font-bold">Sobre este item</h2>
                <p>{item.description}</p>
              </div>
            </div>
          </section>
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
