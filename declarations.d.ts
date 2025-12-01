import {themes} from '@clerotri/lib/themes'

type Themes = typeof themes

declare module 'react-native-unistyles' {
    export interface UnistylesThemes extends Themes {}
}

declare module '*.svg' {
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
