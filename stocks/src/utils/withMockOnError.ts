export type ApiFunction<T> = (params?: any) => Promise<{ data: T }>;

export interface MockOptions<T> {
  mockData: T;
}

export function withMockOnError<T>(
  apiFunc: ApiFunction<T>,
  mockOptions: MockOptions<T>
): ApiFunction<T> {
  return async (...args: any[]) => {
    try {
      return await (apiFunc as any)(...args);
    } catch (error: any) {
        return { data: mockOptions.mockData };
    }
  };
}