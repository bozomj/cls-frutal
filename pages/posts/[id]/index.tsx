import Header from "@/components/Header";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faUser } from "@fortawesome/free-regular-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import utils from "@/utils";
import { GetServerSidePropsContext } from "next";

import Alert from "@/components/Alert";
import Footer from "@/layout/FooterLayout";

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

const _item = {
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
};

export default function DetailsPostPage({ user_id }: Props) {
  const router = useRouter();
  const id = router.query.id as string;

  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [imgPrincial, setImgPrincipal] = useState<string>();
  const [render, setRender] = useState(false);
  const [alert, setAlert] = useState(<></>);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [item, setItem] = useState(_item);

  const [isPostUserId, IsPostUserId] = useState(false);

  const titleRef = useRef<HTMLElement | null>(null);
  const valorRef = useRef<HTMLElement | null>(null);
  const descricaoRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (!id) return;

    getPost(id).then((v) => {
      if (v.length < 1 || v.message) {
        router.push("/");
        return;
      }

      setItem(v[0]);

      setImagens(v[0].imagens);
      setImgPrincipal(v[0].imagens[0]?.url ?? null);

      setRender(true);
      IsPostUserId(item.user_id == user_id);
    });
  }, [id, item.user_id, router, user_id]);

  function toggleImg() {
    const im = document.getElementById("imgfull");

    im?.classList.toggle("hidden");
    im?.classList.toggle("flex");
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
        <section
          id="frame-1"
          className="flex flex-auto flex-col gap-2 w-full max-w-[40rem] p-4 bg-gray-100 rounded-2xl shadow-sm shadow-gray-400 my-2"
        >
          <div id="frame-2" className="bg-gray-300 rounded-2xl flex-auto p-2">
            <div
              id="imgfull"
              className=" 
              absolute top-0 z-[5] left-0 h-full w-full 
              bg-cyan-950/80 
              justify-center items-center px-1 hidden"
              onClick={() => toggleImg()}
            >
              <div className="flex flex-col bg-red gap-2 order-1 h-full justify-center w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  tabIndex={0}
                  src={utils.getUrlImage(imgPrincial)}
                  alt=""
                  className={`cursor-pointer object-contain max-h-full w-full `}
                  // className=" flex-1 rounded  object-contain shadow-2xl shadow-black outline-3 outline-cyan-600"
                />
              </div>
            </div>

            <section
              id="lista_imagems"
              className="flex gap-1 border-3 border-gray-400 p-2 rounded-2xl w-full items-cente h-[25rem]"
            >
              <div
                id="imagem_principal"
                className="w-full cursor-pointer order-2 self-center h-full items-center flex justify-center bg-gray-100 rounded-r-2xl p-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className=" max-h-full rounded-md hover:outline-3 hover:outline-cyan-600"
                  tabIndex={1}
                  src={utils.getUrlImage(imgPrincial)}
                  alt=""
                  onClick={toggleImg}
                />
              </div>

              <div
                id="galeria"
                className="flex flex-col w-2/7 gap-2 order-1 h-full   overflow-hidden"
              >
                {imagens.length > 0 &&
                  imagens.map((img, key) => {
                    if (img == null) return;
                    const rounded =
                      key == 0
                        ? " rounded-tl-2xl"
                        : key < imagens.length - 1
                        ? "rounded-sm"
                        : "rounded-bl-2xl";

                    return (
                      <div
                        className={`flex flex-1 justify-center w-full bg-gray-100  shrink h-1/3 ${rounded} overflow-hidden  max-h-1/3
                        border-3 border-gray-100 p-1
                        hover:border-cyan-600 
                        `}
                        key={img.id}
                        onClick={() => setImgPrincipal(img.url)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                        <img
                          className={`cursor-pointer object-contain rounded-md`}
                          src={utils.getUrlImage(img.url)}
                        />
                      </div>
                    );
                  })}
              </div>
            </section>

            <section id="dados-postagem">
              <div
                id="actions"
                className="flex justify-between items-center py-4"
              >
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-2xl rounded-full p-2 w-6  bg-gray-400 flex items-center justify-center cursor-pointer text-gray-300 hover:bg-gray-600 transition duration-200 "
                  />

                  <span className="text-[1em]">
                    {utils.string.capitalizar(item.name)}
                  </span>
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
                <div className="flex  justify-between items-start flex-col-reverse">
                  <h1 className="text-xl font-bold w-full">
                    <label className="flex  gap-2 items-center">
                      {isPostUserId && (
                        <FontAwesomeIcon
                          icon={faEdit}
                          onClick={() => {
                            titleRef.current!.focus();
                          }}
                          className="text-xl pr-2  text-green-800 cursor-pointer peer"
                        />
                      )}
                      <span
                        ref={titleRef}
                        className="focus:outline-2 focus:outline-gray-400 p-2 "
                        {...(isPostUserId
                          ? {
                              contentEditable: true,
                              suppressContentEditableWarning: true,
                              onInput: () => {
                                setButtonDisabled(false);
                              },
                              onBlur: (e) => {
                                const value = e.currentTarget.innerText;
                                setItem((p) => ({ ...p, title: value }));
                              },
                            }
                          : {})}
                      >
                        {item.title}
                      </span>
                    </label>
                  </h1>

                  <span className="text-[0.8em]">
                    Publicado {utils.formatarData(item.created_at)}
                  </span>
                </div>
                <span className="font-bold text-green-700  ">
                  {isPostUserId && (
                    <FontAwesomeIcon
                      className="text-xl pr-4 text-green-800 cursor-pointer"
                      onClick={() => valorRef.current!.focus()}
                      icon={faEdit}
                    />
                  )}
                  <span className="pl-2">{"R$:"}</span>
                  <span
                    ref={valorRef}
                    className="focus:outline-2  focus:outline-gray-400 p-2"
                    {...(isPostUserId
                      ? {
                          contentEditable: true,
                          suppressContentEditableWarning: true,
                          onInput: (v) => {
                            const e = utils.extractNumberInString(
                              v.currentTarget.innerText
                            );
                            v.currentTarget.innerHTML = utils
                              .stringForDecimalNumber(e)
                              .toFixed(2);

                            moveCursorToEnd(v.currentTarget);
                          },
                          onBlur: (v) => {
                            const e = v.currentTarget.innerText;
                            setButtonDisabled(false);
                            setItem((p) => ({ ...p, valor: e }));
                          },
                        }
                      : {})}
                  >
                    {item.valor}
                  </span>
                </span>
                <div className="border-t-1 border-t-gray-400 py-2 my-4">
                  <h2 className="">Sobre este item</h2>
                  <div className="flex items-center">
                    {isPostUserId && (
                      <FontAwesomeIcon
                        icon={faEdit}
                        onClick={() => descricaoRef.current!.focus()}
                        className="text-xl pr-4 text-green-800 cursor-pointer"
                      />
                    )}
                    <p
                      ref={descricaoRef}
                      className="focus:outline-2 focus:outline-gray-400 p-2"
                      {...(isPostUserId
                        ? {
                            contentEditable: true,
                            suppressContentEditableWarning: true,
                            onInput: () => {
                              setButtonDisabled(false);
                            },
                            onBlur: (e) => {
                              const value = e.currentTarget.innerText;
                              setItem((p) => ({ ...p, description: value }));
                            },
                          }
                        : {})}
                    >
                      {item.description}
                    </p>
                  </div>

                  {isPostUserId && (
                    <div className="border-t-1 border-gray-400 flex justify-end py-4 mt-4">
                      <button
                        type="button"
                        disabled={buttonDisabled}
                        className={` p-2 rounded-md  font-bold  ${
                          !buttonDisabled
                            ? "text-white bg-cyan-600 cursor-pointer"
                            : "bg-gray-500 text-gray-800"
                        }`}
                        onClick={postUpdate}
                      >
                        Editar
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {alert}
            </section>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );

  function moveCursorToEnd(el: HTMLElement) {
    const range = document.createRange();
    const sel = window.getSelection();

    range.selectNodeContents(el);
    range.collapse(false); // false = coloca no fim do conteúdo

    sel!.removeAllRanges();
    sel!.addRange(range);
  }

  async function postUpdate() {
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
  }
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const result = utils.redirectNotToken(ctx, "/");
  if ("redirect" in result) return { props: { user_id: null } };

  const { ctx: user_id } = result.props;

  return {
    props: { user_id }, // enviado como props para a página
  };
}
