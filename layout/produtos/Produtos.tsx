import Paginacao from "@/components/Paginacao";
import { PostDBType } from "@/shared/post_types";

interface ProdutosProps<T> {
  postagens: T[];
  Card: React.ComponentType<{ item: T }>;
  className?: string;
}

function Produtos<T>({ postagens = [], Card, className }: ProdutosProps<T>) {
  return (
    <>
      <div
        className={`shadow-sm shadow-gray-400 flex flex-col items-center  flex-1 max-w-full rounded-2xl bg-white ${className}`}
      >
        <section
          className={`grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 p-2  w-full h-fit ${className}`}
        >
          {makeItens(postagens)}
        </section>
      </div>
    </>
  );

  function makeItens(items: T[]) {
    const TotalItems = items.length;
    if (TotalItems < 1)
      return [
        <h2 key={0} className="flex justify-center text-gray-700 font-bold">
          Nada encontrado
        </h2>,
      ];

    return items.map((item, v) => <Card item={item} key={`${v}`} />);
  }
}

export default Produtos;
