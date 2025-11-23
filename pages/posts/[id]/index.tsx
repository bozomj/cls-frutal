import Header from "@/components/Header";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faImage, faUser } from "@fortawesome/free-regular-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import utils from "@/utils";
import { GetServerSidePropsContext } from "next";

import Alert from "@/components/Alert";
import Footer from "@/layout/FooterLayout";
import CircleAvatar from "@/components/CircleAvatar";
import Card from "@/components/Card";
import { imagemFirebase } from "@/storage/firebase";
import postController from "@/controllers/postController";
import FullImageView from "@/components/FullImageView";
import MiniGalleryImage from "@/components/MiniGalleryImage";
import Image from "next/image";
import ImageCardPreview from "@/components/ImageCardPreview";

type Props = {
  user_id?: string;
};

type ImageType = { id: number; file: File; url: string };

export default function DetailsPostPage({ user_id }: Props) {
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
    maxImagens: 3,
  };

  const router = useRouter();
  const post_id = router.query.id as string;

  const [post_imagens, setImagens] = useState<ImageType[]>([]);
  const [imgPrincial, setImgPrincipal] = useState<string>();
  const [imagemIndex, setImagemIndex] = useState<number>(0);
  const [alert, setAlert] = useState(<></>);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [item, setItem] = useState(_item);
  const [previewImagens, setPreviewImagens] = useState<ImageType[]>([]);
  const [isPostUserId, IsPostUserId] = useState(false);
  const [imgProfileUrl, setImageProfile] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const titleRef = useRef<HTMLElement | null>(null);
  const valorRef = useRef<HTMLElement | null>(null);
  const descricaoRef = useRef<HTMLParagraphElement | null>(null);

  const getPost = useCallback(
    async (id: string) => {
      const data = await postController.getPostId(id);

      if (data.length < 1 || data.message) {
        router.replace("/");
        return { message: "Post not found", status: 404 };
      }

      const result = data;
      console.log(data);

      setItem(result);
      setImagens(result.imagens);
      setImgPrincipal(result.imagens[0]?.url ?? null);
      setImageProfile(result.img_profile ?? null);
      IsPostUserId(result.user_id == user_id);
    },
    [user_id, router]
  );

  useEffect(() => {
    if (!post_id) return;

    async function fetchData() {
      await getPost(post_id);
    }

    fetchData();
  }, [post_id, getPost]);

  return (
    <>
      <Header />
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center text-black ">
        <section
          id="frame-1"
          className="flex flex-auto flex-col gap-2 w-full max-w-[40rem] p-4 bg-gray-100 rounded-2xl shadow-sm shadow-gray-400 my-2 "
        >
          <FullImageView
            images={post_imagens}
            index={imagemIndex}
            visible={visible}
            onClose={closeFullImages}
          />
          <div id="frame-2" className="bg-gray-300 rounded-2xl flex-auto p-2">
            <MiniGalleryImage
              post_imagens={post_imagens}
              imgPrincipal={imgPrincial as string}
              onClick={() => setVisible(true)}
              selectImg={(i) => {
                setImgPrincipal(post_imagens[i].url);
                setImagemIndex(i);
              }}
            />

            <section id="dados-postagem">
              <div
                id="actions"
                className="flex justify-between items-center py-4"
              >
                <div className="flex items-center gap-2">
                  {imgProfileUrl ? (
                    <CircleAvatar
                      imagem={utils.getUrlImage(imgProfileUrl)}
                      size={3}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-2xl rounded-full p-2 w-6  bg-gray-400 flex items-center justify-center cursor-pointer text-gray-300 hover:bg-gray-600 transition duration-200 "
                    />
                  )}
                  <span className="text-[1em]">
                    {utils.string.capitalizar(item.name ?? "")}
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
                  <button
                    className="rounded-3xl bg-cyan-800 w-10 h-10 flex items-center justify-center p-2 text-white self-end hover:bg-cyan-500 transition duration-200"
                    onClick={() =>
                      navigator.clipboard.writeText(window.location.href)
                    }
                  >
                    <FontAwesomeIcon icon={faShare} />
                  </button>
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

                <section id="postuseractions">
                  {isPostUserId && (
                    <div>
                      <h2 className="text-2xl text-center p-2">
                        Adicionar ou remover imagens
                      </h2>
                      <h3>Imagens Atuais</h3>
                      <div className="flex gap-2 overflow-x-scroll h-[15rem] p-2 bg-gray-400 rounded-md">
                        {post_imagens.map((img, i) => {
                          return (
                            <ImageCardPreview
                              key={"img-" + i}
                              image={img}
                              onClick={() => {
                                deletarImagem(img);
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {isPostUserId && previewImagens.length > 0 && (
                    <div>
                      <h3>Novas Imagens</h3>
                      <div
                        id="preview-imagens"
                        className="flex gap-3 flex-wrap justify-center bg-gray-400 py-4"
                      >
                        {previewImagens.map((img, index) => (
                          <ImageCardPreview
                            key={img.id}
                            image={img}
                            onClick={() => {
                              setPreviewImagens((p) => {
                                const imgs = previewImagens.find(
                                  (im) => im.id === img.id
                                );
                                if (imgs) URL.revokeObjectURL(imgs.url);
                                return p.filter((_, i) => i !== index);
                              });
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between  p-2">
                    {isPostUserId && post_imagens.length < _item.maxImagens && (
                      <label className="bg-cyan-700 hover:bg-cyan-400 focus:outline-cyan-400 focus:outline-4 cursor-pointer block w-fit p-2 rounded  text-white">
                        <FontAwesomeIcon className="text-3xl" icon={faImage} />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          max={3}
                          onChange={(e) => selecionarImagens(e)}
                        />
                      </label>
                    )}

                    {isPostUserId &&
                      post_imagens.length < _item.maxImagens &&
                      previewImagens.length > 0 && (
                        <button
                          className="btn bg-green-700 text-white font-bold hover:bg-green-800"
                          onClick={async () => {
                            if (
                              post_imagens.length + previewImagens.length >
                              _item.maxImagens
                            ) {
                              setAlert(
                                <Alert
                                  msg={"Limite de 3 imagens por postagem"}
                                  onClose={() => setAlert(<></>)}
                                />
                              );
                              return;
                            }

                            if (
                              previewImagens.length < 1 ||
                              previewImagens.length > 3
                            ) {
                              setAlert(
                                <Alert
                                  msg={
                                    "Selecione Pelo menos 1 imagem e no maximo 3"
                                  }
                                  onClose={() => setAlert(<></>)}
                                />
                              );
                              return;
                            }

                            const imagesFirebase =
                              await imagemFirebase.uploadImageFirebase(
                                previewImagens
                              );

                            if (item.user_id !== user_id) return;

                            if (imagesFirebase.length < 1) return;

                            const imgs = imagesFirebase.map(
                              (img: { url: string }) => {
                                return {
                                  url: img.url,
                                  post_id: item.id,
                                  user_id: user_id,
                                };
                              }
                            );

                            await fetch("/api/v1/uploadImages", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify(imgs),
                            });

                            setPreviewImagens([]);
                            router.replace(router.asPath);
                          }}
                        >
                          salvar
                        </button>
                      )}
                  </div>
                </section>
              </div>
              {alert}
            </section>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );

  async function deletarImagem(img: ImageType) {
    await imagemFirebase.deleteImageFromUrl(img.url);
    await fetch(`/api/v1/imagens`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(img),
    });

    setImagens((p) => p.filter((imgs) => imgs.id !== img.id));
  }

  function moveCursorToEnd(el: HTMLElement) {
    const range = document.createRange();
    const sel = window.getSelection();

    range.selectNodeContents(el);
    range.collapse(false); // false = coloca no fim do conteúdo

    sel!.removeAllRanges();
    sel!.addRange(range);
  }

  async function postUpdate() {
    const updated = await postController.update(item);

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

  async function selecionarImagens(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files || [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Verifica se o arquivo é uma imagem
        if (file.type.startsWith("image/")) {
          // setLoading(true);

          const resized = (await utils.imagem.resizeImageFile(file)) as File;
          // Cria uma URL temporária para o arquivo
          const imgURL = URL.createObjectURL(resized);
          // const id = getUniqueId();
          setPreviewImagens((p) => [
            ...p,
            { url: imgURL, id: i, file: resized },
          ]);
        }
      }
    }
  }

  function closeFullImages(i: number) {
    setImagemIndex(() => {
      setImgPrincipal(post_imagens[i]?.url);
      setVisible(false);
      return i;
    });
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
