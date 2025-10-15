import CircleAvatar from "@/components/CircleAvatar";
import Header from "@/components/Header";
import FooterLayout from "@/layout/FooterLayout";
import autenticator from "@/models/autenticator";
import User, { UserType } from "@/models/user";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { JSX, useEffect, useState } from "react";
import { PostType } from "@/models/post";
import ListTile from "@/components/ListTile";
import { faDashboard, faPodcast } from "@fortawesome/free-solid-svg-icons";

interface Props {
  user: UserType;
}

async function getUsers() {
  const result = await fetch("http://localhost:3000/api/v1/users", {});
  const users = await result.json();

  return users;
}

async function getPosts() {
  const result = await fetch("http://localhost:3000/api/v1/posts", {});
  const posts = await result.json();
  return posts;
}

function mountUserList(users: UserType[]) {
  return users.map((user) => (
    <div
      key={user.id}
      className="p-2 bg-cyan-600 flex gap-4 items-center rounded text-white"
    >
      <div>{user.name}</div>
      <div>{user.email}</div>
      <div>{user.phone}</div>
    </div>
  ));
}

function mountPostList(posts: PostType[]) {
  console.log(posts);
  return posts.map((post) => (
    <div
      key={post.id}
      className="p-2 bg-cyan-600 flex gap-4 items-center rounded text-white"
    >
      <div>{post.title}</div>
      <div>{post.description}</div>
      <div>{post.valor}</div>
    </div>
  ));
}

function changeContainer(container: JSX.Element[]) {
  return container;
}

const AdministratorPage = ({ user }: Props) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [posts, setPosts] = useState([]);
  const [container, setContainer] = useState<JSX.Element[]>([]);

  useEffect(() => {
    getUsers().then(setUsers);
    getPosts().then(setPosts);
  }, []);

  return (
    <>
      <Header />
      <main className="flex bg-gray-100 flex-1 text-gray-800">
        <section
          id="lista_usuarios"
          className="flex  flex-col min-w-[20rem]  bg-cyan-900 p-2 text-white gap-4"
        >
          <div className="text-center font-bold text-2xl">
            Administrator Page
          </div>
          <span className="bg-cyan-800 h-[0.1rem]"></span>

          <div className="flex gap-2 items-center ">
            <CircleAvatar imagem={user.url} size={5} />
            <div className=" text-xl">{user.name}</div>
          </div>

          <span className="bg-cyan-800 h-[0.1rem]"></span>

          <ul>
            <ListTile
              title="Dashboard"
              icon={faDashboard}
              onClick={() => {
                const r = changeContainer(mountUserList(users));
                setContainer(r);
              }}
            />
            <ListTile
              title="Postagens"
              icon={faPodcast}
              onClick={() => {
                const r = changeContainer(mountPostList(posts));
                setContainer(r);
              }}
            />
          </ul>
        </section>

        <section
          id="container"
          className="flex flex-col gap-1 flex-1 overflow-hidden "
        >
          {container}
        </section>
      </main>
      <FooterLayout />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const token = context.req.cookies.token || null;
  let user;

  if (token == null)
    return { redirect: { destination: "/", permanent: false } };

  try {
    const auth = autenticator.verifyToken(token);
    user = (await User.findById(auth.id))[0];

    if (user.is_admin !== true) throw new Error("User is not admin");

    console.log("User:", user);
  } catch (error) {
    console.log({ error: error });
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)) as UserType,
    },
  };
};

export default AdministratorPage;
