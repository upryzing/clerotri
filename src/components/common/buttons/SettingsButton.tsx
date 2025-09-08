import {useContext} from 'react';

import {NewContextButton} from '@clerotri/components/common/buttons/NewContextButton';
import {ThemeContext} from '@clerotri/lib/themes';
import type {ContextButtonProps} from '@clerotri/lib/types';

type SettingsButtonProps = ContextButtonProps & {
  menu: 'app' | 'app-other' | 'server';
  section: string;
};

export const SettingsButton = ({
  menu,
  section,
  ...props
}: SettingsButtonProps) => {
  const {currentTheme} = useContext(ThemeContext);

  return (
    <NewContextButton
      backgroundColor={
        props.backgroundColor ?? currentTheme.backgroundSecondary
      }
      textString={
        props.textString ??
        `app.${menu === 'server' ? 'servers.settings' : 'settings_menu'}.${section === 'delete_server' ? 'delete_server' : menu === 'app-other' ? `other.${section}` : `${section}.title`}`
      }
      {...props}
    />
  );
};
