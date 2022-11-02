import create from 'zustand'

export const useStore = create(set => ({
    selectNode: null,
    setSelectNode: (node) => set(state => ({ selectNode: node })),
}))