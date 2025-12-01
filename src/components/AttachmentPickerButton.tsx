import {type Dispatch, type SetStateAction, useContext} from 'react';
import {Pressable} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {type DocumentPickerResponse} from '@react-native-documents/picker';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {pickDocument, fileTypes} from '@clerotri/crossplat/DocumentPicker';
import {commonValues, ThemeContext} from '@clerotri/lib/themes';
import {showToast} from '@clerotri/lib/utils';

export const AttachmentPickerButton = ({
  attachments,
  setAttachments,
}: {
  attachments: DocumentPickerResponse[];
  setAttachments: Dispatch<SetStateAction<DocumentPickerResponse[]>>;
}) => {
  const {currentTheme} = useContext(ThemeContext);

  return (
    <Pressable
      style={localStyles.attachmentsButton}
      onPress={async () => {
        if (attachments.length >= 5) {
          return;
        }
        try {
          const [res] = await pickDocument({
            type: [fileTypes.allFiles],
          });
          let tooBig = false;
          if (res.size && res.size > 20000000) {
            showToast('Attachments must be less than 20MB!');
            tooBig = true;
          }
          if (!tooBig) {
            let isDuplicate = false;
            for (const a of attachments) {
              if (a.uri === res.uri) {
                console.log(
                  `[MESSAGEBOX] Not pushing duplicate attachment ${res.name} (${res.uri})`,
                );
                isDuplicate = true;
              }
            }

            if (res.uri && !isDuplicate) {
              console.log(
                `[MESSAGEBOX] Pushing attachment ${res.name} (${res.uri})`,
              );
              setAttachments(existingAttachments => [
                ...existingAttachments,
                res,
              ]);
              console.log(attachments);
            }
          }
        } catch (error) {
          console.log(`[ADDATTACHMENTBUTTON] Error: ${error}`);
        }
      }}>
      <MaterialIcon
        name="add-circle"
        size={24}
        color={
          attachments.length >= 5
            ? currentTheme.foregroundSecondary
            : currentTheme.foregroundPrimary
        }
      />
    </Pressable>
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
  attachmentsButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: commonValues.sizes.medium,
    marginStart: 0,
    marginEnd: commonValues.sizes.medium,
    backgroundColor: currentTheme.messageBox,
  },
}));
