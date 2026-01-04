import Card from "@/components/Card";

import Chart from "chart.js/auto";

import { useEffect, useState } from "react";

import { GetServerSidePropsContext } from "next";

import LayoutPage from "@/layout/dashboard/layout";
import { getAdminProps } from "@/lib/hoc";
import httpUser from "@/http/user";
import { UserDBType } from "@/shared/user_types";
import httpPost from "@/http/post";
import { PostStatus } from "@/shared/post_status";
import OwnerGuard from "@/components/guards/OwnerGuard";
import { PostDetailType } from "@/shared/post_types";
import utils from "@/utils";

interface Props {
  user: UserDBType;
}

function AdminDashboard({ user }: Props) {
  const [totalPost, setTotalPost] = useState();
  const [totalUsers, setTotalUsers] = useState();
  const [pendingPost, setpendingPost] = useState<PostDetailType[]>([]);

  useEffect(init, []);
  useEffect(() => {
    getPendingPost().then((r) => setpendingPost(r));
  }, []);

  return (
    <LayoutPage user={user}>
      <div className="flex flex-col gap-2">
        <section className="p-1 flex flex-col gap-2 rounded-md  bg-white shadow-sm shadow-gray-400">
          <h2>Anuncios</h2>
          <div className="flex gap-2 overflow-x-scroll h-30">
            <div
              className={` bg-gray-300 p-0! pt-2! font-bold flex-1 max-h-25! rounded-sm `}
            >
              <div className="flex flex-col items-center border-gray-300 border-2 rounded-md w-full h-full justify-center p-2 bg-white">
                <h2>Total</h2>
                {totalPost}
              </div>
            </div>

            <Card className={`${style}`}>
              <h2>Ativos</h2>
              {totalUsers}
            </Card>

            <Card className={`${style}`}>
              <h2>Pendentes</h2>
              {totalUsers}
            </Card>

            <Card className={`${style}`}>
              <h2>Expirados</h2>
              {totalUsers}
            </Card>
          </div>
        </section>

        <section className="p-1 flex flex-col gap-2 rounded-md  bg-white shadow-sm shadow-gray-400">
          <h2>Aguardando Aprovacao</h2>
          <OwnerGuard isOwner={pendingPost.length > 0}>
            <div>
              {pendingPost.map((post, i) => (
                <div
                  key={i}
                  className={`bg-white border-2 rounded-md p-2 border-accent
                    
                  `}
                >
                  <div className="flex gap-2 items-baseline">
                    <h2 className="text-gray-800 font-bold text-lg truncate ">
                      {post.title}
                    </h2>
                    <p className="text-xs">
                      {utils.formatarData(post?.created_at ?? "")}
                    </p>
                  </div>
                  <p className="text-xs truncate">{post.description}</p>
                </div>
              ))}
            </div>
          </OwnerGuard>
        </section>

        <section className="w-full">
          <canvas id="grafico"></canvas>
        </section>
      </div>
    </LayoutPage>
  );

  function initChart() {
    const ctx = document.getElementById("grafico") as HTMLCanvasElement;

    return new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
        datasets: [
          {
            label: "Postagens",
            data: [12, 19, 3, 5, 7, 3],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      },
    });
  }

  function init() {
    getTotalPost().then(setTotalPost);
    httpUser.getTotalUsers().then(setTotalUsers);
    const chart = initChart();

    return () => {
      chart.destroy();
    };
  }
}

async function getPendingPost() {
  const result = httpPost.getPostByStatus("0", "10", PostStatus.PENDING);
  return result;
}

async function getTotalPost() {
  const result = await fetch("/api/v1/poststotal", { method: "GET" });
  const data = await result.json();

  return data.total;
}

const style =
  " border-2 border-t-10 border-gray-300  font-bold flex-1 max-h-25! gap-0! ";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getAdminProps(context);
}

export default AdminDashboard;
