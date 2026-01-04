import { PostDetailType } from "@/shared/post_types";
import PrimitiveWire from "./primitive";

interface ProductCardDashboardProps {
  item: PostDetailType;
  className?: string;
}

const WireProductCardDashboard: React.FC<ProductCardDashboardProps> = ({}) => {
  return (
    <>
      <style>
        {`
  @keyframes gradient-x {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
      
    }
  }

  .animate-gradient-x {
    animation: gradient-x 3s ease infinite;
  }
`}
      </style>

      <article
        className={`bg-gray-200 relative flex-col text-white gap-2 p-2 rounded-2xl flex justify-center border-2 
      border-gray-400  
       `}
      >
        <div className="flex  justify-between items-center">
          <span className="text-gray-800 h-4 w-1/3">
            <PrimitiveWire />
          </span>
          <div id="list-actions" className="flex justify-end gap-4">
            <span className="w-10 h-4">
              <PrimitiveWire />
            </span>
            <span className="w-10 h-4">
              <PrimitiveWire />
            </span>
          </div>
        </div>

        <div className="flex w-full  overflow-hidden h-full gap-2 ">
          <div className="bg-gray-200 rounded-xl h-20 relative min-w-1/3">
            <PrimitiveWire />
          </div>

          <div className=" flex text-gray-900 flex-col relative min-w-2/3 gap-2">
            <span className=" h-4 w-6/10 ">
              <PrimitiveWire />
            </span>

            <span className=" h-4 w-8/10 ">
              <PrimitiveWire />
            </span>

            <span className=" h-4 w-4/10 ">
              <PrimitiveWire />
            </span>

            <span className=" h-4 w-4/10 self-end">
              <PrimitiveWire />
            </span>
          </div>
        </div>
      </article>
    </>
  );
};

export default WireProductCardDashboard;
