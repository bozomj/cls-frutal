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
import { faCamera, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import ProductCardDashboard from "@/components/ProductCardDasboard";
import Modal from "@/components/Modal";
import FooterLayout from "@/layout/FooterLayout";
import Link from "next/link";
import controllerCloudflare from "@/storage/cloudflare/controllerCloudflare";
import controllerPostgres from "@/storage/postgres/controllerPostgres";
import ImageCardPreview from "@/components/ImageCardPreview";

type imageProfileType = {
  id: number;
  url: string;
  file: File;
  selected: boolean;
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserType>();
  const [posts, setPosts] = useState([]);
  const { paginacao, setPaginacao } = usePagination();
  const [showmodal, setShowModal] = useState(<></>);
  const [imagesProfile, setImagesProfile] = useState<imageProfileType[]>([]);

  const produtosRef = useRef<HTMLInputElement>(null);

  const { limite, current } = paginacao;
  const initial = current * limite;

  const init = useCallback(async () => {
    try {
      const userData = await userController.getUserLogin();
      setUser(userData.user);
      setImagesProfile(userData.imagemProfile);

      const p = await userController.getPost(initial, limite);
      setPosts(p.posts);
      setPaginacao((prev) => ({ ...prev, totalItens: p.total.total }));
    } catch (error) {
      console.error("Falha ao carregar dados do perfil:", error);
      // Adicionar feedback de erro para o usuário aqui
    }
  }, [initial, limite, setPaginacao]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => produtosRef.current?.focus());

  return (
    <>
      <Header />

      <main className="flex  justify-center bg-gray-200 p-4 text-gray-800 overflow-y-scroll scroll-smooth flex-1">
        <div className="w-full md:w-[40rem]">
          <span data-scroll-top tabIndex={1} ref={produtosRef}></span>

          <section className="flex overflow-hidden gap-2">
            <div id="profile" className="flex flex-col gap-2 ">
              <div className="relative w-fit">
                <CircleAvatar
                  size={8}
                  imagem={utils.getUrlImageR2(user?.url || "")}
                />

                <label
                  id="btn-camera"
                  className={`w-10 h-10 absolute right-1 bottom-1 
                  rounded-full border-2 border-cyan-50 
                bg-cyan-100  hover:bg-cyan-200
                  text-2xl text-cyan-800 
                  flex justify-center items-center 
                  cursor-pointer`}
                >
                  <FontAwesomeIcon icon={faCamera} />
                  {showmodal}
                  <input type="file" className="hidden" onChange={fileSelect} />
                </label>
              </div>

              <h1>{utils.string.capitalizar(user?.name ?? "")}</h1>
              {user?.is_admin && (
                <div className="text-sm text-gray-600 font-bold">
                  <Link href="/administrator" className="hover:underline">
                    Painel Administrador
                  </Link>
                </div>
              )}
            </div>

            <div
              id="imagen-do-perfil"
              className="flex gap-2 p-2 overflow-x-scroll flex-1 bg-gray-300"
            >
              {imagesProfile?.map((img: imageProfileType) => {
                const newImg = {
                  ...img,
                  url: utils.getUrlImageR2(img?.url ?? ""),
                };
                return (
                  <div key={newImg.url} className="relative min-w-fit ">
                    <button
                      type="button"
                      className={`absolute z-10 btn ${
                        newImg.selected ? "text-green-400" : "text-white"
                      } text-3xl bottom-0`}
                      onClick={() => updateProfileImage(newImg, img.url)}
                    >
                      <FontAwesomeIcon icon={faCircleCheck} />
                    </button>
                    <ImageCardPreview
                      image={newImg}
                      className="max-w-full"
                      onClick={async (e) => {
                        const result = await fetch(
                          "/api/v1/user/setImageProfile",
                          {
                            method: "DELETE",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(img),
                          }
                        );
                        const deletedImage = await result.json();

                        if (deletedImage.message === "Imagem deletada") {
                          setImagesProfile((prev) => {
                            return prev.filter((im) => im.id !== e.id);
                          });
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          <section className="border-t-2 border-gray-400 flex flex-col py-4 mt-4">
            <Produtos postagens={posts} Card={ProductCardDashboard} />
          </section>
        </div>
      </main>
      <FooterLayout />
    </>
  );

  async function selecionarImagens(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files || [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Verifica se o arquivo é uma imagem
        if (file.type.startsWith("image/")) {
          // Cria uma URL temporária para o arquivo e redimenciona
          const resized = (await utils.imagem.resizeImageFile(file)) as File;
          const previewImg = URL.createObjectURL(resized) as string;

          return { resized, previewImg };
        }
      }
    }
    return null;
  }

  async function fileSelect(e: ChangeEvent<HTMLInputElement>) {
    const result = await selecionarImagens(e);

    if (result != null) {
      setShowModal(
        <Modal
          onClose={() => {
            setShowModal(<></>);
          }}
          onConfirm={async () => {
            await salvar(result.resized);

            console.log(result.previewImg);
            setShowModal(<></>);
          }}
        >
          <div className="flex rounded-2xl flex-1 justify-center items-center w-full bg-gray-300 p-2">
            {/*  eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.previewImg}
              alt="preview"
              className="rounded-2xl"
            />
          </div>
        </Modal>
      );
    }
  }

  async function updateProfileImage(newImg: imageProfileType, imgUrl: string) {
    await userController.updateImageProfile(newImg);

    setUser((user) => {
      return { ...user, url: imgUrl } as UserType;
    });

    setImagesProfile((oldImages) =>
      oldImages.map((img) => ({
        ...img,
        selected: img.id === newImg.id,
      }))
    );
  }

  async function salvar(image: File) {
    try {
      const img = await controllerCloudflare.save([image]);

      await controllerPostgres.saveImageProfile({
        user_id: user?.id,
        url: img.files[0],
      });

      const userdata = await userController.getUserLogin();
      setUser(userdata.user);
      setImagesProfile(userdata.imagemProfile);
    } catch (error) {
      console.log(error);
    }
  }
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => utils.redirectNotToken(context, "/login");

export default Profile;
