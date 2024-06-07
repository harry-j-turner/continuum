import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { Modal, Portal, Text, Button, Card } from 'react-native-paper';
import { View } from 'react-native';
import style from './styles';

export interface ConfirmationPopupHandle {
  show: () => void;
}

interface ConfirmationPopupProps {
  title: string;
  body: string;
  onConfirm: () => void;
}

const ConfirmationPopup = forwardRef<ConfirmationPopupHandle, ConfirmationPopupProps>(
  ({ onConfirm, title, body }, ref) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      show: () => setVisible(true)
    }));

    const handleConfirm = () => {
      setVisible(false);
      onConfirm();
    };

    return (
      <Portal>
        <Modal visible={visible} onDismiss={() => setVisible(false)} style={style.container}>
          <Card style={style.popupCard}>
            <Text style={style.popupTitle} variant="titleMedium">
              {title}
            </Text>
            <Text style={style.popupBody} variant="bodyMedium">
              {body}
            </Text>
            <View style={style.buttonContainer}>
              <Button onPress={() => setVisible(false)}>Cancel</Button>
              <Button onPress={handleConfirm} testID="confirmButton">
                Confirm
              </Button>
            </View>
          </Card>
        </Modal>
      </Portal>
    );
  }
);

export default ConfirmationPopup;
