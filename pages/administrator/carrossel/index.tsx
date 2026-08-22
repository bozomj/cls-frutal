import { GetServerSidePropsContext } from "next";

import { ChangeEvent, useEffect, useState } from "react";
import utils from "@/utils";
import InputFile from "@/components/InputFile";

import CarrosselScroll from "@/components/CarrosselScroll";
import controllerCloudflare from "@/storage/cloudflare/controllerCloudflare";
import LayoutPage from "@/layout/dashboard/layout";
import { getAdminProps } from "@/lib/hoc";
import httpCarrosselImage from "@/http/carrossel_image";
import { UserDBType } from "@/shared/user_types";
import {
  ImageCardPreview,
  ImageCropper,
  LinearProgressIndicator,
} from "@/components";
import { ImageDBType } from "@/shared/Image_types";
import { ButtonPrimary } from "@/components/ui/Buttons";
import OwnerGuard from "@/components/guards/OwnerGuard";
import { useBackdrop } from "@/ui/backdrop/useBackdrop";

interface Props {
  user: UserDBType;
}

type typeImagePreview = {
  url: string;
  file: File;
};

function CarrosselPageAdmin({ user }: Props) {
  const [loadingImages, setLoadingImages] = useState<boolean>(false);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [imgCarrossel, setImgCarrossel] = useState<[]>([]);
  const [imagensPreviews, setPreviewImagens] = useState<
    typeImagePreview[] | []
  >([]);

  const usebackdrop = useBackdrop();

  useEffect(() => {
    httpCarrosselImage.getImagesCarrossel().then(setImgCarrossel);
  }, []);

  return (
    <LayoutPage user={user}>
      <div className="flex flex-col items-center gap-2 md:max-w-[960px] rounded-xl mx-auto w-full ">
        <div className="w-full h-40 md:h-60 flex justify-center rounded-xl bg-white p-2 shadow-sm shadow-gray-400">
          <CarrosselScroll items={imgCarrossel} time={1} className="w-9/12! " />
        </div>

        <section className="bg-white rounded-2xl shadow-sm shadow-gray-400 border w-full border-slate-100 p-4 md:p-6 max-w-7xl">
          <h2 className="text-lg font-bold text-slate-900">
            Imagens Banner Carrossel
          </h2>
          <p className="text-xs text-slate-400 mb-2">
            Gerencie o catálogo de fotos do Banner
          </p>
          <div className="grid items-center grid-cols-3 w-full rounded-xl">
            <ImagensCarrossel
              imgs={imgCarrossel}
              database={true}
              click={removeCarrosselImage}
            />
            <ImagensCarrossel
              imgs={imagensPreviews}
              click={removePreviewImage}
              active={false}
              alertMsg="SALVAR"
              fromDataBase={false}
            />

            <OwnerGuard isOwner={loadingImages}>
              <div className="w-full top-5">
                <LinearProgressIndicator />
              </div>
            </OwnerGuard>
            <div className="h-full  w-full relative flex justify-center items-center aspect-video">
              <InputFile
                onClick={getInputFiles}
                className="w-full h-full text-3xl  "
              />
            </div>
          </div>
          <div
            id="actions"
            className="flex justify-between items-center
          w-full flex-row-reverse py-4
          "
          >
            <button
              disabled={imagensPreviews.length === 0}
              className={`cursor-pointer  flex items-center overflow-hidden  rounded-md w-1/3 relative font-bold ${imagensPreviews.length < 1 ? "bg-gray-400 text-gray-600 " : "bg-green-500 text-white"} h-10`}
              onClick={salvarImagens}
            >
              <div
                className={`absolute min-h-2 h-full bg-cyan-500 transform origin-left animate-loading top-0 ${salvando ? "w-full" : ""} `}
              ></div>
              <span className="absolute w-full left-0">Salvar</span>
            </button>
          </div>
        </section>
      </div>
    </LayoutPage>
  );

  function removePreviewImage(e: unknown, index: number) {
    imagensPreviews.splice(index, 1);
    setPreviewImagens((prev) => [...prev]);
  }

  async function getInputFiles(e: ChangeEvent<HTMLInputElement>) {
    setLoadingImages(true);
    const files = e.target.files || [];

    if (files.length === 0) return;

    // 2. Função para processar uma imagem de cada vez
    async function processarFila(index: number) {
      // Se chegou ao fim da lista de imagens, para
      if (index >= files.length) return;

      const file = files[index];
      const previewImg = URL.createObjectURL(file);

      // Retorna uma Promise que só resolve quando o onConfirm (ou onClose) for chamado
      return new Promise((resolve: CallableFunction) => {
        usebackdrop.openContent(
          <ImageCropper
            image={previewImg}
            aspect={16 / 9}
            onCancel={(f) => {
              setPreviewImagens((prev) => [...prev, { url: f, file: file }]);

              resolve();
              processarFila(index + 1);
            }}
            onConfirm={async (f) => {
              const resized = await utils.imagem.resizeImageFile(f);
              const imgURL = URL.createObjectURL(resized);

              setPreviewImagens((prev) => [
                ...prev,
                { url: imgURL, file: resized },
              ]);

              resolve(); // Libera a Promise para ir para a próxima imagem
              processarFila(index + 1); // Chama a próxima imagem da fila
            }}
          />,
        );
      });
    }

    processarFila(0);
    setLoadingImages(false);
  }

  async function salvarImagens() {
    setSalvando(true);
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
    setSalvando(false);
  }

  function ImagensCarrossel({
    imgs,
    database = false,
    active = true,
    click,
    alertMsg,
    fromDataBase = true,
  }: {
    imgs: [] | typeImagePreview[];
    click?: (v: { url: string }, index: number) => void;
    database?: boolean;
    active?: boolean;
    alertMsg?: string;
    fromDataBase?: boolean;
  }) {
    const itens = imgs.map((e: { url: string }, index) => {
      const nurl = e.url.includes("http") ? e.url : utils.getUrlImageR2(e.url);

      return (
        <ImageCardPreview
          key={e.url}
          image={{ ...e, url: nurl } as ImageDBType}
          className="min-w-full h-full object-cover "
          onClick={() => click!(e, index)}
          active={active}
          alertMsg={alertMsg}
          onImageClick={() => {
            if (fromDataBase) return;
            else
              usebackdrop.openContent(
                <ImageCropper
                  aspect={16 / 9}
                  image={e.url}
                  onConfirm={async (f) => {
                    let image = e;
                    const url = URL.createObjectURL(f);
                    const newImage = { ...image, file: f, url: url };

                    setPreviewImagens((imgs) => {
                      return imgs.map((img) => {
                        return img.url === image.url ? newImage : img;
                      });
                    });
                  }}
                />,
              );
          }}
        />
      );
    });

    return itens;
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
