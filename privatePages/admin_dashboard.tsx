import Card from "@/components/Card";
import userController from "@/controllers/userController";
import Chart from "chart.js/auto";

import { useEffect, useState } from "react";

function AdminDashboard() {
  const [totalPost, setTotalPost] = useState();
  const [totalUsers, setTotalUsers] = useState();

  useEffect(init, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Card className={style}>
          <h2>Total de Postagens</h2>
          {totalPost}
        </Card>

        <Card className={style}>
          <h2>Total de Usuários</h2>
          {totalUsers}
        </Card>
      </div>

      <section className="w-[30rem]">
        <canvas id="grafico"></canvas>
      </section>
    </div>
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
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      },
    });
  }

  function init() {
    getTotalPost().then(setTotalPost);
    userController.getTotalUsers().then(setTotalUsers);
    const chart = initChart();

    return () => {
      chart.destroy();
    };
  }
}

async function getTotalPost() {
  const result = await fetch("/api/v1/poststotal", { method: "GET" });
  const data = await result.json();

  console.log(data);
  return data.total;
}

const style = " border-2 border-gray-300 text-xl font-bold min-w-fit";

export default AdminDashboard;
