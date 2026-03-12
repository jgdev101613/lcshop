import api from "./axios";

// USERS API
export const syncUser = async (userData) => {
  const { data } = await api.post("/users/sync", userData);
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

export const updateProduct = async ({ id, ...updateData }) => {
  const { data } = await api.put(`/products/${id}`, updateData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// COMMENTS API
export const createComment = async ({ productId, content }) => {
  const { data } = await api.post(`/comments/${productId}`, content);
  return data;
};

export const deleteComment = async ({ commentId }) => {
  const { data } = await api.delete(`/comments/${commentId}`);
  return data;
};

// COMMENTS REPLY API
export const createCommentReply = async ({ commentId, content }) => {
  const { data } = await api.post(`/comment-reply/${commentId}`, content);
  return data;
};

export const deleteCommentReply = async ({ commendReplyId }) => {
  const { data } = await api.delete(`/comment-reply/${commendReplyId}`);
  return data;
};
