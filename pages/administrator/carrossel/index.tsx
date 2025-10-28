import LayoutPage from "../layout";
import { GetServerSidePropsContext } from "next";
import { UserType } from "@/models/user";
import { getAdminProps } from "../hoc";
import Carrossel from "@/components/Carrossel";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useState } from "react";
import utils from "@/utils";
import { imagemFirebase } from "@/storage/firebase";
import InputFile from "@/components/InputFile";

interface Props {
  user: UserType;
}

type typeImagePreview = {
  url: string;
  file: File;
};

function CarrosselPageAdmin({ user }: Props) {
  const [imgCarrossel, setImgCarrossel] = useState<[]>([]);
  const [imagensPreviews, setPreviewImagens] = useState<typeImagePreview[]>([]);

  useEffect(() => {
    getImagesCarrossel().then(setImgCarrossel);
  }, []);

  return (
    <LayoutPage user={user}>
      <div className="flex flex-col gap-2">
        <Carrossel imagens={imgCarrossel} speed={1} />

        <section className="flex flex-col items-center gap-2">
          <h2 className="text-3xl font-bold">Imagens Banner Carrossel</h2>
          <div className="flex h-[20rem] bg-gray-300 p-2">
            {imagensCarrossel(imgCarrossel)}
          </div>
        </section>

        <section className="flex flex-col items-center gap-2">
          <h2 className="text-3xl font-bold">Adicionar novas imagens</h2>
          <div id="preview" className="flex h-[20rem] bg-gray-600 p-2">
            {imagensCarrossel(imagensPreviews as [], (e, index) => {
              imagensPreviews.splice(index, 1);
              setPreviewImagens((prev) => [...prev]);
            })}
          </div>
        </section>

        <section id="actions" className="flex justify-between items-center">
          <InputFile onClick={getFiles} />
          <button
            className="btn bg-green-500 text-white"
            onClick={salvarImagens}
          >
            Salvar
          </button>
        </section>
      </div>
    </LayoutPage>
  );

  async function getFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files || [];

    if (files.length === 0) return;

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        const resized = await utils.imagem.resizeImageFile(file);
        const imgURL = URL.createObjectURL(resized); // Cria uma URL temporária para o arquivo

        setPreviewImagens((prev) => [...prev, { url: imgURL, file: resized }]);
      }
    }
  }

  async function salvarImagens() {
    const dataImage = imagensPreviews.map((image: { file: File }) => {
      return { file: image.file };
    });

    try {
      const imagens = await imagemFirebase.uploadImageFirebase(dataImage);

      await fetch("/api/v1/carrossel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(imagens),
      });
    } catch (error: unknown) {
      const err = error as { message: string };
      console.log(err.message);
    }

    const data = await getImagesCarrossel();

    setImgCarrossel(data);
    setPreviewImagens([]);
  }

  async function getImagesCarrossel() {
    const resp = await fetch("/api/v1/carrossel");
    const data = await resp.json();
    console.log(data);
    return data;
  }

  function imagensCarrossel(
    imgs: [],
    click?: (v: unknown, index: number) => void
  ) {
    const itens = imgs.map((e: { url: string }, index) => (
      <div key={index} className="relative">
        <button
          className="absolute p-1 bg-red-400 right-0 flex items-center text-white cursor-pointer "
          onClick={
            click
              ? () => click(e, index)
              : async () => {
                  console.log(e);
                  imagemFirebase.deleteImageFromUrl(e.url);

                  const result = await fetch("/api/v1/carrossel", {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(e),
                  });

                  console.log(result);

                  const data = await getImagesCarrossel();
                  setImgCarrossel(data);
                }
          }
        >
          <FontAwesomeIcon icon={faAdd} />
        </button>
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={e?.url ?? ""}
          alt=""
          className="w-[30rem]   rounded-md h-full"
        />
      </div>
    ));

    return <div className="flex gap-2 mt-4">{itens}</div>;
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getAdminProps(context);
}

export default CarrosselPageAdmin;
