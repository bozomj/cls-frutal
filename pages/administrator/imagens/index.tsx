import OwnerGuard from "@/components/guards/OwnerGuard";
import httpImage from "@/http/image";
import LayoutPage from "@/layout/dashboard/layout";
import { getAdminProps } from "@/lib/hoc";
import { ImageDBType } from "@/shared/Image_types";

import { UserDBType } from "@/shared/user_types";
import utils from "@/utils";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AdminImagePageProps {
  user: UserDBType;
}

const adminImagePage = ({ user }: AdminImagePageProps) => {
  const [imagens, setImagens] = useState<ImageDBType[]>([]);

  useEffect(getAllImagesPost, []);
  return (
    <LayoutPage user={user}>
      <div className="flex w-full flex-wrap gap-2 justify-center">
        <OwnerGuard isOwner={imagens.length > 0}>
          {imagens.map((img) => {
            console.log(img);
            return (
              <div className="min-w-50" key={img.id}>
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
                <h3>{img.status ?? "Sem status"}</h3>
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
