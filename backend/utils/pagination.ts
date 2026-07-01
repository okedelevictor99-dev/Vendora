// src/utils/paginate.ts

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export function getPaginationOptions(query: {
  page?: string | number;
  limit?: string | number;
}): PaginationOptions {
  const page = Math.max(1, parseInt(String(query.page ?? 1), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? 10), 10)));

  return { page, limit };
}

export function buildPaginationMeta(
  total: number,
  options: PaginationOptions
): PaginationMeta {
  const { page, limit } = options;
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export function getSkip(options: PaginationOptions): number {
  return (options.page - 1) * options.limit;
}