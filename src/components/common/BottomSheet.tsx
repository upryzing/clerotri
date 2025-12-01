import {useMemo} from 'react';
import {StyleSheet} from 'react-native-unistyles';
import {observer} from 'mobx-react-lite';

import BottomSheetCore, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {commonValues} from '@clerotri/lib/themes';

export const BottomSheet = observer(
  ({
    sheetRef,
    children,
    onChange,
  }: {
    sheetRef: any;
    children: any;
    onChange?: any;
  }) => {
    const insets = useSafeAreaInsets();

    const snapPoints = useMemo(() => ['50%', '70%', '90%'], []);

    return (
      <BottomSheetCore
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={BottomSheetBackdrop}
        style={localStyles.sheet}
        backgroundStyle={localStyles.sheetBackground}
        handleIndicatorStyle={localStyles.handleIndicator}
        onChange={onChange}>
        <BottomSheetScrollView
          contentContainerStyle={{flexGrow: 1, paddingBlockEnd: insets.bottom}}>
          {children}
        </BottomSheetScrollView>
      </BottomSheetCore>
    );
  },
);

const localStyles = StyleSheet.create(currentTheme => ({
  sheet: {
    margin: 'auto',
    maxWidth: 800,
  },
  sheetBackground: {
    backgroundColor: currentTheme.backgroundSecondary,
  },
  handleIndicator: {
    backgroundColor: currentTheme.foregroundPrimary,
    width: '25%',
    padding: 3,
    marginVertical: commonValues.sizes.medium,
  },
}));
