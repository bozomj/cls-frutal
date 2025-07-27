import Paginacao, { PaginacaoType } from "@/components/Paginacao";

interface ProdutosProps<T> {
  postagens: T[];
  paginacao: PaginacaoType;
  Card: React.ComponentType<{ item: T }>;
  update: (parinacao: PaginacaoType) => void;
}

function Produtos<T>({
  postagens = [],
  paginacao = { limite: 0, current: 0, maxPage: 0, totalItens: 0 },
  Card,
  update,
}: ProdutosProps<T>) {
  return (
    <>
      <div className=" bg-cyan-50 flex flex-col items-center  overflow-x-scroll max-w-full ">
        <a id="pst" href=""></a>
        <section className="flex flex-col gap-4 p-4 w-full h-fit  ">
          {makeItens(postagens)}
        </section>
        <Paginacao paginacao={paginacao} update={update} />
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
