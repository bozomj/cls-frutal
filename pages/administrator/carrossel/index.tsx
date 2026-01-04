import { GetServerSidePropsContext } from "next";

import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useState } from "react";
import utils from "@/utils";
import InputFile from "@/components/InputFile";

import CarrosselScroll from "@/components/CarrosselScroll";
import controllerCloudflare from "@/storage/cloudflare/controllerCloudflare";
import LayoutPage from "@/layout/dashboard/layout";
import { getAdminProps } from "@/lib/hoc";
import httpCarrosselImage from "@/http/carrossel_image";
import { UserDBType } from "@/shared/user_types";

interface Props {
  user: UserDBType;
}

type typeImagePreview = {
  url: string;
  file: File;
};

function CarrosselPageAdmin({ user }: Props) {
  const [imgCarrossel, setImgCarrossel] = useState<[]>([]);
  const [imagensPreviews, setPreviewImagens] = useState<
    typeImagePreview[] | []
  >([]);

  useEffect(() => {
    httpCarrosselImage.getImagesCarrossel().then(setImgCarrossel);
  }, []);

  return (
    <LayoutPage user={user}>
      <div className="flex flex-col gap-2">
        <CarrosselScroll items={imgCarrossel} time={1} />

        <section className="flex flex-col items-center gap-2 ">
          <h2 className="text-3xl font-bold">Imagens Banner Carrossel</h2>
          <div className="flex h-[15rem] bg-gray-300 p-2 overflow-x-scroll w-full">
            <ImagensCarrossel imgs={imgCarrossel} database={true} />
          </div>
        </section>

        <section className="flex flex-col items-center gap-2 mt-4 ">
          <h2 className="text-3xl font-bold">Adicionar novas imagens</h2>
          <div
            id="preview"
            className="flex h-[20rem] bg-gray-600 p-2 w-full overflow-x-scroll"
          >
            <ImagensCarrossel
              imgs={imagensPreviews}
              click={removePreviewImage}
            />
          </div>
        </section>

        <section id="actions" className="flex justify-between items-center">
          <InputFile onClick={getInputFiles} className="w-15 text-white" />
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

  function removePreviewImage(e: unknown, index: number) {
    imagensPreviews.splice(index, 1);
    setPreviewImagens((prev) => [...prev]);
  }

  async function getInputFiles(e: ChangeEvent<HTMLInputElement>) {
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
    const dataImage = imagensPreviews.map((image) => image.file);

    try {
      const imagens = await controllerCloudflare.save(dataImage);

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

    const data = await httpCarrosselImage.getImagesCarrossel();

    setImgCarrossel(data);
    setPreviewImagens([]);
  }

  function ImagensCarrossel({
    imgs,
    database = false,
    click,
  }: {
    imgs: [] | typeImagePreview[];
    click?: (v: unknown, index: number) => void;
    database?: boolean;
  }) {
    const itens = imgs.map((e, index) => (
      <div
        key={index}
        className="relative rounded-md overflow-hidden w-[30rem]"
      >
        <button
          className="absolute p-1 bg-red-600 right-0 flex items-center text-white cursor-pointer hover:bg-red-400 "
          onClick={
            click ? () => click(e, index) : () => removeCarrosselImage(e)
          }
        >
          <FontAwesomeIcon icon={faAdd} />
        </button>
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={database ? utils.getUrlImageR2(e?.url ?? "") || "" : e.url}
          width={10}
          height={10}
          alt=""
          className="w-[30rem]   rounded-md h-full"
        />
      </div>
    ));

    return <div className="flex gap-2 mt-4">{itens}</div>;
  }

  async function removeCarrosselImage(e: { url: string }) {
    await httpCarrosselImage.deleteImage(e);

    const data = await httpCarrosselImage.getImagesCarrossel();
    setImgCarrossel(data);
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getAdminProps(context);
}

export default CarrosselPageAdmin;
