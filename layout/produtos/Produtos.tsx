import OwnerGuard from "@/components/guards/OwnerGuard";
import Paginacao from "@/components/Paginacao";
import { PostDBType } from "@/shared/post_types";

interface ProdutosProps<T> {
  postagens: T[];
  Card: React.ComponentType<{ item: T }>;
  className?: string;
}

function Produtos<T>({ postagens = [], Card, className }: ProdutosProps<T>) {
  return (
    <div
      className={`shadow-sm shadow-gray-400 flex flex-col items-center p-4 flex-1 max-w-full rounded-2xl bg-white ${className}`}
    >
      {postagens.length > 0 ? (
        <section
          className={`
            justify-center
            grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(150px,197px))] gap-2 p-2  w-full h-fit ${className}`}
        >
          {makeItens(postagens)}
        </section>
      ) : (
        <h2 className="flex   w-full justify-center text-gray-700 font-bold">
          <span>Nada encontrado</span>
        </h2>
      )}
    </div>
  );

  function makeItens(items: T[]) {
    const TotalItems = items.length;
    if (TotalItems < 1) return [];

    return items.map((item, v) => <Card item={item} key={`${v}`} />);
  }
}

export default Produtos;
