import Card from "@/components/card";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Header from "@/components/Header";
import autenticator from "@/models/autenticator";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

import Link from "next/link";
import { useEffect, useState } from "react";
import Alert from "@/components/Alert";
import { CategoriaType } from "@/models/categoria";

const post = {
  title: "",
  description: "",
  user_id: "",
  valor: 0,
  categoria_id: 0,
  created_at: Date.now(),
};

export default function Produto() {
  const [categoria, setCategoria] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [valor, setValor] = useState("");
  const [urls, setImg] = useState<string[]>([]);
  const [imagens, setImagens] = useState<File[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [Alertmsg, setAlertmsg] = useState("");

  const [categoriasValues, setCategoriasValues] = useState<
    { value: string; label: string }[]
  >([]);

  const [postError, setError] = useState<{
    title: string;
    description: string;
    userId: string;
    valor: string;
    categoria_id: string;
    created_at: string;
    id: string;
  }>({
    title: "",
    categoria_id: "",
    description: "",
    userId: "",
    valor: "",
    created_at: "",
    id: "",
  });

  useEffect(() => {
    if (categoriasValues.length < 2) getCategorias();

    //return funciona como "dispose" do Flutter
    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
        console.log("url deletada", url);
      });
    };
  }, [categoriasValues.length, urls]);

  async function getCategorias() {
    const categorias = await (await fetch("/api/v1/categorias")).json();

    const c = categorias.map((e: CategoriaType) => {
      return { value: e.id, label: e.descricao };
    });

    setCategoriasValues([...c]);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    salvar();
  }

  const formatarMoeda = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const apenasNumeros = extractNumberInString(input);

    const numero = stringForDecimalNumber(apenasNumeros);
    const formatado = formatNumberForMoedaString(numero);

    setValor(formatado);
    post.valor = numero;
  };

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

  async function uploadImage(id: string) {
    if (imagens.length > 3)
      return { error: "O numero de imagens devem ser no maximo 3!!" };
    const formdata = new FormData();
    for (const image of imagens) {
      formdata.append("image", image);
    }
    formdata.append("postid", id || "idcorreto");

    if (imagens.length > 0) {
      const uploadedImagens = await fetch("/api/v1/uploadImages", {
        method: "POST",
        body: formdata,
      });

      return uploadedImagens.json();
    }

    return null;
  }

  async function getIdUserAuthenticated() {
    return (await autenticator.isAuthenticated()).result.id;
  }

  const salvar = async () => {
    console.log(post);

    if (imagens.length > 3) {
      setAlertmsg("Escolha no máximo 3 imagens");
      setShowModal(true);
      return;
    }

    if (imagens.length < 1) {
      setAlertmsg("Escolha Pelo menos uma imagem");
      setShowModal(true);
      return;
    }

    post.created_at = Date.now();
    post.user_id = await getIdUserAuthenticated();

    postError.description = post.description == "" ? "campo obrigatorio" : "";
    postError.title = post.title == "" ? "Campo obrigatorio" : "";
    postError.valor = post.valor <= 0 ? "Campo obrigatorio" : "";
    postError.categoria_id = post.categoria_id == 0 ? "Campo obrigatorio" : "";

    setError({ ...postError });

    const posted = await fetch("/api/v1/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    const jsonresult = await posted.json();

    if (jsonresult.message == "erro ao inserir post") {
      throw jsonresult;
    }

    console.log(">>", jsonresult[0].id ?? "nada");
    await uploadImage(jsonresult[0].id);

    post.categoria_id = 0;
    post.description = "";
    post.title = "";
    post.valor = 0;
    post.created_at = 0;
    post.user_id = "";
    // post.url = "";

    setValor("");
    setCategoria("");
    setTitle("");
    setDescription("");

    setImagens([]);
    setImg([]);
  };

  return (
    <>
      <Header />
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center p-2">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-cyan-950 rounded p-4 md:w-[480px] m-4 w-full "
        >
          {Object.values(postError).some((msg) => msg != "") && (
            <span className="text-red-800 font-bold ">
              Todos os campos são obrigatorios
            </span>
          )}

          <input
            type="text"
            value={title}
            placeholder="Titulo"
            className={`p-3 bg-cyan-50 text-gray-900 outline-0  focus:outline-cyan-500 focus:outline-4
              ${postError.title ? "border-2 border-red-600" : "border-none"}
              `}
            onChange={(e) => {
              post.title = e.target.value;
              setTitle(post.title);
            }}
          />
          {/* <span className="text-red-800">{postError.description}</span> */}
          <textarea
            placeholder="Descrição"
            value={description}
            className={`p-3 bg-cyan-50 text-gray-900 outline-0
               focus:outline-cyan-500 focus:outline-4
               ${
                 postError.description
                   ? "border-2 border-red-600"
                   : "border-none"
               } `}
            onChange={(e) => {
              post.description = e.target.value;
              setDescription(post.description);
            }}
          />
          {/* <span className="text-red-800">{postError.categoria_id}</span> */}
          <select
            name=""
            id=""
            className={`p-3 bg-cyan-50  outline-0 focus:outline-cyan-500 focus:outline-4
              ${categoria === "" ? "text-gray-400" : "text-gray-800"} 
              ${
                postError.categoria_id
                  ? "border-2 border-red-600"
                  : "border-none"
              }
              `}
            onChange={(e) => {
              setCategoria(e.target.value);
              console.log(e.target.value);
              post.categoria_id = parseInt(e.target.value);
            }}
          >
            <option key={0} value={""}>
              Selecione a categoria
            </option>
            {categoriasValues.map((e) => (
              <option
                key={e.value}
                value={e.value}
                disabled={e.value === ""}
                selected={e.value === ""}
                className={`${
                  e.value === "" ? "text-gray-400" : "text-gray-800"
                }`}
              >
                {e.label}
              </option>
            ))}
          </select>
          {/* <span className="text-red-800">{postError.valor}</span> */}
          <input
            type="text"
            placeholder="R$: 0,00"
            value={valor}
            className={`text-gray-900 outline-0 p-3 bg-cyan-50  focus:outline-cyan-500 focus:outline-4
              ${postError.valor ? "border-2 border-red-600" : "border-none"}
              `}
            onChange={(e) => {
              formatarMoeda(e);
            }}
          />

          <label>
            <span
              tabIndex={0}
              className="bg-cyan-700 block w-fit p-2 rounded focus:outline-cyan-500 focus:outline-4"
            >
              <FontAwesomeIcon icon={faImage} className="text-3xl" />
            </span>
            <input
              type="file"
              multiple
              max={3}
              className="hidden"
              onChange={async (e) => {
                const files = e.target.files;

                // const preview = document.getElementById("preview");
                if (files) {
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];

                    // Verifica se o arquivo é uma imagem
                    if (file.type.startsWith("image/")) {
                      // Cria uma URL temporária para o arquivo
                      const resized = (await resizeImageFile(file)) as File;
                      const imgURL = URL.createObjectURL(file);

                      console.log({
                        old: file,
                        new: resized,
                      });

                      setImagens((e) => [...e, resized]);
                      setImg((e) => [...e, imgURL]);
                    }
                  }
                }
              }}
            />
          </label>

          <div id="preview" className="flex gap-2 flex-wrap justify-center">
            {urls.map((e, index) => {
              return (
                <div key={index} className="relative w-fit">
                  <Card key={index}>
                    <div
                      className="absolute bg-amber-600 rounded-[50%] p-1 right-0 top-0"
                      onClick={() => {
                        setImg((prev) => prev.filter((_, i) => i !== index));
                        setImagens((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      X
                    </div>
                    <Image src={e} alt="" width={150} height={150} />
                  </Card>
                </div>
              );
            })}
          </div>

          <span className="flex gap-2 ite">
            <Link href={""} className="flex-1">
              Cancelar
            </Link>
            <button className="bg-cyan-600 p-2 flex-1 rounded">Salvar</button>
          </span>
        </form>
        {/* MODAL------------------------- */}

        <Alert
          msg={Alertmsg}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      </main>
    </>
  );
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

function resizeImageFile(file: File, maxWidth = 1280, maxSizeKB = 300) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx!.drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        let dataUrl = canvas.toDataURL("image/webp", quality);

        while (dataUrl.length / 1024 > maxSizeKB && quality > 0.1) {
          quality -= 0.005;
          dataUrl = canvas.toDataURL("image/webp", quality);
        }

        fetch(dataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const newFile = new File(
              [blob],
              file.name.replace(/\.\w+$/, ".webp"),
              {
                type: "image/webp",
                lastModified: Date.now(),
              }
            );
            resolve(newFile);
          });
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
