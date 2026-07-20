import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { AdminLayout } from "../components/layout/AdminLayout";
import { StatusChip } from "../components/shared/StatusChip";
import { EmptyState } from "../components/shared/EmptyState";
import {
  useArticles,
  useUpdateArticle,
  useDeleteArticle,
} from "../hooks/useArticles";
import { STATUS_TAB_MAP, type Article } from "../types/article";

const AllPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Published" | "Drafts" | "Trashed">("Published");

  // Fetch articles from API
  const {
    data: articles = [],
    isLoading,
    isError,
    refetch,
  } = useArticles({ limit: 100, offset: 0 });

  // Mutations
  const updateMutation = useUpdateArticle();
  const deleteMutation = useDeleteArticle();

  const currentStatus = STATUS_TAB_MAP[activeTab];
  const filteredArticles = articles.filter(
    (article) => article.status === currentStatus
  );

  const handleDelete = (article: Article) => {
    const isTrashedTab = activeTab === "Trashed";
    const actionText = isTrashedTab ? "permanently delete" : "move to trash";

    if (window.confirm(`Are you sure you want to ${actionText} "${article.title}"?`)) {
      if (isTrashedTab) {
        // Hard delete permanently
        deleteMutation.mutate(article.id, {
          onSuccess: () => {
            notifications.show({
              title: "Article Deleted",
              message: `"${article.title}" has been permanently deleted.`,
              color: "green",
            });
          },
          onError: (err: any) => {
            notifications.show({
              title: "Delete Failed",
              message: err.message || "Failed to delete article permanently.",
              color: "red",
            });
          },
        });
      } else {
        // Soft delete: update status to 'thrash'
        updateMutation.mutate(
          {
            id: article.id,
            payload: {
              title: article.title,
              content: article.content,
              category: article.category,
              status: "thrash",
            },
          },
          {
            onSuccess: () => {
              notifications.show({
                title: "Moved to Trash",
                message: `"${article.title}" has been moved to trash.`,
                color: "green",
              });
            },
            onError: (err: any) => {
              notifications.show({
                title: "Action Failed",
                message: err.message || "Failed to move article to trash.",
                color: "red",
              });
            },
          }
        );
      }
    }
  };

  const isMutating = updateMutation.isPending || deleteMutation.isPending;

  return (
    <AdminLayout>
      {/* Header Section */}
      <div className="flex justify-between items-end mb-lg">
        <div>
          <h1 className="font-display text-display text-on-background mb-xs">
            All Posts
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate("/posts/new")}
          className="bg-primary hover:bg-primary/90 text-on-primary px-lg py-sm rounded text-label-md font-label-md flex items-center gap-xs transition-colors shadow-none cursor-pointer"
        >
          <span className="material-symbols-outlined">add</span>
          + Add New
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-outline-variant mb-lg">
        <nav className="-mb-px flex space-x-lg" aria-label="Tabs">
          {(["Published", "Drafts", "Trashed"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-sm px-sm border-b-2 font-label-md text-label-md transition-colors cursor-pointer ${
                  isActive
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm relative min-h-[300px] flex flex-col">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-on-surface-variant font-body-md">Loading articles from API...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center flex-1 py-16">
            <EmptyState
              icon="error"
              message="Failed to load articles from backend. Please try again."
            />
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 bg-primary text-on-primary px-md py-sm rounded font-label-md hover:bg-primary/90 transition-colors"
            >
              Retry Fetching
            </button>
          </div>
        ) : filteredArticles.length > 0 ? (
          <table className="min-w-full divide-y divide-outline-variant">
            <thead className="bg-surface-container-low">
              <tr>
                <th
                  scope="col"
                  className="px-md py-sm text-left font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-md py-sm text-left font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-md py-sm text-right font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface-container-lowest divide-y divide-outline-variant">
              {filteredArticles.map((article) => (
                <tr
                  key={article.id}
                  className="hover:bg-surface-container-low transition-colors"
                >
                  <td className="px-md py-md whitespace-nowrap font-body-md text-body-md text-on-surface font-medium">
                    {article.title}
                  </td>
                  <td className="px-md py-md whitespace-nowrap">
                    <StatusChip label={article.category} />
                  </td>
                  <td className="px-md py-md whitespace-nowrap text-right font-label-md text-label-md">
                    <div className="flex items-center justify-end gap-sm">
                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={() => navigate(`/posts/${article.id}/edit`)}
                        className="text-primary hover:text-primary/80 transition-colors p-xs disabled:opacity-50 cursor-pointer"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          edit
                        </span>
                      </button>
                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={() => handleDelete(article)}
                        className="text-error hover:text-error/80 transition-colors p-xs disabled:opacity-50 cursor-pointer"
                        title={activeTab === "Trashed" ? "Permanently Delete" : "Move to Trash"}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            icon="article"
            message={`No ${activeTab.toLowerCase()} articles found`}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AllPostsPage;
