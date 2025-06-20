import {useContext, useMemo} from 'react';
import {StyleSheet, Text} from 'react-native';

import BottomSheetCore, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {observer} from 'mobx-react-lite';

import {commonValues, Theme, ThemeContext} from '@clerotri/lib/themes';

export const BottomSheet = observer(
  ({
    sheetRef,
    children,
    onChange,
    outerScroll,
  }: {
    sheetRef: any;
    children: any;
    onChange?: any;
    outerScroll?: 'auto' | 'none' | 'custom'; 
  }) => {
    const {currentTheme} = useContext(ThemeContext);
    const localStyles = useMemo(
      () => generateLocalStyles(currentTheme),
      [currentTheme],
    );

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
        onChange={onChange}
        enableContentPanningGesture={outerScroll != 'none'}>
        {outerScroll == 'none' ? (
          <BottomSheetView style={{ flexDirection: 'column', flex: 1 }}>{children}</BottomSheetView>
        ) : outerScroll == 'custom' ? (
          <>{children}</>
        ) : (
          <BottomSheetScrollView>{children}</BottomSheetScrollView>
        )}
      </BottomSheetCore>
    );
  },
);

const generateLocalStyles = (currentTheme: Theme) => {
  return StyleSheet.create({
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
  });
};
