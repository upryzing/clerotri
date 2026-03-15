import {createContext, type Dispatch, type SetStateAction} from 'react';

import type {Member} from 'revolt.js';

export const SelectionContext = createContext<{
  selectionMode: boolean;
  setSelectionMode: Dispatch<SetStateAction<boolean>>;
}>({selectionMode: false, setSelectionMode: () => {}});

export const SelectedMembersContext = createContext<{
  selectedMembers: Member[];
  setSelectedMembers: Dispatch<SetStateAction<Member[]>>;
}>({selectedMembers: [], setSelectedMembers: () => {}});
