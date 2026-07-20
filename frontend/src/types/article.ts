// ===== Request Types =====

/** Body untuk Create Article (POST /article/) */
export interface CreateArticleRequest {
  title: string;
  content: string;
  category: string;
  status: "publish" | "draft" | "thrash";
}

/** Body untuk Update Article (PUT /article/:id) */
export interface UpdateArticleRequest {
  title: string;
  content: string;
  category: string;
  status: "publish" | "draft" | "thrash";
}

// ===== Response Types =====

/** Representasi satu Article dari API */
export interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  status: "publish" | "draft" | "thrash";
  created_date: string; // ISO date string
  updated_date: string; // ISO date string
}

/** Response dari GET /article/:limit/:offset */
export type GetAllArticlesResponse = Article[];

/** Response dari GET /article/:id */
export type GetArticleByIdResponse = Article;

/** Response dari POST /article/ */
export type CreateArticleResponse = Article;

/** Response dari PUT /article/:id */
export type UpdateArticleResponse = Article;

// ===== Pagination Params =====

export interface PaginationParams {
  limit: number;
  offset: number;
}

// ===== Article Status =====

export type ArticleStatus = "publish" | "draft" | "thrash";

// ===== Tab Mapping =====

export const STATUS_TAB_MAP: Record<string, ArticleStatus> = {
  Published: "publish",
  Drafts: "draft",
  Trashed: "thrash",
};
