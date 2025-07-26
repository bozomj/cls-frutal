import Paginacao from "@/components/paginacao";

interface ProdutosProps<T> {
  postagens: T[];
  paginacao: { limite: number; current: number; maxPage: number };
  Card: React.ComponentType<{ item: T }>;
  next: (n1: number) => void;
  back: (n2: number) => void;
}

function Produtos<T>({
  postagens = [],
  paginacao = { limite: 0, current: 0, maxPage: 0 },
  Card,
  next,
  back,
}: ProdutosProps<T>) {
  return (
    <>
      <div className=" bg-cyan-50 flex flex-col items-center  overflow-x-scroll max-w-full ">
        <a id="pst" href=""></a>

        <section className="flex flex-col gap-4 p-4 w-full h-fit  ">
          {makeItens(postagens)}
        </section>

        <Paginacao paginacao={paginacao} next={next} back={back} />
      </div>
    </>
  );

  function makeItens(items: T[]) {
    if (items.length < 1)
      return [
        <h3 key={1} className="flex justify-center text-gray-700 font-bold">
          Nada encontrado
        </h3>,
      ];

    return items.map((item, v) => <Card item={item} key={`${v}`} />);
  }
}

export default Produtos;
