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
import Modal from "@/components/Modal";
import { PostType } from "@/models/post";
import utils from "@/utils";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

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
  function linkFone(phone: string) {
    return `https://wa.me/55${phone}?text=[Classificados Frutal] - fiquei interessado em seu produto `;
  }
  return (
    <>
      <header>
        <Header titulo="Dashboard" />
      </header>
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between  items-center">
        <div className="flex-1 max-h-[250px] flex w-full">
          <section
            tabIndex={0}
            className=" z-[999] group bg-cyan-950 max-w-[5rem] overflow-x-hidden   p-4 flex items-start flex-col gap-2 hover:max-w-[25rem]   transition-all duration-500 border-r-2 
        focus:max-w-[25rem]
        fixed h-full
        
        "
          >
            <ul className="flex flex-col  gap-2">
              {/* <div className="flex flex-col  gap-2"> */}
              <span className="group-focus:w-[8rem] group-focus:h-[8rem] rounded-full  w-[3rem] h-[3rem] group-hover:block   bg-white   group-hover:w-[8rem] group-hover:h-[8rem] transition-all duration-500"></span>

              <ListTile
                title={user.name ?? ""}
                icon={faUser}
                url={`/profile/${user.id}`}
                onClick={() => {}}
              />
              {/* </div> */}
              <li>
                <ListTile
                  title={user.email ?? ""}
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
            <div className="flex flex-col gap-2">
              <div className="p-4 rounded-md gap-2 bg-cyan-800  flex items-center  outline-2 outline-cyan-100">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-3xl outline-1 p-2 rounded-md outline-cyan-100"
                />
                <span>Cadastrar Produto</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {listPost.map((item: PostType, v) => {
                return (
                  <article
                    key={v}
                    className="  bg-gray-100 relative  p-2 rounded-2xl flex justify-center"
                  >
                    <div className="flex flex-col w-full  overflow-hidden h-full gap-2 ">
                      <div className="flex justify-center bg-gray-200 rounded-2xl overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="flex-1   bg-gray-200   min-h-[250px]"
                          src={utils.getUrlImage(item.imageurl)}
                          alt={""}
                        />
                      </div>
                      <div className=" flex text-gray-900 gap-2 truncate overflow-hidden flex-col">
                        <span className="text-2xl">{item.title ?? ""}</span>
                        <span className="">{item.description ?? ""}</span>
                        <span className="">R$: {item.valor}</span>

                        <div className=" flex items-center gap-4">
                          <a
                            href={linkFone(item.phone)}
                            target="_blank"
                            aria-label="Whatsapp"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon
                              icon={faWhatsapp}
                              className="text-3xl text-green-900"
                            />
                          </a>
                          <a href="#" aria-label="Email">
                            <FontAwesomeIcon
                              icon={faPhone}
                              className="text-1xl text-blue-500"
                            />
                            <span>{item.email}</span>
                          </a>
                        </div>
                      </div>
                      <button
                        aria-label="Deletar post"
                        type="button"
                        className="bg-red-800  cursor-pointer font-bold w-3/6 self-end rounded p-1 hover:bg-red-600"
                        onClick={async () => deletePostId(item.id ?? "")}
                      >
                        Deletar
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
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
    console.log(id);
    const response = await fetch(`/api/v1/user`);
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

  try {
    const auth = autenticator.verifyToken(token);
    console.log({ message: auth });
    return {
      props: {
        ctx: auth.id,
      },
    };
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
}
