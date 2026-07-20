import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Select } from "@mantine/core";
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
  const [statusFilter, setStatusFilter] = useState<
    "all" | "publish" | "draft" | "thrash"
  >("publish");
  const offset = (currentPage - 1) * LIMIT;

  const {
    data: articles = [],
    isLoading,
    isError,
    refetch,
  } = useArticles({ limit: LIMIT, offset });

  // Filter articles based on selected status dropdown
  const filteredArticles = articles.filter((a) =>
    statusFilter === "all" ? true : a.status === statusFilter,
  );

  const totalPages =
    articles.length === LIMIT ? currentPage + 1 : Math.max(1, currentPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (
    newStatus: "all" | "publish" | "draft" | "thrash",
  ) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };

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
        <div className="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div className="text-center md:text-left">
            <h1 className="font-display font-bold text-display text-on-background mb-sm">
              Latest Articles
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Explore our newest published thoughts, insights, and editorial
              features. Stay updated with the latest trends.
            </p>
          </div>

          {/* Status Filter Dropdown using Mantine Select */}
          <div className="w-full md:w-48">
            <Select
              label="Filter Status"
              value={statusFilter}
              onChange={(val) =>
                handleFilterChange(
                  (val || "all") as "all" | "publish" | "draft" | "thrash",
                )
              }
              data={[
                { value: "all", label: "All Status" },
                { value: "publish", label: "Published" },
                { value: "draft", label: "Drafts" },
                { value: "thrash", label: "Trashed" },
              ]}
              allowDeselect={false}
              size="sm"
            />
          </div>
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
              message="Failed to load articles. Please check your connection."
            />
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 bg-primary text-on-primary px-md py-sm rounded font-label-md hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredArticles.length > 0 ? (
          <>
            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mb-xl">
              {filteredArticles.map((article) => {
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
            {(totalPages > 1 || currentPage > 1) && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="py-16 my-auto flex flex-col items-center justify-center">
            <EmptyState
              icon="article"
              message={
                currentPage > 1
                  ? `No more ${statusFilter === "all" ? "articles" : statusFilter} on this page.`
                  : `No ${statusFilter === "all" ? "articles" : statusFilter} available at the moment.`
              }
            />
            {currentPage > 1 && (
              <div className="mt-md">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
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
