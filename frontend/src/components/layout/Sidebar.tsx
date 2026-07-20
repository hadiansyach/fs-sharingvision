import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const isPostsActive = location.pathname.startsWith("/posts");

  return (
    <nav className="fixed left-0 top-0 h-full w-[280px] bg-surface text-primary font-body-md text-body-md border-r border-outline-variant flex-col py-md hidden md:flex z-40 transition-colors duration-200">
      <div className="px-md pb-lg pt-sm">
        <Link to="/posts" className="block">
          <h1 className="font-headline-md text-headline-md font-bold text-primary">
            ArticleFlow
          </h1>
          <p className="text-on-surface-variant font-label-md mt-xs">
            Editorial Manager
          </p>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-sm px-sm">
          <li>
            <a
              href="#dashboard"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-md px-md py-sm rounded-r-full text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <Link
              to="/posts"
              className={`flex items-center gap-md px-md py-sm rounded-r-full transition-colors duration-200 ${
                isPostsActive
                  ? "bg-primary-container/10 text-primary border-l-4 border-primary font-medium"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined">article</span>
              <span>All Posts</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
