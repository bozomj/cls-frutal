import { PostDetailType } from "@/shared/post_types";
import utils from "@/utils";
import Image from "next/image";

interface ProductCardProps {
  item: PostDetailType;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  className,
}: ProductCardProps) => {
  return (
    <div
      className={`
        bg-gray-100 border-2 border-gray-100  p-1 rounded-lg flex justify-center transition duration-400
         hover:border-gray-300  text-gray-800 ${className} 
        `}
    >
      <div className="flex flex-col w-full overflow-hidden">
        <span className="text-xs text-right"></span>
        <a href={`/posts/${item.id}`} target="_blank">
          <div className="  flex flex-1 justify-center h-40 relative ">
            <Image
              className="object-contain"
              src={utils.getUrlImageR2(item.imageurl!)}
              alt={""}
              fill
              sizes="100"
              loading="eager"
            />
          </div>

          <div className="flex-1 flex  text-gray-900  w-[100%]  overflow-hidden flex-col py-2">
            <h2 className=" font-bold block whitespace-wrap text-gray-900 truncate">
              {item.title ?? ""}
            </h2>
            <span className="h-5 text-green-700 font-bold block text-lg">
              <span className="text-xs">R$: </span>
              {utils.formatarMoeda(item.valor.toString())}
            </span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
