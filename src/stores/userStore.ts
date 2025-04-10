

import {create} from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CompanyStoreType = {
  id_company: number |undefined
  name: string
  numero_tahiti: string
  access_token: string
  created_at: string
  updated_at: string
}

interface pivotType {
  model_type: string
  model_id: number
  role_id: number
}

export type roleNameType = 'user' | 'transporteur' | 'comptable' | 'admin' | 'super_admin'

export type roleStoreType = {
        "id": number
        "name": roleNameType
        "guard_name": string
        "created_at": string
        "updated_at": string
        "pivot": pivotType
}

export type UserState = {
  id: string | null;
  name: string | null;
  roles: roleStoreType[] | null;
  email: string | null;
  token: string | null;
  company: CompanyStoreType[];
  id_company: number | undefined ;
  name_company: string | object | null;
  access_token :string;
  authLogin: (
    id: string | null,
    name: string | null,
    roles: roleStoreType[] | null,
    email: string | null,
    token: string,
    company: CompanyStoreType[],
    id_company: number | undefined,
    name_company: string | object | null,
    access_token: string,
  ) => void
  authLogout: () => void;
};

const userStore = create(
  persist<UserState>(
    (set) => ({
      // initial state
      id: null,
      name: null,
      roles: null,
      email: null,
      token: '',
      company: [],
      id_company: undefined,
      name_company: null,
      access_token: '',

      // methods for manipulating state
      authLogin: (
        id: string | null,
        name: string | null,
        roles: roleStoreType[] | null,
        email: string | null,
        token: string,
        company: CompanyStoreType[],
        id_company: number | undefined,
        name_company: string | object | null,
        access_token: string,
      ) =>
        set((state: UserState) => ({
          id: id !== null ? id : state.id,
          name: name !== null ? name : state.name,
          roles: roles !== null ? roles : state.roles,
          email: email !== null ? email : state.email,
          token: token !== '' ? token : state.token,
          company: company !== null ? company : state.company,
          id_company: id_company !== null ? id_company : state.id_company,
          name_company: name_company !== null ? name_company : state.name_company,
          access_token: access_token !== '' ? access_token : state.access_token,
        })),
      authLogout: () =>
        set(() => ({
          id: null,
          name: null,
          roles: null,
          email: null,
          token: '',
          company: [],
          id_company: undefined,
          name_company: null,
          access_token: '',
        })),
    }),
    {
      name: "userLog", // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage sessionStorage' is used
    }
  )
);

export default userStore;