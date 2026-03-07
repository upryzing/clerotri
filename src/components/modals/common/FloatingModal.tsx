import {Modal, type ModalProps} from 'react-native';

export const FloatingModal = (props: ModalProps) => {
  return (
    <Modal
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      backdropColor={'#00000020'}
      {...props}
    />
  );
};
