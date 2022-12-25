import { Dropdown, Row, Text, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { DeleteIcon } from "../../../components/icons/DeleteIcon";
import { IconButton } from "../../Dashboard/ScratchView/IconButton";
import AddSoqlOptionModal from "./AddSoqlOptionModal";
import {
  type SoqlQueryOption,
  LOCAL_STORAGE_KEY,
  SOQL_QUERY_OPTIONS,
  ADD_NEW_OPTION,
  getOptionsWithoutAddOption,
  setOptionsInLocalStorage,
} from "./shared";

type SoqlHelperProps = {
  appendCode: (query: string) => void;
};

function makeDefaultQuery(opt: SoqlQueryOption) {
  return `\nList<${
    opt.sObject
  }> ${opt.plural.toLowerCase()} = [SELECT Id FROM ${opt.sObject}];`;
}

function getInitialOptions(): SoqlQueryOption[] {
  const localStore = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (localStore) {
    return [...JSON.parse(localStore), ADD_NEW_OPTION];
  } else {
    return [...SOQL_QUERY_OPTIONS, ADD_NEW_OPTION];
  }
}

function SoqlHelper({ appendCode }: SoqlHelperProps) {
  const [options, setOptions] = useState(getInitialOptions);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function getSoqlOptionText(opt: SoqlQueryOption) {
    return opt.sObject === "AddNew"
      ? "+ Add New Object"
      : `Query ${opt.sObject}`;
  }

  function handleOnSoqlOptionClick(opt: SoqlQueryOption) {
    return opt.sObject === "AddNew"
      ? setIsModalOpen(true)
      : appendCode(makeDefaultQuery(opt));
  }

  function handleOnSoqlOptionDelete(opt: SoqlQueryOption) {
    const filteredOptions = getOptionsWithoutAddOption(options).filter(
      (o) => o.sObject !== opt.sObject
    );
    setOptionsInLocalStorage([...filteredOptions]);
    setOptions([...filteredOptions, ADD_NEW_OPTION]);
  }

  function renderDropdownItem(opt: SoqlQueryOption) {
    return (
      <Dropdown.Item
        key={opt.sObject}
        textValue={opt.sObject}
        color={opt.sObject === "AddNew" ? "success" : "primary"}
      >
        <Row justify="space-between" align="center">
          <Text
            color="primary"
            onClick={() => handleOnSoqlOptionClick(opt)}
            css={{ width: "100%" }}
          >
            {getSoqlOptionText(opt)}
          </Text>
          {opt.sObject !== "AddNew" && (
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
          )}
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
          {options.map((opt) => renderDropdownItem(opt))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default SoqlHelper;
