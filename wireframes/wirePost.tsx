import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function WirePost() {
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

      <section
        id="frame-1"
        className="flex flex-auto flex-col gap-2 w-full max-w-7xl p-4 bg-gray-100 rounded-2xl shadow-sm shadow-gray-400 my-2"
      >
        <div className="flex items-center justify-between gap-2 ">
          <FontAwesomeIcon
            icon={faUser}
            className="text-2xl rounded-full p-2 w-6 text-gray-500 bg-gray-400  animate-pulse "
          />

          <span className="text-[1em] w-30 h-2 bg-gray-400 animate-pulse"></span>
        </div>
        <div className="flex items-center text-xl animate-pulse w-full">
          <span className="rounded-xl bg-gray-300 w-full h-0.5  "></span>
        </div>
        <div
          id="frame-2"
          className=" bg-gray-300 rounded-3xl   flex p-2 relative overflow-hidden"
        >
          <div className="flex gap-4 w-full flex-col md:flex-row">
            <div className="min-w-1/2">
              <span
                className="block top-0 left-0 absolute z-10 w-full h-full bg-gradient-to-r from-gray-800 via-gray-200  to-gray-800
    bg-[length:200%_200%]
    animate-gradient-x opacity-20"
              ></span>
              <section className="bg-gray-300 h-[20rem] gap-2 rounded-3xl flex overflow-hidden p-2 border-2 border-slate-400 animate-pulse">
                <div className="flex-1 flex flex-col gap-2">
                  <span className="flex-1 bg-gray-200 rounded-tl-3xl animate-pulse"></span>
                  <span className="flex-1 bg-gray-200 rounded animate-pulse"></span>
                  <span className="flex-1 bg-gray-200 rounded-bl-3xl animate-pulse"></span>
                </div>
                <div className="flex-2 bg-gray-200 rounded-r-3xl animate-pulse"></div>
              </section>
            </div>

            <section id="dados-postagem" className="w-full p-2">
              <div
                id="actions"
                className="flex justify-between items-center py-4 w-full "
              >
                <div className="flex gap-2 items-center text-2xl animate-pulse w-full">
                  <span className="rounded-xl bg-gray-400 w-[60%] h-3  "></span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex  justify-between items-start flex-col gap-2 animate-pulse bg-gray-400 w-full p-4 rounded-xl">
                  <span className="w-20 h-2 bg-gray-500"></span>
                  <span className="w-40 h-3 bg-gray-500"></span>
                </div>
                <div className="flex flex-col gap-2 ">
                  <div className="flex gap-2 items-center text-2xl animate-pulse w-full">
                    <span className="rounded-xl bg-gray-400 w-[40%] h-3  "></span>
                  </div>
                  <div className=" flex  justify-between items-start flex-col gap-2 animate-pulse bg-gray-400 w-full p-4 rounded-xl">
                    <span className="w-80 h-2 bg-gray-500"></span>
                    <span className="w-60 h-2 bg-gray-500"></span>
                    <span className="w-54 h-2 bg-gray-500"></span>
                    <br />
                  </div>
                </div>
                <div className="flex gap-2 items-center text-2xl animate-pulse w-full">
                  <span className="rounded-md bg-gray-400 w-[90%] h-10  "></span>
                  <span className="rounded-md bg-gray-400 w-[10%] h-10  "></span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

export default WirePost;
