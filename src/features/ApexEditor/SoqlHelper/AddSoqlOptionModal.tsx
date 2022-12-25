import { useState } from "react";
import {
  Button,
  FormElement,
  Input,
  Modal,
  Spacer,
  Text,
} from "@nextui-org/react";

import { type SoqlQueryOption, setOptionsInLocalStorage } from "./utils";

type AddSoqlOptionModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  options: SoqlQueryOption[];
  setOptions: (options: SoqlQueryOption[]) => void;
};

function AddSoqlOptionModal({
  options,
  setOptions,
  isModalOpen,
  setIsModalOpen,
}: AddSoqlOptionModalProps) {
  const [newOption, setNewOption] = useState<SoqlQueryOption>({
    sObject: "",
    plural: "",
  });

  function handleAddNewPress() {
    if (newOption.sObject && newOption.plural) {
      setOptionsInLocalStorage([...options, newOption]);
      setOptions([...options, newOption]);
      setIsModalOpen(false);
    }
  }

  function handleEnterKeyPress(e: React.KeyboardEvent<FormElement>) {
    if (e.key === "Enter") handleAddNewPress();
  }

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <Modal.Header>
        <Text id="modal-title" size={18} b>
          Add new sObject or Custom Object
        </Text>
      </Modal.Header>
      <Modal.Body css={{ pt: 30 }}>
        <Input
          bordered
          clearable
          labelPlaceholder="Object Name (e.g. FluxCapacitor__c)"
          color="secondary"
          value={newOption.sObject}
          onChange={(e) =>
            setNewOption({
              ...newOption,
              sObject: e.target.value,
            })
          }
          onKeyDown={handleEnterKeyPress}
        />
        <Spacer y={0.5} />
        <Input
          bordered
          clearable
          labelPlaceholder="Object Plural Name (e.g. FluxCapacitors)"
          color="secondary"
          value={newOption.plural}
          onChange={(e) =>
            setNewOption({
              ...newOption,
              plural: e.target.value,
            })
          }
          onKeyDown={handleEnterKeyPress}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto onPress={handleAddNewPress} color="secondary">
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddSoqlOptionModal;
