import Header from "@/components/Header";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faShare } from "@fortawesome/free-solid-svg-icons";
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
  MiniGalleryImage,
  ImageCardPreview,
  CapitalizeText,
  Modal,
  ImageCropper,
} from "@/components";
import OwnerGuard from "@/components/guards/OwnerGuard";
import { ImageDBType, ImageStatus } from "@/shared/Image_types";
import { v4 as uuidv4 } from "uuid";
import Head from "next/head";
import { PostStatus } from "@/shared/post_status";
import Post from "@/models/post";
import VerticalDivider from "@/components/VerticalDivider";

type Props = {
  user_id?: string;
  post_id: string;
};

export default function DetailsPostPage({ user_id, post_id }: Props) {
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
    status: PostStatus.ACTIVE,
  };

  const router = useRouter();

  const [post_imagens, setImagens] = useState<ImageDBType[]>([]);
  const [imagenSAtivas, setImagensAtivas] = useState<ImageDBType[]>([]);
  const [imgPrincial, setImgPrincipal] = useState<string>();
  const [postError, setError] = useState<Record<string, string>>({});

  const [item, setItem] = useState(_item);
  const [isPostUserId, IsPostUserId] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [previewImagens, setPreviewImagens] = useState<ImageDBType[]>([]);
  const [imgProfileUrl, setImageProfile] = useState<string | null>(null);

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const valorRef = useRef<HTMLParagraphElement | null>(null);
  const descricaoRef = useRef<HTMLParagraphElement | null>(null);
  const usebackdrop = useBackdrop();

  const getPost = useCallback(
    async (id: string) => {
      const result = await httpPost.getPostId(id);

      if (result.length < 1 || result.message) {
        router.replace("/");
        return { message: "Post not found", status: 404 };
      }

      setItem(result);
      setImagens(result.imagens);
      setImageProfile(result.img_profile ?? null);
      IsPostUserId(result.user_id == user_id);

      let tempImgAtivas = result.imagens.filter(
        (img: ImageDBType) => img.status === ImageStatus.ACTIVE,
      );

      setImagensAtivas(tempImgAtivas);

      if (tempImgAtivas.length > 0) {
        setImgPrincipal(tempImgAtivas[0]?.url ?? null);
      }
    },
    [user_id, router],
  );

  useEffect(() => {
    if (!post_id) return;
    getPost(post_id);
  }, [post_id, getPost]);

  return item.status !== PostStatus.ACTIVE ? (
    <></>
  ) : (
    <>
      <Head>
        <title>{item.title}</title>
        <meta property="og:image" content={imgPrincial} />
        <meta
          property="og:description"
          content={`Por apenas R$ ${item.description}`}
        />
      </Head>
      <Header />
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex gap-2 items-center text-black ">
        {!item.id ? (
          <WirePost />
        ) : (
          <article className="flex flex-col gap-2 w-full max-w-7xl p-4 bg-gray-100 rounded-2xl shadow-sm my-2 h-full">
            <PostHeader />
            <VerticalDivider height={1} />

            <div>
              <section className=" rounded-2xl flex-auto p-2 gap-4 flex flex-col md:flex-row">
                <MiniGalleryImage post_imagens={imagenSAtivas} />

                <div className="flex flex-col w-full gap-4">
                  <ItemTitle />
                  <ItemValor />
                  <ItemDescription />
                  <ButtonEditar />
                  <VerticalDivider height={1} />
                  <ButtonsActions />
                </div>
              </section>
            </div>
          </article>
        )}

        <OwnerGuard isOwner={isPostUserId}>
          <section
            id="postuseractions"
            className="bg-white rounded-2xl shadow-sm border w-full border-slate-100 p-4 md:p-6 max-w-7xl"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Adicionar ou remover imagens
              </h2>
              <p className="text-xs text-slate-400 mb-2">
                Gerencie o catálogo de fotos deste anúncio
              </p>

              <div className="bg-gray-100 rounded justify-center gap-y-2 py-2 flex w-full flex-wrap ">
                {post_imagens[0] !== null &&
                  post_imagens.map((img, i) => {
                    const newImgUrl = utils.getUrlImageR2(img.url);
                    const isActive = img.status === ImageStatus.ACTIVE;
                    return (
                      <ImageCardPreview
                        key={"img-" + i}
                        image={{ ...img, url: newImgUrl }}
                        active={isActive}
                        alertMsg={isActive ? "" : "Pendente!"}
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
                              <span>Deseja remover esta imagem</span>
                            </Modal>,
                          );
                        }}
                      />
                    );
                  })}

                {previewImagens.map((img, index) => {
                  img.id = uuidv4();
                  return (
                    <ImageCardPreview
                      key={img.id}
                      image={img}
                      active={false}
                      alertMsg="Salvar"
                      onClick={() => {
                        setPreviewImagens((p) => {
                          const imgToRemove = p.find(
                            (im) => im.url === img.url,
                          );
                          if (imgToRemove) URL.revokeObjectURL(imgToRemove.url);
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
                                  im.id === img.id ? { ...im, ...newImg } : im,
                                ),
                              );
                            }}
                          />,
                        );
                      }}
                    />
                  );
                })}

                <OwnerGuard
                  isOwner={post_imagens.length + previewImagens.length < 3}
                >
                  <label className="bg-cyan-50 border-dashed border-2 border-cyan-600 w-1/3 flex cursor-pointer rounded text-cyan-600 justify-center items-center shrink-0 md:max-w-1/4 lg:max-w-1/6 min-h-[120]">
                    <FontAwesomeIcon className="text-3xl " icon={faPlus} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      max={3}
                      onChange={(e) => selecionarImagens(e)}
                    />
                  </label>
                </OwnerGuard>
              </div>
            </div>

            <div className="flex flex-row-reverse py-4">
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
        <div className="w-full mt-auto">
          <Footer />
        </div>
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
        />,
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
        <Alert msg={msgError} onClose={() => usebackdrop.closeContent()} />,
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
    if (Number(item.valor) <= 0) throw "valor nao pode ser zerado!";
    if (item.title.length < 3) throw "Titulo nao pode ficar em branco!";
    if (item.description.length < 3) throw "Insira uma descrição!";

    try {
      usebackdrop.openContent(
        <Alert
          msg="Salvando......."
          onClose={async () => usebackdrop.closeContent()}
        />,
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updated = await httpPost.update({
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        description: item.description,
        valor: parseFloat(item.valor),
      });

      if (updated?.id) {
        usebackdrop.openContent(
          <Alert
            msg={"Update Realizado com sucesso!"}
            onClose={() => usebackdrop.closeContent()}
          />,
        );
        setButtonDisabled(true);
        setItem((p) => ({ ...p, ...item }));
      }
    } catch (error) {
      console.log(error);
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
            { url: imgURL, id: uuidv4(), file: resized },
          ]);
        }
      }
    }
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
      <div
        className={
          (postError.title == "" || postError.title == undefined
            ? ""
            : " border-b-3 border-red-800 ") +
          "flex flex-col font-sans  items-center w-full mt-1"
        }
      >
        <div className="flex w-full px-4 gap-1 items-center ">
          <span className="text-xs text-slate-500 block">Titulo</span>
          <span className="w-full font-medium text-red-800 ">
            {postError.title ?? ""}
          </span>
        </div>
        <h1
          ref={titleRef}
          className="focus:outline-none font-black text-xl border-b-red-700/0 border-b-2 w-full text-gray-700 focus:border-gray-400 px-4"
          {...(isPostUserId && {
            contentEditable: true,
            suppressContentEditableWarning: true,

            onInput: () => {},
            onBlur: (e) => {
              const value = e.currentTarget.innerText;

              // titleRef.current?.focus();
              setButtonDisabled(false);
              if (value.replace("\n", "") == "") {
                setError({ ...postError, title: "Insira um Título!" });
                setButtonDisabled(true);
              } else {
                setError({ ...postError, title: "" });
              }
              setItem((p) => ({ ...p, title: value }));

              valorRef.current?.focus();
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
      <div
        className={
          (postError.valor == "" || postError.valor == undefined
            ? " "
            : "border-red-800! border-3! ") +
          " text-emerald-700 flex gap-2 border bg-emerald-50 border-emerald-100 w-full rounded-xl p-3"
        }
      >
        <div className="w-full">
          <span className="text-red-800 font-medium">
            {postError.valor ?? ""}
          </span>
          <p className="text-xs font-medium py-1">Preço (R$)</p>
          <p
            className=" font-black border-b-2 border-emerald-50 focus:border-emerald-400  w-full  focus:outline-none  text-xl "
            ref={valorRef}
            {...(isPostUserId && {
              contentEditable: true,
              suppressContentEditableWarning: true,
              onInput: (v) => onInputValor(v),
              onBlur: (v) => onBlurValor(v),
            })}
          >
            R$ {utils.formatarMoeda(item.valor.toString())}
          </p>
        </div>
      </div>
    );
  }

  function onBlurValor(v: any) {
    const e = utils.extractNumberInString(v.currentTarget.innerText);
    let nn = utils.stringForDecimalNumber(e).toFixed(2) ?? 0;

    if (parseFloat(nn) <= 0) {
      setError({
        ...postError,
        valor: "O preço nao pode ser menor ou igual a Zero!",
      });
      setButtonDisabled(true);
    } else {
      setError({
        ...postError,
        valor: "",
      });

      setButtonDisabled(false);
    }
    setItem((p) => ({ ...p, valor: nn }));
  }

  function onInputValor(v: any) {
    const e = utils.extractNumberInString(v.currentTarget.innerText);

    const valor = (v.currentTarget.innerHTML = utils
      .stringForDecimalNumber(e)
      .toFixed(2)
      .replace(".", ","));

    moveCursorToEnd(v.currentTarget);
  }

  function ButtonsActions() {
    return (
      <div className="flex items-end h-full justify-end  gap-2 ">
        <a
          target="_blank"
          className=" btn text-white text-center hover:bg-emerald-800 bg-emerald-600 w-full transition duration-300"
          href={`https://wa.me/55${item.phone}?text=ola gostariad e falar com voce`}
        >
          Entrar em contato WhatsApp <FontAwesomeIcon icon={faWhatsapp} />
        </a>
        <button
          className="text-slate-400 transition duration-300 bg-gray-200 btn w-10 hover:text-teal-700 hover:bg-gray-300"
          onClick={copiarLink}
        >
          <FontAwesomeIcon icon={faShare} />
        </button>
      </div>
    );
  }

  function ButtonEditar() {
    return (
      <OwnerGuard isOwner={isPostUserId}>
        <div className={"  border-slate-300  flex justify-end py-4 mt-4"}>
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
    );
  }

  function ItemDescription() {
    return (
      <div className="mt-2 font-sans ">
        <div className="flex items-center ">
          {postError.descricao ? (
            <h2 className=" text-red-800 px-4 text-xs">
              {postError.descricao}
            </h2>
          ) : (
            <h2 className="text-gray-500 text-xs px-4">Sobre esse item</h2>
          )}
        </div>

        <p
          className={
            (postError.descricao == "" || postError.descricao == undefined
              ? ""
              : "outline-0  border-red-800 ") +
            "focus:outline-2 block relative p-2  focus:outline-gray-400 text-slate-600 bg-gray-200 px-4 rounded-xl min-h-[120] "
          }
          ref={descricaoRef}
          {...(isPostUserId && {
            contentEditable: true,
            suppressContentEditableWarning: true,

            onBlur: (e) => {
              const value = e.currentTarget.innerText.replace("\n", "");

              if (value == "") {
                setError({
                  ...postError,
                  descricao: "INSIRA UMA DESCRIÇÃO!",
                });
                setButtonDisabled(true);
              } else {
                setError({ ...postError, descricao: "" });
                setButtonDisabled(false);
              }

              setItem((p) => ({ ...p, description: value }));
            },
          })}
        >
          {item.description}
        </p>
      </div>
    );
  }
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const result = utils.redirectNotToken(ctx, "/");
  const postId = ctx.query.id as string;
  const [, id] = utils.parsePostUrl(postId);

  const post = await Post.getById(id);

  if (post === null || post!.status !== PostStatus.ACTIVE) {
    ctx.res.statusCode = 404;
    return { notFound: true };
  }

  if ("redirect" in result) return { props: { user_id: null, post_id: id } };

  const { ctx: user_id } = result.props;

  return {
    props: { user_id, post_id: id }, // enviado como props para a página
  };
}
