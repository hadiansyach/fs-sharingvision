import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArticleCard,
  type ArticleCardData,
} from "../components/shared/ArticleCard";
import { Pagination } from "../components/shared/Pagination";
import { EmptyState } from "../components/shared/EmptyState";
import { useArticles } from "../hooks/useArticles";

const LIMIT = 6;

const PreviewPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: articles = [],
    isLoading,
    isError,
    refetch,
  } = useArticles({ limit: 100, offset: 0 });

  // Filter only published articles for public preview
  const publishedArticles = articles.filter((a) => a.status === "publish");
  const totalPages = Math.max(1, Math.ceil(publishedArticles.length / LIMIT));

  const currentArticles = publishedArticles.slice(
    (currentPage - 1) * LIMIT,
    currentPage * LIMIT,
  );

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md">
      {/* Simple Top Navbar for Public View */}
      <header className="bg-surface-container-lowest border-b border-outline-variant w-full z-10 sticky top-0 h-16 flex items-center px-margin-mobile md:px-margin-desktop shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link to="/preview" className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary font-bold text-2xl">
              menu_book
            </span>
            <span className="font-headline-md text-headline-md font-bold text-primary hover:opacity-80 transition-opacity">
              ArticleFlow
            </span>
          </Link>
          <nav className="hidden md:flex gap-lg items-center">
            <Link
              to="/preview"
              className="font-label-md text-label-md text-primary font-bold border-b-2 border-primary py-1"
            >
              Latest Articles
            </Link>
            <Link
              to="/posts"
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors ml-md px-sm py-xs border border-outline-variant rounded hover:bg-surface-container-high"
            >
              Admin Dashboard →
            </Link>
          </nav>
          <button
            type="button"
            className="md:hidden text-on-surface-variant p-sm hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col">
        <div className="mb-xl text-center md:text-left">
          <h1 className="font-display font-bold text-display text-on-background mb-sm">
            Latest Articles
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Explore our newest published thoughts, insights, and editorial
            features. Stay updated with the latest trends.
          </p>
        </div>

        {/* Loading / Error / Grid Display */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 my-auto">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-on-surface-variant font-body-md">
              Loading latest articles...
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 my-auto">
            <EmptyState
              icon="error"
              message="Failed to load published articles. Please check your connection."
            />
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 bg-primary text-on-primary px-md py-sm rounded font-label-md hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : publishedArticles.length > 0 ? (
          <>
            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mb-xl">
              {currentArticles.map((article) => {
                const cardData: ArticleCardData = {
                  id: article.id,
                  title: article.title,
                  category: article.category,
                  createdAt: article.created_date,
                  content: article.content,
                  authorName: "ArticleFlow Team",
                };
                return <ArticleCard key={article.id} article={cardData} />;
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="py-16 my-auto">
            <EmptyState
              icon="article"
              message="No published articles available at the moment."
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant py-lg mt-auto w-full">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="font-label-sm text-label-sm text-on-surface-variant">
            © 2023 ArticleFlow. All rights reserved.
          </div>
          <div className="flex gap-md">
            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PreviewPage;
