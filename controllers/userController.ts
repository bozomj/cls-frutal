import autenticator from "@/models/autenticator";

const userController = {
  async getUserLogin() {
    const { result } = await autenticator.isAuthenticated();
    const user = await fetch(`/api/v1/user/id/${result.id}`);
    return await user.json();
  },

  async getPost(initial: number, limit: number) {
    const posts = await fetch(
      `/api/v1/posts/user?initial=${initial}&limit=${limit}`
    );
    return await posts.json();
  },
};

export default userController;
