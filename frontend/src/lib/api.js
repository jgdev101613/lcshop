import api from "./axios";

// USERS API
export const syncUser = async (userData) => {
  const { data } = await api.post("/users/sync", userData);
  return data;
};

export const updateUserApi = async (userData) => {
  const { data } = await api.patch("/users/update", userData);
  return data;
};

export const getUserApi = async () => {
  const { data } = await api.get("/users/me");
  return data;
};

// PRODUCTS API
export const getAllProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const getMyProduct = async () => {
  const { data } = await api.get("/products/my");
  return data;
};

export const uploadImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const { data } = await api.post("/products/upload", formData);
  return data.imageUrls;
};

export const createProduct = async (productData) => {
  const { data } = await api.post("/products", productData);
  return data;
};

export const updateProduct = async ({
  id,
  files,
  existingImages,
  ...updateData
}) => {
  let newImageUrls = [];

  if (files && files.length > 0) {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const { data } = await api.post("/products/upload", formData);
    newImageUrls = data.imageUrls;
  }

  const imageUrls = [...(existingImages ?? []), ...newImageUrls];

  const { data } = await api.put(`/products/${id}`, {
    ...updateData,
    imageUrls,
  });
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// Comments API
export const createComment = async ({ productId, content }) => {
  const { data } = await api.post(`/comments/${productId}`, { content });
  return data;
};

export const deleteComment = async ({ commentId }) => {
  const { data } = await api.delete(`/comments/${commentId}`);
  return data;
};

// COMMENTS REPLY API
export const createCommentReply = async ({ commentId, content }) => {
  const { data } = await api.post(`/comment-reply/${commentId}`, { content });
  return data;
};

export const deleteCommentReply = async ({ commentReplyId }) => {
  const { data } = await api.delete(`/comment-reply/${commentReplyId}`);
  return data;
};

// Likes
export const likePostApi = async (productId) => {
  const { data } = await api.post("/likes/posts/like", { productId });
  return data;
};

export const unlikePostApi = async (productId) => {
  const { data } = await api.post("/likes/posts/unlike", { productId });
  return data;
};

export const likeCommentApi = async (commentId) => {
  const { data } = await api.post("/likes/comments/like", { commentId });
  return data;
};

export const unlikeCommentApi = async (commentId) => {
  const { data } = await api.post("/likes/comments/unlike", { commentId });
  return data;
};

export const likeReplyApi = async (replyId) => {
  const { data } = await api.post("/likes/replies/like", { replyId });
  return data;
};

export const unlikeReplyApi = async (replyId) => {
  const { data } = await api.post("/likes/replies/unlike", { replyId });
  return data;
};
