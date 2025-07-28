import Paginacao from "@/components/Paginacao";

interface ProdutosProps<T> {
  postagens: T[];
  Card: React.ComponentType<{ item: T }>;
  className?: string;
}

function Produtos<T>({ postagens = [], Card, className }: ProdutosProps<T>) {
  return (
    <>
      <div
        className={`shadow-sm shadow-gray-400 flex flex-col items-center   max-w-full rounded-2xl bg-white ${className}`}
      >
        <a id="pst" href=""></a>
        <section className="flex flex-col gap-4 p-4 w-full h-fit">
          {makeItens(postagens)}
        </section>
        <Paginacao />
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
