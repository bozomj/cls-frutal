import autenticator from "@/models/autenticator";
import {
  faCalendar,
  faEnvelope,
  faUser,
  faClipboard,
} from "@fortawesome/free-regular-svg-icons";

import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ListTile from "@/components/ListTile";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { faRemove } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/Modal";
import { PostType } from "@/models/post";

type UserType = {
  id?: string;
  name?: string;
  email?: string;
  title?: string;
  createdAt?: string;
};

async function getMyPost() {
  const myPosts = await fetch(`api/v1/posts/user`, {
    method: "GET",
  });

  const pst = await myPosts.json();
  console.log({ posts: pst });
  return pst;
}
function getFileName(path: string): string {
  return path?.split(/[/\\]/).pop() || "";
}

async function deletePost(id: string, callback: (e: []) => void) {
  const result = await fetch(`api/v1/posts/${id}`, {
    method: "DELETE",
  });
  console.log(await result.json());

  callback(await getMyPost());
}

function Dashboard({ ctx }: { ctx: string }) {
  const [user, setUser] = useState<UserType>({});
  const [listPost, setPosts] = useState([]);
  const [showmodal, showModal] = useState(<></>);

  useEffect(() => {
    getUser(ctx);
    getMyPost().then((e) => setPosts(e));
  }, [ctx]);

  return (
    <>
      <header>
        <Header titulo="Dashboard" />
      </header>
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between  items-center">
        <div className="flex-1  flex w-full">
          <section
            tabIndex={0}
            className=" z-[999] group bg-cyan-950 max-w-[5rem] overflow-x-hidden   p-4 flex items-start flex-col gap-2 hover:max-w-[25rem]   transition-all duration-500 border-r-2 
        focus:max-w-[25rem]
        fixed h-full"
          >
            <div className="flex flex-col  gap-2">
              <span className="group-focus:w-[8rem] group-focus:h-[8rem] rounded-full  w-[3rem] h-[3rem] group-hover:block   bg-white   group-hover:w-[8rem] group-hover:h-[8rem] transition-all duration-500"></span>
              <span className="flex gap-2 p-3  group-hover:flex">
                <FontAwesomeIcon icon={faUser} className="text-2xl" />

                <h2 className="text-white whitespace-nowrap  opacity-0 group-focus:opacity-100 transition-all duration-500 group-hover:block group-hover:opacity-100">
                  <a href={`/profile/${user.id}`}>{user.name ?? ""}</a>
                </h2>
              </span>
            </div>
            <ul>
              <li>
                <ListTile
                  title={user.email || ""}
                  icon={faEnvelope}
                  onClick={() => {}}
                />
              </li>

              <li>
                <ListTile
                  title={user.createdAt ?? ""}
                  icon={faCalendar}
                  onClick={() => {}}
                />
              </li>
              <li>
                <ListTile
                  title="Produtos"
                  icon={faClipboard}
                  onClick={() => {}}
                  url="/newpost"
                />
              </li>
            </ul>
          </section>

          <section className="flex-1 p-2  pl-[5.5rem] flex flex-col gap-2 w-full">
            {listPost.map((item: PostType, v) => {
              return (
                <div
                  key={v}
                  className="  bg-gray-100 relative  p-2 rounded-2xl flex justify-center"
                >
                  <span
                    className="  bg-red-700 rounded-full h-8 w-8 right-2 top-[-0.2rem] flex justify-center items-center absolute"
                    onClick={async () => {
                      // await deletePost(item.id, setPosts);
                      deletePostId(item.id ?? "");
                    }}
                  >
                    <FontAwesomeIcon icon={faRemove} />
                  </span>
                  <div className="flex flex-col w-full  overflow-hidden h-full gap-2 ">
                    <span
                      className=" bg-contain bg-no-repeat bg-center  bg-gray-200 rounded-2xl min-h-[250px]"
                      style={{
                        backgroundImage: `url(/uploads/${getFileName(
                          item.url || ""
                        )})`,
                      }}
                    ></span>

                    <div className=" flex text-gray-900 gap-2 truncate overflow-hidden flex-col">
                      <span className="h-5 block">
                        {item.description ?? ""}
                      </span>
                      <span className="h-5 block">R$: {item.valor}</span>
                      <div className=" flex items-center gap-4">
                        <a
                          href={`https://wa.me/55${item.phone}?text=[Classificados Frutal] - fiquei interessado em seu produto `}
                          target="_blank"
                        >
                          <FontAwesomeIcon
                            icon={faWhatsapp}
                            className="text-3xl text-green-900"
                          />
                        </a>
                        <a href="#">
                          <FontAwesomeIcon
                            icon={faPhone}
                            className="text-1xl text-blue-500"
                          />
                          {` ${item.email}`}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </main>
      {showmodal}
    </>
  );

  async function deletePostId(id: string) {
    showModal(
      <Modal
        show={true}
        onConfirm={async function (): Promise<void> {
          await deletePost(id, setPosts);
          showModal(<></>);
        }}
        onClose={function (): void {
          showModal(<></>);
        }}
      >
        {"Deseja deletar este post?"}
      </Modal>
    );
  }

  async function getUser(id: string) {
    const response = await fetch(`/api/v1/user/id/${id}`);
    setUser(await response.json());
  }
}

//executa antes de carregar
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => redirectNotToken(context, "/login");

export default Dashboard;

function redirectNotToken(ctx: GetServerSidePropsContext, destination: string) {
  const token = ctx.req.cookies.token || "";
  console.log(token);
  let auth = null;
  try {
    auth = autenticator.verifyToken(token);
  } catch (error) {
    console.log({
      redirect: error,
    });

    return {
      redirect: {
        destination: destination,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ctx: auth.id,
    },
  };
}
