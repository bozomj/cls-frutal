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

      <div>
        <section
          id="frame-1"
          className="flex flex-auto flex-col gap-2 w-full max-w-[40rem] p-4 bg-gray-100 rounded-2xl shadow-sm shadow-gray-400 my-2"
        >
          <div
            id="frame-2"
            className="bg-gray-300 rounded-3xl flex-auto p-2 relative overflow-hidden"
          >
            <span
              className="block top-0 left-0 absolute z-10 w-full h-full bg-gradient-to-r from-gray-800 via-gray-200  to-gray-800
    bg-[length:200%_200%]
    animate-gradient-x opacity-20"
            ></span>

            <section className="bg-gray-300 h-[20rem] gap-2 rounded-3xl flex overflow-hidden p-2 border-3 border-gray-500 animate-pulse">
              <div className="flex-1 flex flex-col gap-2">
                <span className="flex-1 bg-gray-200 rounded-tl-3xl animate-pulse"></span>
                <span className="flex-1 bg-gray-200 rounded animate-pulse"></span>
                <span className="flex-1 bg-gray-200 rounded-bl-3xl animate-pulse"></span>
              </div>
              <div className="flex-2 bg-gray-200 rounded-r-3xl animate-pulse"></div>
            </section>

            <section id="dados-postagem">
              <div
                id="actions"
                className="flex justify-between items-center py-4"
              >
                <div className="flex items-center gap-2 ">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-2xl rounded-full p-2 w-6 text-gray-500 bg-gray-400  animate-pulse "
                  />

                  <span className="text-[1em] w-30 h-2 bg-gray-400 animate-pulse"></span>
                </div>

                <div className="flex gap-2 items-center text-2xl animate-pulse">
                  <span className="rounded-3xl bg-gray-400 w-10 h-10 "></span>
                  <span className="rounded-3xl bg-gray-400 w-10 h-10  "></span>
                </div>
              </div>

              <div>
                <div className="flex  justify-between items-start flex-col gap-2 animate-pulse">
                  <span className="w-40 h-3 bg-gray-400"></span>
                  <span className="w-80 h-3 bg-gray-400"></span>
                  <span className="w-30 h-3 bg-gray-400"></span>
                </div>

                <div className="border-t-1 border-t-gray-400 py-2 my-4 gap-2 flex flex-col animate-pulse">
                  <span className="w-35 h-3 bg-gray-400 block "></span>
                  <span className="w-80 h-2 bg-gray-400 block "></span>
                  <span className="w-70 h-2 bg-gray-400 block "></span>
                  <span className="w-90 h-2 bg-gray-400 block "></span>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </>
  );
}

export default WirePost;
