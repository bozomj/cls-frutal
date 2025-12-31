import Card from "@/components/Card";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Header from "@/components/Header";
import autenticator from "@/models/autenticator";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ChangeEvent, useEffect, useState } from "react";
import Alert from "@/components/Alert";

import { useRouter } from "next/navigation";

import { CategoriaType } from "@/models/categoria";
import utils from "@/utils";
import controllerCloudflare from "@/storage/cloudflare/controllerCloudflare";
import LinearProgressIndicator from "@/components/LinearProgressIndicator";
import httpCategoria from "@/http/categoria";
import Image from "next/image";

import ImageCropper from "@/components/ImageCropper";

import { useBackdrop } from "@/ui/backdrop/useBackdrop";
import { ButtonPrimary, ButtonSecondary } from "@/components/Buttons";
import httpPost from "@/http/post";

type postTypeSimple = {
  title: string;
  description: string;
  user_id: string;
  valor: number;
  categoria_id: number;
  created_at: number;
};

const post: postTypeSimple = {
  title: "",
  description: "",
  user_id: "",
  valor: 0,
  categoria_id: 0,
  created_at: Date.now(),
};

type ImageFile = {
  id: number;
  file: File;
  url: string;
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

  const [imagens, setImagens] = useState<ImageFile[]>([]);
  const [selected, setSelected] = useState("0");
  const [loading, setLoading] = useState<boolean>(false);

  const [categoriasValues, setCategoriasValues] = useState<
    { value: string; label: string }[]
  >([]);

  const [postError, setError] = useState<Record<string, string>>({});

  const usebackdrop = useBackdrop();

  useEffect(() => {
    if (categoriasValues.length < 2) getCategorias();

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
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center p-2">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-gray-50 rounded p-4 md:w-[480px] m-4 w-full "
        >
          <span className="text-red-800 font-bold h-3">
            {Object.values(postError).some((msg) => msg != "")
              ? "Todos os Campos são obrigatorio"
              : ""}
          </span>

          <input
            type="text"
            value={title}
            placeholder="Titulo"
            className={`${style.input} ${
              postError.title ? "outline-2 outline-red-600" : ""
            } `}
            onChange={(e) => {
              post.title = e.target.value;
              setTitle(post.title);
              console.log(title);
            }}
          />

          <textarea
            placeholder="Descrição"
            value={description}
            className={`${style.input} ${
              postError.description ? "outline-2 outline-red-600" : ""
            } `}
            onChange={(e) => {
              post.description = e.target.value;
              setDescription(post.description);
            }}
          />
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

          <input
            name="valor"
            type="text"
            placeholder="R$: 0,00"
            value={valor}
            className={`${style.input} ${
              postError.valor ? "outline-2 outline-red-600" : ""
            }`}
            onChange={(e) => formatarMoeda(e)}
          />

          <label className="w-fit">
            <span
              className={`${
                imagens.length >= 3
                  ? "bg-gray-500 text-gray-800"
                  : "bg-cyan-700 hover:bg-cyan-400 focus:outline-cyan-400 focus:outline-4 cursor-pointer"
              } block w-fit p-2 rounded  `}
              tabIndex={0}
            >
              <FontAwesomeIcon className="text-3xl" icon={faImage} />
            </span>
            <input
              accept="image/*"
              type="file"
              className="hidden"
              multiple
              disabled={imagens.length >= 3}
              onChange={(e) => selecionarImagens(e)}
            />
          </label>

          {loading && <LinearProgressIndicator />}
          <div
            id="preview"
            className="flex gap-3 bg-gray-400 p-2 rounded overflow-x-scroll"
          >
            {imagens.map((e) => {
              return (
                <ImagePreview
                  key={e.url}
                  image={e}
                  onClick={() => removeImagePreview(e)}
                />
              );
            })}
          </div>

          <div id="actions" className="flex gap-2 items-center">
            <ButtonSecondary onClick={() => router.back()} label="Cancelar" />
            <ButtonPrimary label={"Salvar"} onClick={() => {}} />
          </div>
        </form>
      </main>
    </>
  );

  function ImagePreview({
    image,
    onClick,
  }: {
    image: ImageFile;
    onClick: (image: ImageFile) => void;
  }) {
    return (
      <div className="relative min-w-2/3  ">
        <div
          className="absolute cursor-pointer bg-red-900 hover:bg-red-500 rounded-full h-8 w-8 text-center p-1 -right-2 -top-2 peer "
          onClick={() => onClick(image)}
        >
          X
        </div>
        <Card className="border-3 border-cyan-600 bg-cyan-800 peer-hover:bg-red-500/40 peer-hover:border-red-500 min-w-full">
          <Image
            className="rounded-md cursor-pointer"
            src={image.url}
            alt=""
            width={150}
            height={150}
            loading="eager"
            onClick={() => {
              usebackdrop.openContent(
                <ImageCropper
                  image={image.url}
                  onConfirm={(file) => {
                    const url = URL.createObjectURL(file);
                    const newImg = { ...image, file, url };

                    setImagens((imgs) =>
                      imgs.map((img) => (img.id === image.id ? newImg : img))
                    );
                  }}
                />
              );
            }}
          />
        </Card>
      </div>
    );
  }
  async function getCategorias() {
    const categorias = await httpCategoria.getAll();

    setCategoriasValues(
      categorias.map((e: CategoriaType) => {
        return { value: e.id, label: e.descricao };
      })
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    salvar();
  }

  function formatarMoeda(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    const apenasNumeros = extractNumberInString(input);

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
        />
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
      />
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
          const id = getUniqueId();

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

  function removeImagePreview(image: ImageFile) {
    setImagens((prev) => {
      const img = prev.find((img) => img.id === image.id);
      if (img) URL.revokeObjectURL(img.url);

      return prev.filter((img) => img.id !== image.id);
    });
  }
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
