import Card from "@/components/Card";

import { JSX, useEffect, useState } from "react";

function AdminDashboard(): JSX.Element {
  const [totalPost, setTotalPost] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    getTotalPost().then(setTotalPost);
    getTotalUsers().then(setTotalUsers);
  }, []);

  return (
    <div className="flex gap-2">
      <Card className=" border-2 border-gray-300 text-xl">
        <h2>Total de Postagens</h2>
        {totalPost}
      </Card>
      <Card className=" border-2 border-gray-300 text-xl">
        <h2>Total de Usuários</h2>
        {totalUsers}
      </Card>
    </div>
  );
}

async function getTotalUsers() {
  const result = await fetch("/api/v1/users/total", { method: "GET" });
  const data = await result.json();

  console.log("usuarios: ", data);
  return data.total;
}

async function getTotalPost() {
  const result = await fetch("/api/v1/poststotal", { method: "GET" });
  const data = await result.json();

  console.log(data);
  return data.total;
}

export default AdminDashboard;
