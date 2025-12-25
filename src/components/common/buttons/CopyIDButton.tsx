import Clipboard from '@react-native-clipboard/clipboard';

import {Text} from '@clerotri/components/common/atoms/Text';
import {NewContextButton} from '@clerotri/components/common/buttons/NewContextButton';
import type {ContextButtonProps} from '@clerotri/lib/types';

export type CopyIDButtonProps = ContextButtonProps & {
  /**
   * The actual ID to be displayed/copied - *not* to be confused with `id`, which is for React itself
   */
  itemID: string;
};

export const CopyIDButton = ({itemID, ...props}: CopyIDButtonProps) => {
  return (
    <NewContextButton
      key={`copy-id-button-${itemID}`}
      icon={{pack: 'regular', name: 'content-copy'}}
      onPress={() => {
        Clipboard.setString(itemID);
      }}
      {...props}>
      <Text>
        Copy ID{' '}
        <Text useNewText colour={'foregroundSecondary'}>
          ({itemID})
        </Text>
      </Text>
    </NewContextButton>
  );
};
