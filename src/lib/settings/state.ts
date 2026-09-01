import {createContext} from 'react';
import type {SettingsSection} from '@clerotri/lib/types';

export const SettingsSectionContext = createContext<{
  section: SettingsSection;
  setSection: (section: SettingsSection) => void;
}>({section: null, setSection: () => {}});
