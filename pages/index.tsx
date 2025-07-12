import Header from "@/components/Header";
import Produtos from "@/layout/produtos/Produtos";

import { useState } from "react";

interface HomeProps {
  title?: string;
}

const Home: React.FC<HomeProps> = () => {
  const [search, setSearch] = useState("");

  return (
    <>
      <header className="">
        <Header
          onSubmit={async (e) => {
            setSearch(e);
          }}
        />
      </header>
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center">
        <div className="md:max-w-[100rem] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              "https://m.media-amazon.com/images/G/32/kindle/email/2025/03_Marco/Pagina_Recomendacoes_para_voce/1500x200_Narrow.jpg"
            }
            alt={""}
          />
          <Produtos pesquisa={search.trim()} />
          <section className="flex  flex-wrap bg-gray-50 p-4 gap-4 justify-center "></section>
        </div>

        <footer className="min-h-[10rem] min-w-full bg-cyan-950 p-4 flex flex-col">
          <p className="text-center text-cyan-700">
            CLF-Frutal Classificados &copy;
          </p>
          <section className="flex-1 flex items-center">
            <a href="https://www.assistechso.com.br">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-[150px] md:w-[200px]"
                src="https://www.assistechso.com.br/_next/image?url=%2Fimg%2Flogo.png&w=256&q=75"
                alt=""
              />
            </a>
          </section>
        </footer>
      </main>
    </>
  );
};

export default Home;
