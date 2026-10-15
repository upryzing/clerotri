import {View} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import Clipboard from '@react-native-clipboard/clipboard';

import {Button, Text} from '@clerotri/components/common/atoms';
import {LineSeparator} from '@clerotri/components/layout';
import {CLEROTRI_EMAIL, OPEN_ISSUES} from '@clerotri/lib/consts';
import {APP_VERSION} from '@clerotri/lib/metadata';
import {commonValues} from '@clerotri/lib/themes';
import {openUrl} from '@clerotri/lib/utils';

function generateEmailLink (error: string) {
 return `${CLEROTRI_EMAIL}?subject=[BUG] Error message&body=[Replace the bracketed text, then remove this line!]

Description: [describe the bug here]

Steps to reproduce:
1. [Open a menu]
2. [Tap this button]
3. [Enter this text]

----

Error message: ${error}
App version: v${APP_VERSION}`
}

export function ErrorMessage({
  error,
  resetErrorBoundary,
}: {
  error: any;
  resetErrorBoundary: Function;
}) {
  const errorMessage = `${error}`;

  console.error(`[APP] Uncaught error: ${errorMessage}`);
  return (
    <View style={localStyles.container}>
      <View style={localStyles.innerContainer}>
        <View style={localStyles.textContainer}>
          <Text style={[localStyles.text, localStyles.header]}>
            OOPSIE WOOPSIE!! {'UwU'}
          </Text>
          <Text style={localStyles.text}>
            We made a fucky wucky!! A wittle fucko boingo! The code monkeys at
            our headquarters are working VEWY HAWD to fix this! {'>w<'}
          </Text>
          <Text style={localStyles.text}>
            On a more serious note, please let us know that you experienced the
            following error:
          </Text>
        </View>
        <View style={localStyles.errorMessageBox}>
          <Text useNewText font={'JetBrains Mono'} colour={'error'}>
            {errorMessage}
          </Text>
        </View>
        <View style={localStyles.buttons}>
          <Button
            disableDeprecatedMargin
            onPress={() => {
              Clipboard.setString(errorMessage);
            }}>
            <Text>Copy error message</Text>
          </Button>
          <LineSeparator style={localStyles.separator} />
          <Button
            disableDeprecatedMargin
            onPress={() => {
              openUrl(OPEN_ISSUES);
            }}>
            <Text>Report on GitHub</Text>
          </Button>
          <Button
            disableDeprecatedMargin
            onPress={() => {
              openUrl(generateEmailLink(error));
            }}>
            <Text>Report via email</Text>
          </Button>
          <LineSeparator style={localStyles.separator} />
          <Button
            disableDeprecatedMargin
            onPress={() => {
              resetErrorBoundary();
            }}>
            <Text>Reload app</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create(currentTheme => ({
  container: {
    flex: 1,
    backgroundColor: currentTheme.backgroundPrimary,
    padding: commonValues.sizes.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    maxWidth: 800,
  },
  textContainer: {
    gap: commonValues.sizes.medium,
  },
  text: {
    textAlign: 'center',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  errorMessageBox: {
    backgroundColor: currentTheme.background,
    borderRadius: commonValues.sizes.medium,
    marginVertical: commonValues.sizes.xl,
    padding: commonValues.sizes.xl,
  },
  buttons: {
    gap: commonValues.sizes.medium,
  },
  separator: {
    marginBlock: commonValues.sizes.xs,
    marginInline: commonValues.sizes.medium,
  },
}));
