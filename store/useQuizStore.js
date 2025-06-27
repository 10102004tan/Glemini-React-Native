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
  quizRecents: [],
  filter:{
    sort: 'createdAt',
    order: 'desc',
    subjectIds:[]
  },
  setFilter: (filter) => {
    set({ filter });
  },
  clearQuizRecents: () => {
    set({ quizRecents: [] });
  },
  isFetchRecents: false,
  setIsRefetching: (isRefetching) => {
    set({ isRefetching });
  },
  setKey: (key) => {
    set({ key });
  },
  refetch: async () => {
    set({ isLoading: true, data: [], error: null, totalPage: 0, page: 1, isRefetching: true, isFetchingNextPage: false });
    const { page, limit, key,filter} = get();
    const body = {
      page,
      limit,
      key,
      sort: filter.sort,
      order: filter.order,
      subjectIds: filter.subjectIds
    };
    try {
      const response = await api.post(`/v2/quizzes/search`, body);
      const { items, totalPage } = await response.data.metadata;
      set({ data: items, totalPage, isLoading: false,isRefetching: false });
    } catch (error) {
      console.log('error', error);
      set({ error, isLoading: false, isRefetching: false });
    }
  },
  fetchNextPage: async () => {
    console.log('fetchNextPage');
    set({ isFetchingNextPage: true,page: get().page + 1 });
    try {
      // log baseUrl
      const { page, limit, key,filter} = get();
    const body = {
      page,
      limit,
      key,
      sort: filter.sort,
      order: filter.order,
      subjectIds: filter.subjectIds
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
  fetchQuizRecents: async () => {
    set({ quizRecents: [],isFetchRecents: true});
    try {
      const response = await api.get('/v2/quizzes/recent-search');
      set({ quizRecents: response.data.metadata, isFetchRecents: false });
    } catch (error) {
      console.log('error', error);
      set({ error, isLoading: false });
    }
  }
}));
