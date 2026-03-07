import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import {StyleSheet} from 'react-native-unistyles';

import {commonValues} from '@clerotri/lib/themes';

// omit the regular `style` prop to avoid confusion
type ModalContainerProps = Omit<ViewProps, 'style'> & {
  outerStyle?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
};

export const ModalContainer = (props: ModalContainerProps) => {
  return (
    <View style={[localStyles.outerContainer, props.outerStyle]}>
      <View style={[localStyles.innerContainer, props.outerStyle]}>
        {props.children}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create(currentTheme => ({
  outerContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: '80%',
    borderRadius: commonValues.sizes.medium,
    padding: 20,
    backgroundColor: currentTheme.backgroundPrimary,
    justifyContent: 'center',
    alignSelf: 'center',
  },
}));
