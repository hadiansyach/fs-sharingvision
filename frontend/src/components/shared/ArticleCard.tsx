import React from "react";

export interface ArticleCardData {
  id?: number;
  title: string;
  category: string;
  content: string;
  created_date?: string;
  createdAt?: string;
  imageUrl?: string;
  authorName?: string;
  authorAvatar?: string;
}

export interface ArticleCardProps {
  article: ArticleCardData;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  // Strip HTML tags for clean excerpt view
  const plainTextExcerpt = article.content.replace(/<[^>]*>?/gm, "").trim() || "No content summary available.";

  // Format date or use default
  const formattedDate = article.created_date || article.createdAt
    ? new Date(article.created_date || article.createdAt!).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Oct 24, 2023";

  const defaultBgImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuA922E9GWvV2R6-GaElSHOcZiTSj9TQwoasQm6C1Hlay6owrNVCaT3ZxND4ZXAZjqzDobilI5zSQlSI9W0JCdSa-1iYr2YNSdU42SKV5CrPGj7CGV0g4O6wIzvbi4PxEgCigpCq9sJpMBzUgc3dS97L89pDkVg-nNzEXuWjffsgebiIbC9yVWyqzB2cAmewMcyvtwT_W9XXnmFn7bJNPEsVBVEabtGY1O9Gb7i3f1bFRqXhaRgN4-wUYg";

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden group cursor-pointer hover:border-primary transition-colors duration-200 flex flex-col h-full shadow-sm">
      <div
        className="bg-cover bg-center w-full h-48 border-b border-outline-variant group-hover:opacity-90 transition-opacity"
        style={{ backgroundImage: `url('${article.imageUrl || defaultBgImage}')` }}
      />
      <div className="p-md flex flex-col flex-1">
        <div className="flex items-center justify-between mb-sm">
          <span className="bg-surface-container-low text-primary font-label-sm text-label-sm px-2 py-1 rounded-full border border-primary-fixed capitalize">
            {article.category || "General"}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            {formattedDate}
          </span>
        </div>
        <h2 className="font-title-lg text-title-lg text-on-background mb-sm group-hover:text-primary transition-colors">
          {article.title}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-md flex-1">
          {plainTextExcerpt}
        </p>
        <div className="mt-auto flex items-center gap-sm pt-sm border-t border-outline-variant/40">
          {article.authorAvatar ? (
            <img
              src={article.authorAvatar}
              alt={article.authorName || "Author"}
              className="w-8 h-8 rounded-full object-cover border border-outline-variant"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-sm font-bold border border-outline-variant">
              {(article.authorName || "ArticleFlow Team").substring(0, 2).toUpperCase()}
            </div>
          )}
          <span className="font-label-sm text-label-sm text-on-surface font-medium">
            {article.authorName || "ArticleFlow Team"}
          </span>
        </div>
      </div>
    </article>
  );
};
