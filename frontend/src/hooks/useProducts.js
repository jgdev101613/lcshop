import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  uploadImages,
} from "../lib/api";

export const useProducts = () => {
  const result = useQuery({ queryKey: ["products"], queryFn: getAllProducts });
  return result;
};

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: async (productData) => {
      const { files, ...rest } = productData;
      const imageUrls = await uploadImages(files);
      return createProduct({ ...rest, imageUrls });
    },
    onError: (error) => console.log(error),
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useDeleteProduct = (id) => {
  return useMutation({
    mutationFn: () => deleteProduct(id),
    onError: (error) => console.log(error),
  });
};
