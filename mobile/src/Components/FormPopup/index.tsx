import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
  Fragment,
  useCallback
} from 'react';
import { Modal, Portal, Text, Button, Card, TextInput } from 'react-native-paper';
import { View } from 'react-native';
import style from './styles';
import { debounce, set, values } from 'lodash';

export interface FormPopupHandle {
  show: () => void;
}

export type FormPopupBodyTextElement = {
  type: 'text';
  key: string;
  text: string;
};

export type FormPopupBodyInputElement = {
  type: 'input';
  label: string;
  key: string;
  validator?: (value: string) => Promise<string>;
};

export type FormPopupBodyElement = FormPopupBodyTextElement | FormPopupBodyInputElement;

export type FormPopupResponse = {
  [key: string]: string;
};

type FormPopupValidation = {
  [key: string]: string;
};

interface FormPopupProps {
  title: string;
  body: FormPopupBodyElement[];
  onConfirm: (response: FormPopupResponse) => void;
}

// TODO: When user is found, lookup their name and display it in the form.
// TODO: Timesheets should support multiple people.
// TODO: New timesheet shows options to set timesheet window.
// TODO: Timesheet allow link to all users or specific users.

// TODO: New User button and Create Timesheet button.
const FormPopup = forwardRef<FormPopupHandle, FormPopupProps>(({ onConfirm, title, body }, ref) => {
  const [visible, setVisible] = useState(false);
  const [response, setResponse] = useState<FormPopupResponse>({});
  const [validation, setValidation] = useState<FormPopupValidation>({});
  const [isValidationPending, setIsValidationPending] = useState(false);

  useImperativeHandle(ref, () => ({
    show: () => setVisible(true)
  }));

  const handleConfirm = () => {
    setVisible(false);
    onConfirm(response);
  };
  // TODO: Doublecheck Android calendar and time pickers,

  const validateInput = useCallback(
    (key: string, value: string) => {
      const bodyElement = body.find((element) => element.type === 'input' && element.key === key);

      if (bodyElement?.type === 'input') {
        if (bodyElement.validator) {
          bodyElement.validator(value).then((message) => {
            setValidation((currentValidation) => ({
              ...currentValidation,
              [key]: message
            }));
          });
        }
      }
      setIsValidationPending(false);
    },
    [body, validation]
  );

  const debouncedValidateInput = useCallback(debounce(validateInput, 500), [validateInput]);

  useEffect(() => {
    if (visible) {
      body.forEach((element) => {
        if (element.type === 'input' && element.validator) {
          setIsValidationPending(true);
          element.validator('').then((message) => {
            setValidation((currentValidation) => ({
              ...currentValidation,
              [element.key]: message
            }));
            setIsValidationPending(false);
          });
        }
      });
    }
  }, [visible, body]);

  const handleInputChange = (key: string, value: string) => {
    setResponse({ ...response, [key]: value });
    setIsValidationPending(true);
    debouncedValidateInput(key, value);
  };

  const confirmButtonDisabled =
    isValidationPending || values(validation).some((message) => message.length > 0);

  return (
    <Portal>
      <Modal visible={visible} onDismiss={() => setVisible(false)} style={style.container}>
        <Card style={style.popupCard}>
          <Text style={style.popupTitle} variant="titleMedium">
            {title}
          </Text>
          {body.map((element, index) => {
            if (element.type === 'text') {
              return (
                <Text key={index} style={style.popupText} variant="bodyMedium">
                  {element.text}
                </Text>
              );
            } else if (element.type === 'input') {
              return (
                <View key={index} style={{ paddingTop: 10 }}>
                  <Text style={style.inputLabel} variant="bodyMedium">
                    {element.label}
                  </Text>
                  <TextInput
                    mode="outlined"
                    dense={true}
                    testID={`input-${element.key}`}
                    error={!!validation[element.key]}
                    onChangeText={(text) => handleInputChange(element.key, text)}
                  />

                  {/* Validation message */}
                  {validation[element.key] && (
                    <Text style={style.validationText} variant="bodyMedium">
                      {validation[element.key]}
                    </Text>
                  )}
                </View>
              );
            }
          })}

          <View style={style.buttonContainer}>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
            <Button onPress={handleConfirm} testID="confirmButton" disabled={confirmButtonDisabled}>
              Confirm
            </Button>
          </View>
        </Card>
      </Modal>
    </Portal>
  );
});

export default FormPopup;
