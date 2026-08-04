import Card from "@/components/Card";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Header from "@/components/Header";
import autenticator from "@/models/autenticator";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ChangeEvent, useEffect, useState } from "react";
import Alert from "@/components/ui/Alert";

import { useRouter } from "next/navigation";

import utils from "@/utils";
import controllerCloudflare from "@/storage/cloudflare/controllerCloudflare";
import LinearProgressIndicator from "@/components/LinearProgressIndicator";
import httpCategoria from "@/http/categoria";
import Image from "next/image";

import ImageCropper from "@/components/ImageCropper";

import { useBackdrop } from "@/ui/backdrop/useBackdrop";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Buttons";
import httpPost from "@/http/post";
import { PostDBType } from "@/shared/post_types";
import { ImageDBType } from "@/shared/Image_types";
import { CategoriaDBType } from "@/shared/categoria_types";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ImageCardPreview, MiniGalleryImage } from "@/components";
import OwnerGuard from "@/components/guards/OwnerGuard";

const post: PostDBType = {
  title: "",
  description: "",
  user_id: "",
  valor: 0,
  categoria_id: 0,
  created_at: Date.now(),
};

let uniqueId = 0;

function getUniqueId() {
  return uniqueId++;
}
export default function Produto() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [valor, setValor] = useState("");

  const [imagens, setImagens] = useState<ImageDBType[]>([]);
  const [selected, setSelected] = useState("0");
  const [loading, setLoading] = useState<boolean>(false);

  const [categoriasValues, setCategoriasValues] = useState<
    { value: string; label: string }[]
  >([]);

  const [postError, setError] = useState<Record<string, string>>({});

  const usebackdrop = useBackdrop();

  useEffect(() => {
    if (categoriasValues.length < 2) getCategorias();
  }, [categoriasValues.length]);

  useEffect(() => {
    //return funciona como "dispose" do Flutter
    return () => {
      imagens.forEach((img) => {
        URL.revokeObjectURL(img.url);
      });
    };
  }, []);

  const style = {
    input:
      "p-3 bg-gray-300 text-gray-900 outline-2 outline-gray-400  focus:outline-cyan-500 focus:outline-4 rounded-md",
  };

  return (
    <>
      <Header />
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center p-2 ">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-gray-50 rounded p-2 md:max-w-7xl m-4 w-full  "
        >
          <h1 className="text-gray-800 font-bold">Nova Publicação</h1>
          <span className="text-red-800 font-bold h-3">
            {Object.values(postError).some((msg) => msg != "")
              ? "Todos os Campos são obrigatorio"
              : ""}
          </span>
          <input
            type="text"
            value={title}
            placeholder="Título: (clique para inserir)"
            className={`font-sans font-black outline-0 border-b-2 border-b-red-800/0 px-4
               text-black 
               focus:border-b-2  focus:border-b-red-800 ${
                 postError.title ? "outline-2 outline-red-600" : ""
               }  `}
            onChange={(e) => {
              post.title = e.target.value;

              setTitle(post.title);
            }}
          />
          <div
            className="outline-0 text-emerald-700
                flex flex-col border font-black bg-emerald-50 border-emerald-100 w-full rounded-xl p-4"
          >
            <p className="text-xs font-medium py-1">Preço (R$)</p>
            <input
              name="valor"
              type="text"
              placeholder="R$: 0,00 adicione um valor"
              value={valor}
              className={`
                outline-0 
              focus:border-b-emerald-400 focus:border-b-2 w-full
              ${postError.valor ? "outline-2 outline-red-600" : ""}`}
              onChange={(e) => {
                formatarMoeda(e);
                console.log(e.target.value);
              }}
            />
          </div>
          <div className="w-full ">
            <span className="block text-gray-500 text-xs px-4 w-full">
              SOBRE ESTE ITEM
            </span>
            <textarea
              placeholder="Insira uma descrição sobre esse item"
              value={description}
              className={`bg-gray-300 text-slate-800 rounded-md min-h-36 w-full border-0 placeholder-slate-600 p-4 outline-gray-400 ${
                postError.description ? "outline-2  outline-red-600" : ""
              } `}
              onChange={(e) => {
                post.description = e.target.value;
                setDescription(post.description);
              }}
            />
          </div>
          <div className="flex gap-2">
            <select
              name=""
              id=""
              className={`${style.input} flex-1
              ${selected === "0" ? "text-gray-400!" : "text-gray-800!"} 
             ${postError.categoria_id ? "outline-2 outline-red-600" : ""}
              `}
              value={selected}
              onChange={(e) => changeCategoria(e.target.value)}
            >
              <option key={0} value={"0"} className="text-gray-400">
                Selecione a categoria
              </option>
              {categoriasValues.map((e) => {
                return (
                  <option
                    key={e.value}
                    value={e.value}
                    disabled={e.value === ""}
                    className={`${
                      e.value === "0" ? "text-gray-400!" : "text-gray-800!"
                    } `}
                  >
                    {e.label}
                  </option>
                );
              })}
            </select>
          </div>
          {loading && <LinearProgressIndicator />}
          <div
            id="preview"
            className="flex w-full bg-gray-200 p-2 rounded  h-46 justify-center"
          >
            {imagens.map((img) => {
              return (
                <ImageCardPreview
                  key={img.id}
                  image={img}
                  alertMsg="Preview"
                  onClick={() => removeImagePreview(img)}
                  onImageClick={() => {
                    let image = img;
                    usebackdrop.openContent(
                      <ImageCropper
                        image={image.url}
                        onConfirm={(file) => {
                          const url = URL.createObjectURL(file);
                          const newImg = { ...image, file, url };

                          setImagens((imgs) =>
                            imgs.map((img) =>
                              img.id === image.id ? newImg : img,
                            ),
                          );
                        }}
                      />,
                    );
                  }}
                />
              );
            })}
            <OwnerGuard isOwner={imagens.length < 3}>
              <label className="bg-cyan-50 border-dashed border-2 lg:max-w-1/6 md:max-w-1/4 border-cyan-600 w-1/3 flex cursor-pointer rounded text-cyan-600 justify-center items-center shrink-0  min-h-[120]">
                <FontAwesomeIcon className="text-3xl" icon={faPlus} />

                <input
                  accept="image/*"
                  type="file"
                  className="hidden"
                  multiple
                  disabled={imagens.length >= 3}
                  onChange={(e) => selecionarImagens(e)}
                />
              </label>
            </OwnerGuard>
          </div>
          <div id="actions" className="flex gap-2 items-center">
            <ButtonSecondary onClick={() => router.back()} label="Cancelar" />
            <ButtonPrimary label={"Salvar"} onClick={() => {}} />
          </div>
        </form>
      </main>
    </>
  );

  async function getCategorias() {
    const categorias = await httpCategoria.getAll();

    setCategoriasValues(
      categorias.map((e: CategoriaDBType) => {
        return { value: e.id, label: e.descricao };
      }),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    salvar();
  }

  function formatarMoeda(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    const apenasNumeros = extractNumberInString(input);

    if (apenasNumeros === "00") {
      setValor("");
      post.valor = 0;
      return;
    }

    const numero = stringForDecimalNumber(apenasNumeros);
    const formatado = formatNumberForMoedaString(numero);

    setValor(formatado);
    post.valor = numero;
  }

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

  async function getIdUserAuthenticated() {
    return (await autenticator.isAuthenticated()).result.id;
  }

  async function salvar() {
    const msgError =
      imagens.length < 1
        ? "Escolha Pelo menos uma imagem"
        : imagens.length > 3
          ? "Escolha no máximo 3 imagens"
          : "";

    if (msgError != "") {
      usebackdrop.openContent(
        <Alert
          msg={msgError}
          show={true}
          onClose={() => usebackdrop.closeContent()}
        />,
      );
      return;
    }

    post.created_at = Date.now();
    post.user_id = await getIdUserAuthenticated();

    const err: Record<string, string> = {};

    if (post.description == "") err["description"] = "campo obrigatorio";
    if (post.title == "") err["title"] = "Campo obrigatorio";
    if (post.valor <= 0) err["valor"] = "Campo obrigatorio";

    if (post.categoria_id == 0 || Number.isNaN(post.categoria_id)) {
      err["categoria_id"] = "Campo obrigatorio";
    }

    for (const error in err) {
      console.log(error);
      setError(err);
      return;
    }

    const posted = await httpPost.savePost(post);
    const jsonresult = await posted.json();

    if (jsonresult.message == "erro ao inserir post") {
      throw jsonresult;
    }

    try {
      const nimgs = imagens.map((im) => im.file);
      const uploaded = await controllerCloudflare.save(nimgs);

      const imgs = uploaded.files!.map((img: { url: string }) => {
        return {
          url: img,
          post_id: jsonresult[0].id,
          user_id: post.user_id,
        };
      });

      await fetch("/api/v1/uploadImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(imgs),
      });
    } catch (error) {
      console.log(error);
    }

    post.categoria_id = 0;
    post.description = "";
    post.title = "";
    post.valor = 0;
    post.created_at = 0;
    post.user_id = "";

    setValor("");
    // setCategoria("");
    setTitle("");
    setDescription("");
    setImagens([]);

    usebackdrop.openContent(
      <Alert
        msg={"Post Inserido com Sucesso!!"}
        show={true}
        onClose={() => {
          usebackdrop.closeContent();
          setTimeout(() => {
            router.back();
          }, 1000);
        }}
      />,
    );
  }

  async function selecionarImagens(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files || [];
    const maxImage = 3;
    let totalImage = maxImage - imagens.length;

    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (totalImage <= 0) break;
        const file = files[i];

        // Verifica se o arquivo é uma imagem
        if (file.type.startsWith("image/")) {
          setLoading(true);

          // Cria uma URL temporária para o arquivo
          const resized = (await utils.imagem.resizeImageFile(file)) as File;
          const imgURL = URL.createObjectURL(resized);
          const id = getUniqueId().toString();

          setImagens((e) => [...e, { id: id, file: resized, url: imgURL }]);

          setLoading(false);

          totalImage -= 1;
        }
      }
    }
  }

  function changeCategoria(e: string) {
    setSelected(e);
    post.categoria_id = parseInt(e);
  }

  function removeImagePreview(image: ImageDBType) {
    setImagens((prev) => {
      const img = prev.find((img) => img.id === image.id);
      if (img) URL.revokeObjectURL(img.url);

      return prev.filter((img) => img.id !== image.id);
    });
  }
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
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
