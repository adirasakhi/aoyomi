import { QueryClient } from "@tanstack/react-query";

let client: QueryClient | null = null;

// Single QueryClient for the app. Cache-first to respect the 30 req/min budget.
export function getQueryClient() {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          gcTime: 30 * 60 * 1000,
          retry: 1,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        },
      },
    });
  }
  return client;
}
