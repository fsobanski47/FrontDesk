import { useQuery, useMutation } from "@tanstack/react-query";

export function useHttp() {
  const request = async <T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Request failed");
    }

    try {
      return (await response.json()) as T;
    } catch {
      return (await response.text()) as T;
    }
  };

  const useGetQuery = <T>(
    queryKey: any[],
    url: string,
    enabled = true,
    staleTime = 30_000
  ) =>
    useQuery<T>({
      queryKey,
      queryFn: () => request<T>(url),
      enabled,
      staleTime,
    });

  const usePostMutation = <T, U>(url: string) =>
    useMutation<U, Error, T>({
      mutationFn: (body: T) =>
        request<U>(url, {
          method: "POST",
          body: JSON.stringify(body),
        }),
    });

  const usePutMutation = <T, U>(url: string) =>
    useMutation<U, Error, T>({
      mutationFn: (body: T) =>
        request<U>(url, {
          method: "PUT",
          body: JSON.stringify(body),
        }),
    });

  const useDeleteMutation = <T>(url: string) =>
    useMutation<T>({
      mutationFn: () =>
        request<T>(url, {
          method: "DELETE",
        }),
    });

  return {
    useGetQuery,
    usePostMutation,
    usePutMutation,
    useDeleteMutation,
  };
}
