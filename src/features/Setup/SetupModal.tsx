import { useState } from "react";
import { Button, Col, Input, Modal, Row, Text } from "@nextui-org/react";

import { useZustand } from "../../hooks/useZustand";
import mainApi from "../../mainApi";
import { LOCAL_STORAGE_KEYS } from "../../shared/constants";

function SetupModal() {
  const [sfdxPath, setSfdxPath] = useZustand((state) => [
    state.sfdxPath,
    state.setSfdxPath,
  ]);
  const [newSfdxPath, setNewSfdxPath] = useState(sfdxPath);

  async function handleOnSelectPress() {
    const path = await mainApi.selectFolder();
    setNewSfdxPath(path);
  }

  function handleConfirmPress() {
    if (newSfdxPath) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SFDX_PATH, newSfdxPath);
      setSfdxPath(newSfdxPath);
    }
  }

  return (
    <Modal
      open
      aria-labelledby="modal-title"
      width="90%"
      blur
      css={{ mt: 70 }}
      preventClose
    >
      <Modal.Header>
        <Col>
          <Row>
            <Text size="$md" b css={{ width: "100%", textAlign: "start" }}>
              Set your SFDX project path
            </Text>
          </Row>
          <Row>
            <Text
              size="$sm"
              css={{ width: "100%", textAlign: "start", mt: 10 }}
            >
              This should be the root of the SFDX project (where the
              'sfdx-project.json' file is located)
            </Text>
          </Row>
          <Row>
            <Text size="$sm" css={{ width: "100%", textAlign: "start" }}>
              SFDX commands will be run from this directory
            </Text>
          </Row>
        </Col>
      </Modal.Header>
      <Modal.Body css={{ pt: 10 }}>
        <Input
          value={newSfdxPath}
          onChange={(e) => setNewSfdxPath(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Row justify="space-between">
          <Button onPress={handleOnSelectPress} flat>
            Select Directory
          </Button>
          <Button onPress={handleConfirmPress} disabled={!newSfdxPath}>
            Confirm
          </Button>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}

export default SetupModal;
