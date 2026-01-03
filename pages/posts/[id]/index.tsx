import Header from "@/components/Header";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faImage } from "@fortawesome/free-regular-svg-icons";
import { faPlus, faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import { GetServerSidePropsContext } from "next";
import Footer from "@/layout/FooterLayout";

import Image from "next/image";

import utils from "@/utils";
import controllerCloudflare from "@/storage/cloudflare/controllerCloudflare";
import httpPost from "@/http/post";
import httpImage from "@/http/image";
import { useBackdrop } from "@/ui/backdrop/useBackdrop";
import WirePost from "@/wireframes/wirePost";

import {
  Alert,
  CircleAvatar,
  FullImageView,
  MiniGalleryImage,
  ImageCardPreview,
  CapitalizeText,
  LinearProgressIndicator,
  Modal,
  ImageCropper,
  IconButton,
} from "@/components";
import OwnerGuard from "@/components/guards/OwnerGuard";
import { ImageDBType } from "@/shared/Image_types";

type Props = {
  user_id?: string;
};

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

  const [post_imagens, setImagens] = useState<ImageDBType[]>([]);
  const [imgPrincial, setImgPrincipal] = useState<string>();
  const [imagemIndex, setImagemIndex] = useState<number>(0);

  const [item, setItem] = useState(_item);

  const [isPostUserId, IsPostUserId] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [previewImagens, setPreviewImagens] = useState<ImageDBType[]>([]);
  const [imgProfileUrl, setImageProfile] = useState<string | null>(null);

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const valorRef = useRef<HTMLElement | null>(null);
  const descricaoRef = useRef<HTMLParagraphElement | null>(null);
  const usebackdrop = useBackdrop();

  const [dataItem, setDataItem] = useState({});

  const getPost = useCallback(
    async (id: string) => {
      const data = await httpPost.getPostId(id);

      if (data.length < 1 || data.message) {
        router.replace("/");
        return { message: "Post not found", status: 404 };
      }

      const result = data;

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
      getPost(post_id);
    }

    fetchData();
  }, [post_id, getPost]);

  return (
    <>
      <Header />
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center text-black ">
        {!item.id ? (
          <WirePost />
        ) : (
          <article className="flex flex-auto flex-col gap-2 w-full max-w-[40rem] p-4 bg-gray-100 rounded-2xl shadow-sm shadow-gray-400 my-2 h-full">
            <PostHeader />

            <div>
              <section className="bg-gray-200 rounded-2xl flex-auto p-2">
                <MiniGalleryImage
                  post_imagens={post_imagens}
                  imgPrincipal={imgPrincial as string}
                  onClick={() =>
                    usebackdrop.openContent(
                      <FullImageView
                        images={post_imagens}
                        index={imagemIndex}
                        visible={true}
                        onClose={closeFullImages}
                      />
                    )
                  }
                  selectImg={(i) => {
                    setImgPrincipal(post_imagens[i].url);
                    setImagemIndex(i);
                  }}
                />
                <ItemTitle />
                <div className=" flex justify-between items-baseline ">
                  <ItemValor />
                  <ButtonsActions />
                </div>
                <ItemDescription />
              </section>

              <OwnerGuard isOwner={isPostUserId}>
                <section
                  id="postuseractions"
                  className="outline-0 outline-gray-400 rounded-2xl bg-gray-200 mt-4"
                >
                  <div>
                    <h2 className="text-2xl text-center p-2 font-bold">
                      Adicionar ou remover imagens
                    </h2>
                    <div className="bg-gray-500 rounded py-2">
                      <h3 className="p-2 text-white text-center text-xl">
                        Imagens Atuais
                      </h3>
                      <div className="flex gap-2 overflow-x-scroll h-[15rem] p-2 bg-gray-400 ">
                        {post_imagens[0] !== null &&
                          post_imagens.map((img, i) => {
                            const newImg = utils.getUrlImageR2(img.url);
                            return (
                              <ImageCardPreview
                                key={"img-" + i}
                                image={{ ...img, url: newImg }}
                                onClick={() => {
                                  usebackdrop.openContent(
                                    <Modal
                                      onConfirm={() => deletarImagem(img)}
                                      onClose={() => usebackdrop.closeContent()}
                                    >
                                      <div className="relative flex ">
                                        <Image
                                          className="object-contain h-auto w-auto"
                                          alt=""
                                          src={utils.getUrlImageR2(img.url)}
                                          width={60}
                                          height={60}
                                          loading="eager"
                                        />
                                      </div>
                                      Deseja remover esta imagem
                                    </Modal>
                                  );
                                }}
                              />
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  {loadingImages && (
                    <div className="m-3">
                      <LinearProgressIndicator />
                    </div>
                  )}
                  {previewImagens.length > 0 && (
                    <div className="bg-gray-500 mt-2 rounded overflow-hidden">
                      <h3 className="text-white text-xl text-center p-2">
                        Novas Imagens
                      </h3>
                      <div
                        id="preview-imagens"
                        className="flex gap-3  overflow-x-scroll h-[15rem]  bg-gray-400 py-4"
                      >
                        {previewImagens.map((img, index) => {
                          console.log(img);
                          img.id = crypto.randomUUID();
                          return (
                            <ImageCardPreview
                              key={img.id}
                              image={img}
                              onClick={() => {
                                setPreviewImagens((p) => {
                                  const imgToRemove = p.find(
                                    (im) => im.url === img.url
                                  );
                                  if (imgToRemove)
                                    URL.revokeObjectURL(imgToRemove.url);
                                  return p.filter((_, i) => i !== index);
                                });
                              }}
                              onImageClick={() => {
                                usebackdrop.openContent(
                                  <ImageCropper
                                    image={img.url}
                                    onConfirm={(newim) => {
                                      const url = URL.createObjectURL(newim);
                                      const newImg = {
                                        id: img.id,
                                        file: newim,
                                        url: url,
                                      };
                                      setPreviewImagens((imgs) =>
                                        imgs.map((im) =>
                                          im.id === img.id
                                            ? { ...im, ...newImg }
                                            : im
                                        )
                                      );
                                    }}
                                  />
                                );
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between  p-2">
                    {post_imagens.length < _item.maxImagens && (
                      <label className="bg-cyan-800 hover:bg-cyan-600  cursor-pointer block w-fit p-2 pr-3 pt-3 rounded  text-white relative">
                        <FontAwesomeIcon
                          icon={faPlus}
                          className=" absolute rounded-full top-1 right-1 text-md"
                        />
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

                    {previewImagens.length > 0 && (
                      <button
                        className="btn bg-green-700 text-white font-bold hover:bg-green-800"
                        onClick={uploadImages}
                      >
                        salvar
                      </button>
                    )}
                  </div>
                </section>
              </OwnerGuard>
            </div>
          </article>
        )}
        <Footer />
      </main>
    </>
  );

  function imageUrl(url: string | null) {
    return utils.getUrlImageR2(url);
  }

  async function copiarLink() {
    if (navigator.clipboard) {
      await navigator.clipboard?.writeText(window.location.href);
      usebackdrop.openContent(
        <Alert
          msg={"Link Copiado"}
          onClose={() => usebackdrop.closeContent()}
        />
      );
    }
  }

  async function uploadImages() {
    if (item.user_id !== user_id) return;

    let msgError = "";
    if (
      post_imagens[0] != null &&
      post_imagens.length + previewImagens.length > _item.maxImagens
    )
      msgError = "Limite de 3 imagens por postagem";

    if (previewImagens.length < 1 || previewImagens.length > 3)
      msgError = "Selecione Pelo menos 1 imagem e no maximo 3";

    if (msgError !== "") {
      return usebackdrop.openContent(
        <Alert msg={msgError} onClose={() => usebackdrop.closeContent()} />
      );
    }

    const newImgs = previewImagens.map((im) => im.file);

    const images = await controllerCloudflare.save(newImgs);

    if (images.files.length < 1) return;

    const imgs = images.files.map((img: { url: string }) => {
      return {
        url: img,
        post_id: item.id,
        user_id: user_id,
      };
    });

    await httpImage.uploadImages(imgs);

    setPreviewImagens([]);
    router.replace(router.asPath);
  }

  async function deletarImagem(img: ImageDBType) {
    await httpPost.delImage(img);

    setImagens((p) => p.filter((imgs) => imgs.id !== img.id));
    usebackdrop.closeContent();
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
    try {
      const updated = await httpPost.update({
        id: item.id,
        user_id: item.user_id,
        ...dataItem,
      });
      console.log(dataItem);
      if (updated.id) {
        usebackdrop.openContent(
          <Alert
            msg={"Update Realizado com sucesso!"}
            onClose={() => usebackdrop.closeContent()}
          />
        );
        setButtonDisabled(true);
        setItem((p) => ({ ...p, ...dataItem }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function selecionarImagens(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files || [];

    if (files) {
      setLoadingImages(true);
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
            { url: imgURL, id: crypto.randomUUID(), file: resized },
          ]);

          setLoadingImages(false);
        }
      }
    }
  }

  function closeFullImages(i: number) {
    setImagemIndex(() => {
      setImgPrincipal(post_imagens[i]?.url);
      return i;
    });
    usebackdrop.closeContent();
  }

  function PostHeader() {
    return (
      <header className="flex gap-2  items-center">
        <CircleAvatar imagem={imageUrl(imgProfileUrl)} size={2} />
        <CapitalizeText txt={item.name} />

        <span className="text-xs ml-auto">
          Publicado {utils.formatarData(item.created_at)}
        </span>
      </header>
    );
  }

  function ItemTitle() {
    return (
      <div className="flex  gap-2 items-center  font-bold w-full mt-2">
        <OwnerGuard isOwner={isPostUserId}>
          <IconButton
            icon={faEdit}
            className="text-xl text-green-800 cursor-pointer peer"
            onClick={() => titleRef.current!.focus()}
          />
        </OwnerGuard>
        <h1
          ref={titleRef}
          className="focus:outline-2 text-xl  focus:outline-gray-400 text-gray-800 "
          {...(isPostUserId && {
            contentEditable: true,
            suppressContentEditableWarning: true,
            onInput: () => {},
            onBlur: (e) => {
              const value = e.currentTarget.innerText;
              setDataItem({ ...dataItem, title: value });
              titleRef.current?.focus();
              setButtonDisabled(false);
              setItem((p) => ({ ...p, title: value }));
            },
          })}
        >
          {item.title}
        </h1>
      </div>
    );
  }

  function ItemValor() {
    return (
      <div className="font-bold text-green-700 flex gap-2">
        <OwnerGuard isOwner={isPostUserId}>
          <IconButton
            className="text-xl text-green-800 cursor-pointer"
            onClick={() => valorRef.current!.focus()}
            icon={faEdit}
          />
        </OwnerGuard>

        <p>
          R$:
          <span
            className="p-2 focus:outline-gray-400 focus:outline-2 text-xl "
            ref={valorRef}
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
                    setDataItem((p) => ({ ...p, valor: e }));

                    setButtonDisabled(false);
                    setItem((p) => ({ ...p, valor: e }));
                  },
                }
              : {})}
          >
            {item.valor}
          </span>
        </p>
      </div>
    );
  }

  function ButtonsActions() {
    return (
      <div className="flex items-center justify-end text-2xl ">
        <a
          target="_blank"
          className="text-green-700  btn text-2xl hover:text-green-900 hover:bg-gray-300"
          href={`https://wa.me/55${item.phone}?text=ola gostariad e falar com voce`}
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>
        <button
          className="text-teal-500 btn text-xl hover:text-teal-700 hover:bg-gray-300"
          onClick={copiarLink}
        >
          <FontAwesomeIcon icon={faShareFromSquare} />
        </button>
      </div>
    );
  }

  function ItemDescription() {
    return (
      <div className="">
        <div className="flex items-center gap-2">
          {isPostUserId && (
            <IconButton
              className="text-xl text-green-800 cursor-pointer"
              icon={faEdit}
              onClick={() => descricaoRef.current!.focus()}
            />
          )}
          <h2 className="text-gray-500">Sobre este item</h2>
        </div>
        <p
          ref={descricaoRef}
          className="focus:outline-2 focus:outline-gray-400 text-gray-700"
          {...(isPostUserId
            ? {
                contentEditable: true,
                suppressContentEditableWarning: true,

                onBlur: (e) => {
                  const value = e.currentTarget.innerText;
                  setDataItem({ ...dataItem, description: value });
                  setButtonDisabled(false);
                  setItem((p) => ({ ...p, description: value }));
                },
              }
            : {})}
        >
          {item.description}
        </p>
        <OwnerGuard isOwner={isPostUserId}>
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
        </OwnerGuard>
      </div>
    );
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
