import { Alert } from "@/components";
import OwnerGuard from "@/components/guards/OwnerGuard";
import { ToggleSlide } from "@/components/ui/ToogleSlide";
import httpImage from "@/http/image";
import LayoutPage from "@/layout/dashboard/layout";
import { getAdminProps } from "@/lib/hoc";
import { ImageDBType, ImageStatus } from "@/shared/Image_types";

import { UserDBType } from "@/shared/user_types";
import { useBackdrop } from "@/ui/backdrop/useBackdrop";
import utils from "@/utils";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AdminImagePageProps {
  user: UserDBType;
}

const adminImagePage = ({ user }: AdminImagePageProps) => {
  const [postList, setImagens] = useState<
    { post_id: string; title: string; lista_imagens: ImageDBType[] }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const backdrop = useBackdrop();

  useEffect(getAllImagesPost, []);
  console.log(postList);
  return (
    <LayoutPage user={user}>
      <div className="flex w-full  flex-col gap-4 justify-center">
        <OwnerGuard isOwner={postList.length > 0}>
          {postList.map((imagens) => {
            return (
              <div
                key={imagens.post_id}
                className="bg-white p-4 rounded-md  shadow-sm shadow-gray-400"
              >
                <h3 className="font-bold">{imagens.title}</h3>
                {/* <div className=" gap-4 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]"> */}
                <div className=" flex overflow-x-scroll ">
                  {imagens?.lista_imagens?.map((img) => {
                    return (
                      <div
                        className={`min-w-3/7 md:min-w-1/3 p-1 ${img.status != ImageStatus.ACTIVE ? " order-1 " : " order-2"} `}
                        key={img.id}
                      >
                        <div className=" bg-white rounded-md shadow-sm shadow-gray-400  ">
                          <div className="min-w-1/5 flex-1 border-2 border-gray-400 relative rounded-md overflow-hidden h-60">
                            <Image
                              className="object-contain"
                              alt=""
                              src={utils.getUrlImageR2(img.url)}
                              fill
                              sizes="150"
                              loading="eager"
                            />
                          </div>

                          <div className="flex justify-between p-2">
                            <h3
                              className={`${img.status === ImageStatus.ACTIVE ? "text-green-700" : "text-gray-400"} font-bold `}
                            >
                              {img.status ?? "Sem status"}
                            </h3>
                            <ToggleSlide
                              value={img.status === ImageStatus.ACTIVE}
                              onChange={async () => {
                                if (loading) {
                                  backdrop.openContent(
                                    <Alert
                                      msg={"Espere a ultima ação ser executada"}
                                      onClose={() => backdrop.closeContent()}
                                    />,
                                  );
                                  return;
                                }

                                const newStatus =
                                  img.status === ImageStatus.ACTIVE
                                    ? ImageStatus.PENDING
                                    : ImageStatus.ACTIVE;

                                setLoading(true);

                                await new Promise((r) => setTimeout(r, 100));

                                const updated = await httpImage.updateState(
                                  img.id,
                                  newStatus,
                                  img.post_id ?? "",
                                );

                                if (updated.message) {
                                  backdrop.openContent(
                                    <Alert
                                      msg={updated.message}
                                      onClose={() => backdrop.closeContent()}
                                    />,
                                  );
                                  setLoading(false);
                                  return;
                                }

                                setImagens((prev) =>
                                  prev.map((imagens) => {
                                    const nList = imagens.lista_imagens.map(
                                      (item) =>
                                        item.id === img.id
                                          ? { ...item, status: newStatus }
                                          : item,
                                    );
                                    return { ...imagens, lista_imagens: nList };
                                  }),
                                );
                                setLoading(false);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </OwnerGuard>
      </div>
    </LayoutPage>
  );

  function getAllImagesPost() {
    httpImage.getAllImagesPost().then(setImagens);
  }
};

export default adminImagePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getAdminProps(context);
}
