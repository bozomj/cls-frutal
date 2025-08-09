import Header from "@/components/Header";
import { UserType } from "@/models/user";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import CircleAvatar from "@/components/CircleAvatar";

import utils from "@/utils";
import userController from "@/controllers/userController";
import Produtos from "@/layout/produtos/Produtos";
import { usePagination } from "@/contexts/PaginactionContext";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import ProductCardDashboard from "@/components/ProductCardDasboard";
import { imagemFirebase } from "@/storage/firebase";

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserType>();
  const [posts, setPosts] = useState([]);
  const { paginacao, setPaginacao } = usePagination();
  const [previewVisible, setPreviewVisible] = useState("hidden");
  const [imgUrlPreview, setImgUrlPreview] = useState("");
  const [imageProfile, setImageprofile] = useState<File | null>(null);

  const produtosRef = useRef<HTMLInputElement>(null);

  const { limite, current } = paginacao;
  const initial = current * limite;
  const init = useCallback(async () => {
    setUser(await userController.getUserLogin());
    const p = await userController.getPost(initial, limite);
    setPosts(p.posts);
    setPaginacao((prev) => ({ ...prev, totalItens: p.total.total }));
  }, [initial, limite, setPaginacao]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => produtosRef.current?.focus());

  async function selecionarImagens(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files || [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Verifica se o arquivo é uma imagem
        if (file.type.startsWith("image/")) {
          // Cria uma URL temporária para o arquivo
          const resized = (await resizeImageFile(file)) as File;
          setImgUrlPreview(URL.createObjectURL(resized));

          // setImagens((e) => [...e, { id: id, file: resized, url: imgURL }]);
          if (resized != null) {
            setImageprofile(resized);
          }
          console.log(imageProfile, imgUrlPreview);
          setPreviewVisible("");
        }
      }
    }
  }
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
  console.log(user);
  return (
    <>
      <Header />
      <div
        id="preview"
        className={`w-full h-full bg-gray-950/50 fixed z-[999] flex justify-center items-center ${previewVisible}`}
        onClick={() => {
          setPreviewVisible("hidden");
        }}
      >
        <div className="flex flex-col w-[30rem] max-h-2/3 bg-cyan-950 p-4 rounded-2xl gap-2 overflow-hidden">
          <div className="flex rounded-2xl flex-1 justify-center items-center w-full bg-gray-300 p-2">
            {/*  eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgUrlPreview} alt="" className="rounded-2xl" />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="hover:border-cyan-800 border-cyan-950 border-2 p-2 rounded-md cursor-pointer text-cyan-600 hover:text-cyan-400"
            >
              Cancelar
            </button>

            <button
              className=" rounded-md bg-cyan-800 p-2 border-2 border-cyan-800 cursor-pointer hover:bg-cyan-600 hover:border-cyan-600 text-cyan-500 hover:text-cyan-200 font-bold"
              onClick={async () => {
                const imgs = await imagemFirebase.uploadImageFirebase([
                  {
                    file: imageProfile!,
                  },
                ]);

                fetch("/api/v1/user/setImageProfile", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ user_id: user?.id, url: imgs[0].url }),
                });
              }}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
      <main className="flex  justify-center bg-gray-200 p-4 text-gray-800 overflow-y-scroll scroll-smooth">
        <div className="w-full md:w-[40rem]">
          <span data-scroll-top tabIndex={1} ref={produtosRef}></span>
          <section className="flex flex-col gap-2 ">
            <div className="relative w-fit">
              <CircleAvatar imagem={utils.getUrlImage(user?.url)} />
              <label className="w-10 h-10 rounded-full border-2 border-cyan-50 bg-cyan-100  absolute right-1 bottom-1 text-2xl flex justify-center items-center text-cyan-800">
                <FontAwesomeIcon icon={faCamera} />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => selecionarImagens(e)}
                />
              </label>
            </div>
            <h1>{utils.string.capitalizar(user?.name ?? "")}</h1>
          </section>

          <section
            id="publicacoes"
            className="border-t border-gray-400 flex flex-col py-4 mt-4"
          >
            <Produtos
              postagens={posts}
              Card={ProductCardDashboard}
              className="text-white"
            />
          </section>
        </div>
      </main>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => utils.redirectNotToken(context, "/login");

export default Profile;
