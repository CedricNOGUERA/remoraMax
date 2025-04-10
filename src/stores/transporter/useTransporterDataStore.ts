import { create } from 'zustand'
import { statusType } from '../../definitions/statusType'
import { createJSONStorage, persist } from 'zustand/middleware'

export type TransportState = {
  title: string
  status: statusType
  borderColor: string
  // selectedIdCompany: number
  setTransporterDataStore: (data: TransportDataType) => void
  resetAll: () => void
}
export type TransportDataType = {
  title: string
  status: statusType
  borderColor: string
  // selectedIdCompany: number
}
// const dataStore = userStore((state: UserState) => state)
const useTransporterDataStore = create(
  persist<TransportState>(
    (set) => ({
      title: 'OFFICIALISE',
      status: 'OFFICIALISE',
      borderColor: 'green',
      // selectedIdCompany: dataStore?.company?.[0]?.id_company || 0,

      setTransporterDataStore: (data: TransportDataType) =>
        set((state: TransportState) => {
          return {
            ...state,
            title: data.title,
            status: data.status,
            borderColor: data.borderColor,
            // selectedIdCompany: data?.selectedIdCompany || state.selectedIdCompany,
          }
        }),

      resetAll: () => set({ title: 'OFFICIALISE', status: 'OFFICIALISE', borderColor: 'green' }),
    }),
    {
      name: 'transport', // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage sessionStorage' is used
    }
  )
)

export default useTransporterDataStore
