import { PostDetailType } from "@/shared/post_types";
import utils from "@/utils";
import Image from "next/image";

interface ProductCardProps {
  item: PostDetailType;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, className }) => {
  return (
    <div
      className={`
        bg-white border-2 border-gray-200  p-1 rounded-md flex justify-center transition duration-400
         hover:border-gray-300  text-gray-800 ${className} 
        `}
    >
      <div className="flex flex-col w-full overflow-hidden">
        <span className="text-xs text-right"></span>
        <a href={`/posts/${item.title.replaceAll(" ", "-")}-i.${item.id}`}>
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

          <div className="py-2 overflow-hidden">
            <h2 className=" block whitespace-wrap text-gray-900 truncate">
              {item.title ?? ""}
            </h2>
            <span className="h-5 text-green-700 block text-base font-medium">
              <span className="text-xs">R$:</span>
              {utils.formatarMoeda(item.valor.toString())}
            </span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
