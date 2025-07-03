import Post from "@/models/post";

describe("teste GET na tabela posts", () => {
  it("Teste por pesquisa", async () => {
    const posts = await Post.search("cablo");

    expect(posts).toEqual(expect.any(Array));
  });

  it("teste api pesquisa post", async () => {
    const posts = await fetch("http://localhost:3000/api/v1/posts?search=qual");

    console.log(await posts.json());
  });
});
