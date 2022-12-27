import { useState } from "react";
import { Dropdown, Row, Text, Tooltip } from "@nextui-org/react";

import { DeleteIcon } from "../../../components/icons/DeleteIcon";
import { IconButton } from "../../Dashboard/ScratchView/IconButton";
import AddSoqlOptionModal from "./AddSoqlOptionModal";
import {
  type SoqlQueryOption,
  SOQL_QUERY_OPTIONS,
  setOptionsInLocalStorage,
} from "./utils";
import { LOCAL_STORAGE_KEYS } from "../../../shared/constants";

type SoqlHelperProps = {
  appendCode: (query: string) => void;
};

function makeDefaultQuery(opt: SoqlQueryOption) {
  return `List<${opt.sObject}> ${opt.plural.toLowerCase()} = [SELECT Id FROM ${
    opt.sObject
  }];`;
}

function getInitialOptions(): SoqlQueryOption[] {
  const localStore = localStorage.getItem(LOCAL_STORAGE_KEYS.SOQL_OPTIONS);
  if (localStore) {
    return [...JSON.parse(localStore)];
  } else {
    return [...SOQL_QUERY_OPTIONS];
  }
}

function SoqlHelper({ appendCode }: SoqlHelperProps) {
  const [options, setOptions] = useState(getInitialOptions);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleOnSoqlOptionDelete(opt: SoqlQueryOption) {
    const filteredOptions = options.filter((o) => o.sObject !== opt.sObject);
    setOptionsInLocalStorage([...filteredOptions]);
    setOptions([...filteredOptions]);
  }

  function renderDropdownItem(opt: SoqlQueryOption) {
    return (
      <Dropdown.Item key={opt.sObject} textValue={opt.sObject} color="primary">
        <Row justify="space-between" align="center">
          <Text
            color="primary"
            onClick={() => appendCode(makeDefaultQuery(opt))}
            css={{ width: "100%" }}
          >
            {`Query ${opt.sObject}`}
          </Text>
          <Tooltip
            content="Delete"
            color="error"
            onClick={() => handleOnSoqlOptionDelete(opt)}
            css={{ zIndex: "10000000 !important" }}
          >
            <IconButton>
              <DeleteIcon size={16} fill="#BF4C30" />
            </IconButton>
          </Tooltip>
        </Row>
      </Dropdown.Item>
    );
  }

  return (
    <>
      <AddSoqlOptionModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        options={options}
        setOptions={setOptions}
      />
      <Dropdown isBordered>
        <Dropdown.Button
          flat
          color="primary"
          css={{ mr: 10, borderRadius: 5 }}
          size="sm"
        >
          Insert SOQL
        </Dropdown.Button>
        <Dropdown.Menu aria-label="Static Actions">
          {[
            ...options.map((opt) => renderDropdownItem(opt)),
            <Dropdown.Item
              key="add-new-soql"
              color="success"
              withDivider
              textValue="Add New"
            >
              <Row justify="space-between" align="center">
                <Text
                  color="currentColor"
                  onClick={() => setIsModalOpen(true)}
                  css={{ width: "100%" }}
                >
                  Add New Object
                </Text>
              </Row>
            </Dropdown.Item>,
          ]}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default SoqlHelper;
