import { create } from 'zustand';
import api from '../libs/axios';

export const useQuizStore = create((set, get) => ({
  data: [],
  isLoading: true,
  error: null,
  page: 1,
  limit: 10,
  totalPage: 0,
  isFetchingNextPage: false,
  isRefetching: false,
  key: '',
  refetch: async () => {
    console.log('refetch');
    set({ isLoading: true });
    set({ page: 1 });
    const { page, limit, key } = get();
    const body = {
      page,
      limit,
      key,
    };
    try {
      const response = await api.post(`/v2/quizzes/search`, body);
      const { items, totalPage } = await response.data.metadata;
      set({ data: items, totalPage, isLoading: false });
    } catch (error) {
      console.log('error', error);
      set({ error, isLoading: false });
    }
  },
  fetchNextPage: async () => {
    set({ isFetchingNextPage: true });
    set({ page: get().page + 1 });
    try {
      // log baseUrl
      const { page, limit, key } = get();
      const body = {
        page,
        limit,
        key,
      };
      const response = await api.post(`/v2/quizzes/search`, body);
      const { items } = await response.data.metadata;
      set((state) => ({
        data: [...state.data, ...items],
        isFetchingNextPage: false,
      }));
    } catch (error) {
      set({ error, isFetchingNextPage: false });
    }
  },
  hasNextPage: () => {
    const { page, totalPage } = get();
    return page < totalPage;
  },
}));
