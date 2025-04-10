import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type selectedIdCompanyState = {
  selectedIdCompany: number | undefined
  setSelectedIdCompanyStore: (data: selectedIdCompanyType) => void
  resetSelectedId: () => void
}

export type selectedIdCompanyType = {
  selectedIdCompany: number | undefined
}

const useSelectedIdCompanyStore = create(
  persist<selectedIdCompanyState>(
    (set) => ({
      selectedIdCompany: undefined,
   

      setSelectedIdCompanyStore: (data: selectedIdCompanyType) =>
        set((state: selectedIdCompanyState) => {
          return {
            ...state,
            selectedIdCompany: data.selectedIdCompany,
           
          }
        }),

      resetSelectedId: () => set({ selectedIdCompany: undefined}),
    }),
    {
      name: 'selectedId', // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage sessionStorage' is used
    }
  )
)

export default useSelectedIdCompanyStore
