import { useMutation, useQuery } from "@tanstack/react-query";
import { createProduct, getAllProducts, uploadImages } from "../lib/api";

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
