import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../services/articleService";
import type {
  CreateArticleRequest,
  UpdateArticleRequest,
  PaginationParams,
} from "../types/article";

// ===== Query Keys =====

export const articleKeys = {
  all: ["articles"] as const,
  lists: () => [...articleKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...articleKeys.lists(), params] as const,
  details: () => [...articleKeys.all, "detail"] as const,
  detail: (id: number) => [...articleKeys.details(), id] as const,
};

// ===== Queries =====

/** Hook untuk mengambil daftar artikel */
export const useArticles = (params: PaginationParams) => {
  return useQuery({
    queryKey: articleKeys.list(params),
    queryFn: () => getAllArticles(params),
  });
};

/** Hook untuk mengambil detail artikel by ID */
export const useArticle = (id: number) => {
  return useQuery({
    queryKey: articleKeys.detail(id),
    queryFn: () => getArticleById(id),
    enabled: !!id, // hanya fetch jika id ada
  });
};

// ===== Mutations =====

/** Hook untuk membuat artikel baru */
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateArticleRequest) => createArticle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
};

/** Hook untuk mengupdate artikel */
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateArticleRequest;
    }) => updateArticle(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: articleKeys.detail(variables.id),
      });
    },
  });
};

/** Hook untuk menghapus artikel */
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
};
