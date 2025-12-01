import {StyleSheet} from 'react-native-unistyles';

import {commonValues} from '@clerotri/lib/themes';

export const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    marginRight: commonValues.sizes.medium,
  },
  messagesView: {
    padding: 10,
    paddingHorizontal: 5,
    flex: 1,
  },
});
