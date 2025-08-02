import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPlusSquare,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import utils from "@/utils";
import { GetServerSidePropsContext } from "next";
import Prompt, { TypePrompt } from "@/components/Prompt";
import Alert from "@/components/Alert";
import Footer from "@/layout/footer";

async function getPost(id: string) {
  const res = await fetch(`/api/v1/posts/${id}`);
  return await res.json();
}

type Imagem = {
  url: string;
  id: string;
  post_id: string;
};

type Props = {
  user_id?: string;
};

export default function DetailsPostPage({ user_id }: Props) {
  const router = useRouter();
  const id = router.query.id as string;
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [imgPrincial, setImgPrincipal] = useState<string>();

  const [render, setRender] = useState(false);

  const [prompt, setPrompt] = useState(<></>);
  const [alert, setAlert] = useState(<></>);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [item, setItem] = useState({
    id: "",
    title: "",
    valor: "",
    created_at: "",
    imagens: [],
    description: "",
    name: "",
    phone: "",
    user_id: "",
    updated_at: "",
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

    im?.classList.toggle("hidden");
    im?.classList.toggle("flex");
  }
  function IsPostUserId() {
    return item.user_id == user_id;
  }

  if (!render) return <></>;

  return (
    <>
      <header className="">
        <Header />

        <meta property="og:title" content={item.title} />
        <meta property="og:image" content={item.imagens[0]} />
      </header>
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center text-black ">
        <section className="flex flex-auto flex-col gap-2 w-full max-w-[40rem] p-4 bg-gray-100 rounded-2xl shadow-sm shadow-gray-400 my-2">
          <div className="bg-gray-300 rounded-2xl flex-auto p-2">
            <span
              id="imgfull"
              className="w-full absolute top-0 z-[5] left-0 min-h-[100vh] bg-cyan-950/50 justify-center items-center px-1 hidden"
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
            </span>

            <section
              id="lista_imagems"
              className="flex gap-1 border-3 border-gray-400 p-2 rounded-2xl w-full items-cente h-[25rem]"
            >
              <div className="w-full cursor-pointer order-2 self-center h-full items-center flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  id="imagem_principal"
                  className=" max-h-full rounded-md hover:outline-3 hover:outline-cyan-600"
                  tabIndex={1}
                  src={utils.getUrlImage(imgPrincial)}
                  alt=""
                  onClick={toggleImg}
                />
              </div>

              <div
                id="galeria"
                className="flex flex-col w-2/7 gap-2 order-1 h-full justify-center"
              >
                {imagens.length > 0 &&
                  imagens.map((img) => {
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="cursor-pointer hover:outline-3 shrink outline-cyan-600 focus:outline-3 rounded"
                        src={utils.getUrlImage(img?.url || "")}
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
                {prompt}
                <div className="flex  justify-between items-start flex-col-reverse">
                  <h1 className="text-xl font-bold  ">
                    {IsPostUserId() && (
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="text-xl pr-4 text-green-800 cursor-pointer"
                        onClick={() => {
                          setPrompt(
                            <Prompt
                              type={TypePrompt.text}
                              msg={"Editar Titulo"}
                              value={item.title}
                              confirm={(e) => {
                                if (e != item.title) {
                                  setButtonDisabled(false);
                                  setItem((p) => ({ ...p, title: e! }));
                                }
                                setPrompt(<></>);
                              }}
                            />
                          );
                        }}
                      />
                    )}
                    {item.title}
                  </h1>
                  <span className="text-[0.8em]">
                    Publicado {utils.formatarData(item.created_at)}
                    {item.updated_at}
                  </span>
                </div>
                <span className="font-bold text-green-700 ">
                  {IsPostUserId() && (
                    <FontAwesomeIcon
                      className="text-xl pr-4 text-green-800 cursor-pointer"
                      icon={faEdit}
                      onClick={() => {
                        setPrompt(
                          <Prompt
                            msg={"Editar Valor"}
                            value={item.valor}
                            type={TypePrompt.money}
                            confirm={(e) => {
                              if (e != null) {
                                e = utils.extractNumberInString(e);
                                e = utils.stringForDecimalNumber(e).toFixed(2);
                              }

                              if (e != item.valor && e != "0.00") {
                                setButtonDisabled(false);
                                setItem((p) => ({ ...p, valor: e! }));
                              }
                              setPrompt(<></>);
                            }}
                          />
                        );
                      }}
                    />
                  )}
                  <span>R$: {item.valor}</span>
                </span>
                <div className="border-t-1 border-t-gray-400 py-2 my-4">
                  <h2 className="font-bold">Sobre este item</h2>
                  <div className="flex">
                    {IsPostUserId() && (
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="text-xl pr-4 text-green-800 cursor-pointer"
                        onClick={() => {
                          setPrompt(
                            <Prompt
                              msg={"Editar Descrição"}
                              value={item.description}
                              multiple={true}
                              confirm={(e) => {
                                if (e != item.description) {
                                  setButtonDisabled(false);
                                  setItem((p) => ({ ...p, description: e! }));
                                }
                                setPrompt(<></>);
                              }}
                            />
                          );
                        }}
                      />
                    )}
                    <p>{item.description}</p>
                  </div>
                  {IsPostUserId() && (
                    <div className="border-t-1 border-gray-400 flex justify-end py-4 mt-4">
                      <button
                        type="button"
                        disabled={buttonDisabled}
                        className={` p-2 rounded-md  font-bold ${
                          !buttonDisabled
                            ? "text-white bg-cyan-600"
                            : "bg-gray-500 text-gray-800"
                        }`}
                        onClick={async () => {
                          const result = await fetch("/api/v1/posts", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(item),
                          });

                          const updated = await result.json();

                          if (updated.id) {
                            setAlert(
                              <Alert
                                msg={"Update Realizado com sucesso!"}
                                onClose={() => setAlert(<></>)}
                              />
                            );
                            setButtonDisabled(true);
                          }
                        }}
                      >
                        Editar
                      </button>
                    </div>
                  )}
                  {alert}
                </div>
              </div>
            </section>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const result = utils.redirectNotToken(ctx, "");
  if ("redirect" in result) return { props: { user_id: null } };

  const { ctx: user_id } = result.props;

  return {
    props: { user_id }, // enviado como props para a página
  };
}
