import { create } from 'zustand';
import ConnaissementServices from '../services/connaissements/ConnaissementServices';
import { ResultConnaissementType } from '../definitions/ConnaissementType';



interface NomenclatureState {
  // connaissementDataStore: ResultConnaissementType[] | null;
  connaissementDataStore: Record<string, ResultConnaissementType[]> | null;
  loading: boolean;
  error: string | null;
  fetchConnaissement: (tokenTab: string[], currentPage: number, itemPerPage: number, status: string) => Promise<void>;
}

const useTransportConnaissementStore = create<NomenclatureState>((set) => ({
  // connaissementDataStore: null,
  connaissementDataStore: {},
  loading: false,
  error: null,

  fetchConnaissement: async (tokenTab: string[], currentPage: number, itemPerPage: number, status: string) => {
    set({ loading: true, error: null }) // Indique le début du chargement
    let newSortData: any[] = []
    let hasMorePages = true
    let page = 0

    try {
      const responses = await Promise.all(
        tokenTab.map((token: string) => {
          // while(hasMorePages){
        //  ConnaissementServices.getTransporterByStatus(
        //       token,
        //       page,
        //       itemPerPage,
        //       status
        //     )
            // if(response?.data?.empty){
            //   hasMorePages = false
            //   return response
            // }else{
            //   page++
            //   return response 
            // }
          // }
        }
        )
      )
  newSortData = responses.flatMap((response: any) => response?.data?.content || []);
  const sortedData = newSortData.sort((a: any, b: any) => b.id - a.id);
  
  set((state) => ({
    connaissementDataStore: {
      ...state.connaissementDataStore,
      [status]: sortedData, // Ajoute ou remplace les données pour ce statut
    },
    loading: false,
  }));
    } catch (error) {
      console.error('Error fetching nomenclature:', error);
      set({ error: 'Failed to fetch nomenclature data.', loading: false });
    }
  }
}));

export default useTransportConnaissementStore;