import { create } from 'zustand';

export const useModal = create((set, get) => ({
  title: 'Modal Title',
  content: 'This is the modal content.',
  isVisible: false,
  // state lưu loại modal, có thể là "info", "warning", "error", v.v.
  modalType: 'info',
  // state lưu các thông tin khác nếu cần
  // như callback, dữ liệu liên quan đến modal, v.v.
  modalData: null,

  showModal: ({
    title,
    content,
    buttonLeft = {
      text: 'OK',
      onPress: () => get().hideModal(),
    },
    modalType = 'info', // mặc định là "info"
    modalData = null, // dữ liệu liên quan đến modal
  }) => set({ title, content, isVisible: true, modalType, modalData, buttonLeft }),
  hideModal: () =>
    set({
      isVisible: false,
      title: 'Modal Title',
      content: 'This is the modal content.',
      modalType: 'info',
      modalData: null,
    }),
  toggleModal: () => set((state) => ({ isVisible: !state.isVisible })),
  buttonLeft: {
    text: 'Cancel',
    onPress: () => get().hideModal(),
  },
}));
