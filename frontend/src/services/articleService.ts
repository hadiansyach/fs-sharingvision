import { api } from "../lib/axios";
import type {
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
  GetAllArticlesResponse,
  PaginationParams,
} from "../types/article";

export const getAllArticles = async (
  params: PaginationParams,
): Promise<GetAllArticlesResponse> => {
  const { data } = await api.get<GetAllArticlesResponse>(
    `/article/${params.limit}/${params.offset}`,
  );
  return data;
};

export const getArticleById = async (id: number): Promise<Article> => {
  const { data } = await api.get<Article>(`/article/${id}`);
  return data;
};

export const createArticle = async (
  payload: CreateArticleRequest,
): Promise<Article> => {
  const { data } = await api.post<Article>("/article/", payload);
  return data;
};

export const updateArticle = async (
  id: number,
  payload: UpdateArticleRequest,
): Promise<Article> => {
  const { data } = await api.put<Article>(`/article/${id}`, payload);
  return data;
};

export const deleteArticle = async (id: number): Promise<void> => {
  await api.delete(`/article/${id}`);
};
