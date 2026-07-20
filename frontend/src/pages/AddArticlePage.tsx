import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { notifications } from "@mantine/notifications";
import { AdminLayout } from "../components/layout/AdminLayout";
import { EmptyState } from "../components/shared/EmptyState";
import {
  useArticle,
  useCreateArticle,
  useUpdateArticle,
} from "../hooks/useArticles";
import type { ArticleStatus } from "../types/article";
import { Select, TextInput } from "@mantine/core";

const AddArticlePage: React.FC = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  // Queries & Mutations
  const {
    data: article,
    isLoading: isArticleLoading,
    isError: isArticleError,
  } = useArticle(Number(id));

  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // StarterKit v3 already includes Underline — only disable built-in Link
        // so we can use Mantine's enhanced Link extension instead
        link: false,
      }),
      Link, // Mantine's Link extension (from @mantine/tiptap)
      Image,
      Placeholder.configure({ placeholder: "Start writing your article..." }),
    ],
    content,
    editable: true,
    shouldRerenderOnTransaction: true, // Required for toolbar active states & typing feedback
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Populate form when article data is fetched in edit mode
  useEffect(() => {
    if (isEditMode && article && editor) {
      setTitle(article.title);
      setCategory(article.category);
      setContent(article.content || "");
      if (editor.getHTML() !== (article.content || "")) {
        editor.commands.setContent(article.content || "");
      }
    }
  }, [isEditMode, article, editor]);

  // const handleAddImage = () => {
  //   const url = window.prompt("Enter image URL:");
  //   if (url && editor) {
  //     editor.chain().focus().setImage({ src: url }).run();
  //   }
  // };

  const handleSubmit = (status: ArticleStatus) => {
    if (!title.trim()) {
      notifications.show({
        title: "Validation Error",
        message: "Article title is required.",
        color: "red",
      });
      return;
    }

    if (!category) {
      notifications.show({
        title: "Validation Error",
        message: "Please select a category.",
        color: "red",
      });
      return;
    }

    const contentHtml = (content || editor?.getHTML() || "").trim();
    if (!contentHtml || contentHtml === "<p></p>") {
      notifications.show({
        title: "Validation Error",
        message: "Article content cannot be empty.",
        color: "red",
      });
      return;
    }

    const payload = {
      title,
      content: contentHtml,
      category,
      status,
    };

    if (isEditMode) {
      updateMutation.mutate(
        { id: Number(id), payload },
        {
          onSuccess: () => {
            notifications.show({
              title: "Article Updated",
              message: `"${title}" has been updated successfully.`,
              color: "green",
            });
            navigate("/posts");
          },
          onError: (error: any) => {
            notifications.show({
              title: "Update Failed",
              message:
                error.message || "An error occurred while updating article.",
              color: "red",
            });
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          notifications.show({
            title: status === "publish" ? "Article Published" : "Draft Saved",
            message: `"${title}" has been ${
              status === "publish" ? "published" : "saved to drafts"
            } successfully.`,
            color: "green",
          });
          navigate("/posts");
        },
        onError: (error: any) => {
          notifications.show({
            title: "Creation Failed",
            message:
              error.message || "An error occurred while creating article.",
            color: "red",
          });
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate("/posts")}
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md mb-lg cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Back to All Posts
        </button>

        {/* Header */}
        <div className="mb-xl">
          <h1 className="font-bold text-display text-on-surface mb-2">
            {isEditMode ? "Edit Article" : "Add New Article"}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {isEditMode
              ? "Update existing content and publication status."
              : "Create a new piece of content for your publication."}
          </p>
        </div>

        {/* Loading / Error States in Edit Mode */}
        {isEditMode && isArticleLoading ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-xl flex flex-col items-center justify-center min-h-[350px]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-on-surface-variant font-body-md">
              Loading article details...
            </p>
          </div>
        ) : isEditMode && isArticleError ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-xl flex flex-col items-center justify-center min-h-[350px]">
            <EmptyState
              icon="error"
              message="Failed to load article data for editing."
            />
            <button
              type="button"
              onClick={() => navigate("/posts")}
              className="mt-4 bg-primary text-on-primary px-md py-sm rounded font-label-md hover:bg-primary/90 transition-colors"
            >
              Return to All Posts
            </button>
          </div>
        ) : (
          /* Form Card */
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg md:p-xl shadow-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit("publish");
              }}
              className="flex flex-col gap-lg"
            >
              {/* Title Field */}
              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="article-title"
                  className="font-label-md text-label-md text-on-surface font-medium"
                >
                  Title <span className="text-error">*</span>
                </label>
                <TextInput
                  id="article-title"
                  type="text"
                  value={title}
                  disabled={isPending}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter article title"
                  required
                  size="md"
                />
              </div>

              {/* Category Field */}
              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="article-category"
                  className="font-label-md text-label-md text-on-surface font-medium"
                >
                  Category <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <Select
                    id="article-category"
                    required
                    value={category}
                    disabled={isPending}
                    onChange={(val) => setCategory(val)}
                    data={[
                      { value: "", label: "Select a category" },
                      { value: "Technology", label: "Technology" },
                      { value: "Design", label: "Design" },
                      { value: "Business", label: "Business" },
                      { value: "Lifestyle", label: "Lifestyle" },
                      { value: "Science", label: "Science" },
                      { value: "Politics", label: "Politics" },
                      { value: "Process", label: "Process" },
                      { value: "Infrastructure", label: "Infrastructure" },
                      { value: "Strategy", label: "Strategy" },
                      { value: "Editorial", label: "Editorial" },
                    ]}
                    allowDeselect={false}
                    size="md"
                  />
                </div>
              </div>

              {/* Content Field */}
              <div className="flex flex-col gap-xs flex-1">
                <label className="font-label-md text-label-md text-on-surface font-medium">
                  Content <span className="text-error">*</span>
                </label>

                <RichTextEditor editor={editor}>
                  <RichTextEditor.Toolbar
                    sticky
                    stickyOffset="var(--docs-header-height)"
                  >
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold />
                      <RichTextEditor.Italic />
                      <RichTextEditor.Underline />
                      <RichTextEditor.Strikethrough />
                      <RichTextEditor.ClearFormatting />
                      <RichTextEditor.Highlight />
                      <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.H1 />
                      <RichTextEditor.H2 />
                      <RichTextEditor.H3 />
                      <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Blockquote />
                      <RichTextEditor.Hr />
                      <RichTextEditor.BulletList />
                      <RichTextEditor.OrderedList />
                      <RichTextEditor.Subscript />
                      <RichTextEditor.Superscript />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Link />
                      <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.AlignLeft />
                      <RichTextEditor.AlignCenter />
                      <RichTextEditor.AlignJustify />
                      <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Undo />
                      <RichTextEditor.Redo />
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>

                  <RichTextEditor.Content />
                </RichTextEditor>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-sm mt-md pt-lg border-t border-outline-variant">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleSubmit("draft")}
                  className="px-md py-2 rounded font-label-md text-label-md border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isPending
                    ? "Saving..."
                    : isEditMode
                      ? "Update Draft"
                      : "Draft"}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-md py-2 rounded font-label-md text-label-md bg-primary-container text-on-primary border border-transparent hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    send
                  </span>
                  {isPending
                    ? "Publishing..."
                    : isEditMode
                      ? "Update & Publish"
                      : "Publish"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AddArticlePage;
