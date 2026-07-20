import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import App from "./App";

import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Notifications position="top-right" />
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>
);
