import { useEffect, useState } from "react";

import { useRouter } from "next/router";

async function getPost(id) {
  const res = await fetch(`http://localhost:3000/api/v1/posts/${id}`);
  return await res.json();
}

export default function DetailsPostPage() {
  const { id } = useRouter().query;
  const [item, setItem] = useState({
    id: "",
    title: "",
    valor: "",
    createdAt: "",
  });

  useEffect(() => {
    if (!id) return;

    getPost(id).then((v) => {
      setItem(v[0]);
    });
  }, [id]);

  return (
    <a
      href={`/posts/${item.id}`}
      className="cursor-pointer md:max-w-[250px] bg-gray-100  md:min-w-[250px] min-w-[220px] max-w-10/12  p-2 rounded-2xl flex justify-center hover:bg-gray-300"
    >
      <div className="flex flex-col w-full overflow-hidden h-full gap-2 ">
        <span
          className="flex-1  block bg-contain bg-no-repeat bg-center  bg-gray-200 rounded-2xl min-h-[250px]"
          //   style={
          //     // {
          //     //   backgroundImage: `url(/uploads/${getFileName(item.url || "")})`,
          //     //   ,
          //     // }
          //   }
        ></span>

        <div className=" flex text-gray-900 gap-2 w-[100%] truncate overflow-hidden flex-col">
          <span className="h-5 block">{item.title ?? ""}</span>
          <span className="h-5 block">R$: {item.valor}</span>
          <div className=" flex items-center gap-4">
            <a
              href={`https://wa.me/55/?text=[Classificados Frutal] - fiquei interessado em seu produto \n`}
              target="_blank"
            >
              {/* <FontAwesomeIcon
                  icon={faWhatsapp}
                  className="text-3xl text-green-900"
                /> */}
            </a>
            <a href="#">
              {/* <FontAwesomeIcon
                  icon={faPhone}
                  className="text-1xl text-blue-500"
                /> */}
              {` ${item.createdAt}`}
            </a>
          </div>
        </div>
      </div>
    </a>
  );
}
