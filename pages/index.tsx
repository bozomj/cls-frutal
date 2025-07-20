import Header from "@/components/Header";
import Produtos from "@/layout/produtos/Produtos";
import { useSearchParams } from "next/navigation";

interface HomeProps {
  title?: string;
}

const Home: React.FC<HomeProps> = () => {
  const search = useSearchParams().get("q") ?? "";
  const initial = parseInt(useSearchParams().get("initial") ?? "0");
  console.log(initial);

  return (
    <>
      <Header />
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center scroll-smooth ">
        <section className="md:max-w-[100rem] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full"
            src={
              "https://m.media-amazon.com/images/G/32/kindle/email/2025/03_Marco/Pagina_Recomendacoes_para_voce/1500x200_Narrow.jpg"
            }
            alt={""}
          />
          <Produtos pesquisa={search.trim()} />
        </section>

        <footer className="min-h-[10rem] min-w-full bg-cyan-950 p-4 flex flex-col">
          <span className="text-center text-cyan-700">
            CLF-Frutal Classificados &copy;
          </span>
          <div className="flex-1 flex items-center">
            <a href="https://www.assistechso.com.br" target="_blank">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-[150px] md:w-[200px]"
                src="https://www.assistechso.com.br/_next/image?url=%2Fimg%2Flogo.png&w=256&q=75"
                alt=""
              />
            </a>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;
