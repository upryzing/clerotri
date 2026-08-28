import type {Language} from '../src/lib/types';

// string files
import {default as ar} from './strings/ar.json';
import {default as be} from './strings/be.json';
import {default as be_tarask} from './strings/be-tarask.json';
import {default as de} from './strings/de.json';
import {default as en} from './strings/en.json';
import {default as eo} from './strings/eo.json';
import {default as es} from './strings/es.json';
import {default as es_419} from './strings/es-419.json';
import {default as fil} from './strings/fil.json';
import {default as fr} from './strings/fr.json';
import {default as hu} from './strings/hu.json';
import {default as id} from './strings/id.json';
import {default as lv} from './strings/lv.json';
import {default as pl} from './strings/pl.json';
import {default as pt_BR} from './strings/pt-BR.json';
import {default as pt} from './strings/pt.json';
import {default as mwl} from './strings/mwl.json';
import {default as ru} from './strings/ru.json';
import {default as tr} from './strings/tr.json';
import {default as uk} from './strings/uk.json';
import {default as zh_Hans} from './strings/zh-Hans.json';

// resources object passed to i18next
export const resources = {
  ar: {translation: ar},
  be: {translation: be},
  'be-tarask': {translation: be_tarask},
  de: {translation: de},
  en: {translation: en},
  eo: {translation: eo},
  es: {translation: es},
  'es-419': {translation: es_419},
  fil: {translation: fil},
  fr: {translation: fr},
  hu: {translation: hu},
  id: {translation: id},
  lv: {translation: lv},
  pl: {translation: pl},
  'pt-BR': {translation: pt_BR},
  pt: {translation: pt},
  mwl: {translation: mwl},
  ru: {translation: ru},
  tr: {translation: tr},
  uk: {translation: uk},
  'zh-Hans': {translation: zh_Hans},
};

// languages object, used for settings
export const languages: Record<string, Language> = {
  ar: {
    name: 'العربية',
    englishName: 'Arabic',
    emoji: '🇸🇦',
  },
  be: {
    name: 'беларуская',
    englishName: 'Belarusian',
    emoji: '🇧🇾',
  },
  'be-tarask': {
    name: 'беларуская (тарашкевіца)',
    englishName: 'Belarusian (Classical)',
    emoji: '🇧🇾',
  },
  de: {
    name: 'Deutsch (Deutschland)',
    englishName: 'German (Germany)',
    emoji: '🇩🇪',
  },
  en: {
    name: 'English (Traditional)',
    englishName: 'English (UK)',
    emoji: '🇬🇧',
  },
  eo: {name: 'Esperanto', englishName: 'Esperanto', emoji: '🟩'},
  es: {name: 'Español (España)', englishName: 'Spanish (Spain)', emoji: '🇪🇸'},
  'es-419': {
    name: 'Español (América Latina)',
    englishName: 'Spanish (Latin America)',
    emoji: '🇲🇽',
  },
  fil: {
    name: 'Filipino',
    englishName: 'Filipino',
    emoji: '🇵🇭',
  },
  fr: {
    name: 'Français',
    englishName: 'French',
    emoji: '🇫🇷',
  },
  hu: {name: 'Magyar', englishName: 'Hungarian', emoji: '🇭🇺'},
  id: {
    name: 'Bahasa Indonesia',
    englishName: 'Indonesian',
    emoji: '🇮🇩',
  },
  // it: {name: 'Italiano', englishName: 'Italian', emoji: '🇮🇹'},
  lv: {name: 'Latviešu', englishName: 'Latvian', emoji: '🇱🇻'},
  pl: {name: 'Polski', englishName: 'Polish', emoji: '🇵🇱'},
  'pt-BR': {
    name: 'Português (Brasil)',
    englishName: 'Portuguese (Brazil)',
    emoji: '🇧🇷',
  },
  pt: {name: 'Português (Portugal)', englishName: 'Portuguese', emoji: '🇵🇹'},
  mwl: {name: 'Mirandés', englishName: 'Mirandese', emoji: '🇵🇹'},
  ru: {name: 'Русский', englishName: 'Russian', emoji: '🇷🇺'},
  tr: {name: 'Türkçe', englishName: 'Turkish', emoji: '🇹🇷'},
  uk: {name: 'Українська', englishName: 'Ukrainian', emoji: '🇺🇦'},
  'zh-Hans': {
    name: '简体中文',
    englishName: 'Chinese (Simplified)',
    emoji: '🇨🇳',
  },
};
