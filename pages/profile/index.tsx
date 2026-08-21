import Header from "@/components/Header";

import { ChangeEvent, useEffect, useRef } from "react";

import CircleAvatar from "@/components/CircleAvatar";

import utils from "@/utils";

import Produtos from "@/layout/produtos/Produtos";

import { GetServerSideProps, GetServerSidePropsContext } from "next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import ProductCardDashboard from "@/components/ProductCardDasboard";

import FooterLayout from "@/layout/FooterLayout";
import Link from "next/link";
import controllerCloudflare from "@/storage/cloudflare/controllerCloudflare";
import ImageCardPreview from "@/components/ImageCardPreview";

import httpUser from "@/http/user";
import httpPost from "@/http/post";
import httpPerfilImages from "@/http/perfil_images";
import ImageCropper from "@/components/ImageCropper";
import { useBackdrop } from "@/ui/backdrop/useBackdrop";

import { imageProfileType } from "@/shared/Image_types";
import { FullImageView } from "@/components";
import WireProductCardDashboard from "@/wireframes/wireProductCardDashboard";
import { PostDetailType } from "@/shared/post_types";

import Paginacao from "@/components/Paginacao";
import { usePaginacao } from "@/hooks/usePaginacao";

import { QueryParams, useQueryParams } from "@/hooks/useQueryParams";
import { usePosts } from "@/hooks/usePosts";
import { useUser } from "@/hooks/useUser";
import Row from "@/components/ui/row";
import Column from "@/components/ui/column";

import FileButton from "@/components/ui/fileButton";
import HorizontalDivider from "@/components/HorizontalDivider";

const Profile: React.FC = () => {
  const { user, imagemProfile, setUser, setImagemProfile } = useUser();
  const backdrop = useBackdrop();

  const { params } = useQueryParams();
  const { initial, limit } = params;
  const { postagens, total, isLoad } = usePosts(fetcher, params);

  const paginacao = usePaginacao(total, initial, limit);
  const produtosRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    produtosRef.current?.focus();
  }, []);

  function openFullImage() {
    backdrop.openContent(
      <FullImageView
        images={[{ url: user?.url ?? "" }]}
        index={0}
        visible={true}
        onClose={() => backdrop.closeContent()}
      />,
    );
  }

  return (
    <>
      <Header />

      <main className="flex p-2 justify-center bg-gray-200 text-gray-800 overflow-y-scroll scroll-smooth flex-1">
        <div className="w-full md:max-w-7xl ">
          <span data-scroll-top tabIndex={1} ref={produtosRef}></span>

          <section className="flex flex-col rounded-md shadow-md overflow-x-hidden gap-2 bg-gray-50  p-2">
            <Row>
              <Column>
                <div className="relative w-fit h-full mt-4">
                  <CircleAvatar
                    className="cursor-pointer"
                    size={8}
                    imagem={utils.getUrlImageR2(user?.url || null)}
                    onClick={openFullImage}
                  />

                  <FileButton
                    size={4}
                    className=" absolute right-1 bottom-1 border-2 border-cyan-50 bg-cyan-100  hover:bg-cyan-200 text-2xl text-cyan-800 "
                    onClick={fileSelect}
                  >
                    <FontAwesomeIcon icon={faCamera} />
                  </FileButton>
                </div>
              </Column>

              <HorizontalDivider size={0.5} />

              {/* <span className="h-44 border-1 border-gray-200 block"></span> */}
              <div className="overflow-hidden">
                <span className="text-xs font-black text-gray-600 h-6">
                  Gerencie fotos do perfil
                </span>
                <div className=" flex gap-2  flex-1 h-36 overflow-x-auto ">
                  {imagemProfile?.map((img: imageProfileType) => {
                    const newImg = {
                      ...img,
                      url: utils.getUrlImageR2(img?.url ?? ""),
                    };
                    return (
                      <div key={newImg.url} className="relative w-fit ">
                        <button
                          type="button"
                          className={`absolute z-[9]  hover:text-green-600 hover:border-green-600  ${
                            newImg.selected
                              ? "text-green-800"
                              : "text-green-800/40"
                          } text-3xl bottom-0 left-1`}
                          onClick={() => updateProfileImage(newImg, img.url)}
                        >
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            className={`border-3  rounded-full cursor-pointer  hover:border-green-600  ${
                              newImg.selected
                                ? "border-green-800"
                                : "border-white"
                            }`}
                            size={"xs"}
                          />
                        </button>
                        <ImageCardPreview
                          image={newImg}
                          circle={true}
                          className="max-w-full h-34! min-w-36! "
                          onClick={async (e) => {
                            const deleted =
                              await httpPerfilImages.deleteImageProfile(img);

                            if (deleted.message === "Imagem deletada") {
                              setImagemProfile((prev) => {
                                return (
                                  prev?.filter((im) => im.id !== e.id) ?? []
                                );
                              });
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </Row>

            <Row>
              <h1>{utils.string.capitalizar(user?.name || null)}</h1>
              {user?.is_admin && (
                <Link
                  href="/administrator"
                  className="hover:underline text-sm font-bold text-gray-600"
                >
                  Painel Administrador
                </Link>
              )}
            </Row>
          </section>

          <section className=" flex flex-col py-4 ">
            {postagens.length < 1 && isLoad ? (
              <Produtos
                postagens={
                  [{}, {}, {}, {}, {}, {}, {}, {}, {}] as PostDetailType[]
                }
                Card={WireProductCardDashboard}
                className="grid-cols-1! md:grid-cols-3!"
              />
            ) : (
              <Produtos
                postagens={postagens}
                Card={ProductCardDashboard}
                className="grid-cols-1! md:grid-cols-3! p-0! bg-gray-200! shadow shadow-gray-400/0"
              />
            )}
            <Paginacao paginacao={paginacao} />
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
      backdrop.openContent(
        <ImageCropper
          image={result.previewImg}
          onConfirm={async (file) => {
            await salvar(file);
          }}
        />,
      );
    }
  }

  async function updateProfileImage(newImg: imageProfileType, imgUrl: string) {
    await httpPerfilImages.updateImageProfile(newImg);

    // setUserImageUrl(imgUrl);
    setUser((u) =>
      u
        ? {
            ...u,
            url: imgUrl,
          }
        : u,
    );

    setImagemProfile((oldImages) =>
      oldImages!.map((img) => ({
        ...img,
        selected: img.id === newImg.id,
      })),
    );
  }

  async function salvar(image: File) {
    try {
      const img = await controllerCloudflare.save([image]);

      await httpPerfilImages.saveImageProfile({
        user_id: user?.id,
        url: img.files[0],
      });

      const userdata = await httpUser.getUserLogin();

      setUser((u) =>
        u
          ? {
              ...u,
              url: img.files[0],
            }
          : u,
      );
      setImagemProfile(userdata.imagemProfile);
    } catch (error) {
      throw { message: "erro ao salvar imagem", cause: error };
    }
  }
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => utils.redirectNotToken(context, "/login");

export default Profile;

const fetcher = (params: QueryParams) => {
  const { limit, initial } = params;
  return httpPost.getPostCurrentUser(initial * limit, limit);
};

//
