import { useState } from "react";
import {
  Button,
  FormElement,
  Input,
  Modal,
  Spacer,
  Text,
} from "@nextui-org/react";
import { BookmarkedApex, setOptionsInLocalStorage } from "./utils";
import CodeEditor from "../CodeEditor";

type ApexBookmarkModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  options: BookmarkedApex[];
  setOptions: (options: BookmarkedApex[]) => void;
};

function ApexBookmarkModal({
  options,
  setOptions,
  isModalOpen,
  setIsModalOpen,
}: ApexBookmarkModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const isValidBookmark = !!name && !!code;

  function handleAddNewPress() {
    if (name && code) {
      const newBookmark: BookmarkedApex = {
        name,
        code,
      };
      setOptionsInLocalStorage([...options, newBookmark]);
      setOptions([...options, newBookmark]);
      setIsModalOpen(false);
    }
  }

  function handleEnterKeyPress(e: React.KeyboardEvent<FormElement>) {
    if (e.key === "Enter" && isValidBookmark) handleAddNewPress();
  }

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      width={"80%"}
    >
      <Modal.Header>
        <Text id="modal-title" size={18} b>
          Bookmark an Apex script
        </Text>
      </Modal.Header>
      <Modal.Body css={{ pt: 30 }}>
        <Input
          bordered
          clearable
          labelPlaceholder="Script name"
          color="secondary"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleEnterKeyPress}
        />
        <Spacer y={0.5} />
        <CodeEditor
          language="apex"
          code={code}
          setCode={setCode}
          placeholder="Your script here"
          minHeight={150}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          auto
          onPress={handleAddNewPress}
          color="secondary"
          disabled={!isValidBookmark}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ApexBookmarkModal;
