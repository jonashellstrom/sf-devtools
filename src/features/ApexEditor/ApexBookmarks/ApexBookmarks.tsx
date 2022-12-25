import { useState } from "react";
import {
  Dropdown,
  Loading,
  Row,
  Text,
  Tooltip,
  useModal,
} from "@nextui-org/react";

import { DeleteIcon } from "../../../components/icons/DeleteIcon";
import { IconButton } from "../../Dashboard/ScratchView/IconButton";
import ApexBookmarkModal from "./ApexBookmarkModal";
import {
  type BookmarkedApex,
  setOptionsInLocalStorage,
  DEFAULT_BOOKMARKED_APEX,
} from "./utils";
import mainApi from "../../../mainApi";
import { useMutation } from "@tanstack/react-query";

const LOCAL_STORAGE_KEY = "@sf-devtools-bookmarked-apex";

function getInitialOptions(): BookmarkedApex[] {
  const localStore = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (localStore) {
    return [...JSON.parse(localStore)];
  } else {
    return [...DEFAULT_BOOKMARKED_APEX];
  }
}

function ApexBookmarks() {
  const [options, setOptions] = useState(getInitialOptions);
  const { bindings, setVisible } = useModal();

  const { mutate: runAnonymous, isLoading } = useMutation(mainApi.runAnonymous);

  function handleOnRunClick(opt: BookmarkedApex) {
    runAnonymous(opt.code);
  }

  function handleOnBookmarkDelete(opt: BookmarkedApex) {
    const filteredOptions = options.filter((o) => o.name !== opt.name);
    setOptionsInLocalStorage([...filteredOptions]);
    setOptions([...filteredOptions]);
  }

  function renderDropdownItem(opt: BookmarkedApex) {
    return (
      <Dropdown.Item key={opt.name} textValue={opt.name}>
        <Row justify="space-between" align="center">
          <Tooltip
            content="Run this script"
            color="primary"
            onClick={() => handleOnRunClick(opt)}
            css={{ zIndex: "10000000 !important" }}
          >
            <IconButton>
              {isLoading ? (
                <Loading size="xs" />
              ) : (
                <Text color="primary" css={{ width: "100%" }}>
                  {opt.name}
                </Text>
              )}
            </IconButton>
          </Tooltip>
          <Row justify="flex-end" css={{ width: "auto" }}>
            <Tooltip
              content="Edit"
              color="warning"
              onClick={() => handleOnBookmarkDelete(opt)}
              css={{ zIndex: "10000000 !important" }}
            >
              <IconButton>
                <DeleteIcon size={16} fill="orange" />
              </IconButton>
            </Tooltip>
            <Tooltip
              content="Delete"
              color="error"
              onClick={() => handleOnBookmarkDelete(opt)}
              css={{ zIndex: "10000000 !important" }}
            >
              <IconButton>
                <DeleteIcon size={16} fill="#BF4C30" />
              </IconButton>
            </Tooltip>
          </Row>
        </Row>
      </Dropdown.Item>
    );
  }

  return (
    <>
      <ApexBookmarkModal
        isModalOpen={bindings.open}
        setIsModalOpen={setVisible}
        options={options}
        setOptions={setOptions}
      />
      <Dropdown isBordered closeOnSelect={false} shouldCloseOnBlur>
        <Dropdown.Button
          color="primary"
          css={{
            mr: 10,
            borderRadius: 5,
            fontSize: "x-small",
            fontWeight: "$bold",
          }}
          size="xs"
        >
          BOOKMARKED APEX
        </Dropdown.Button>
        <Dropdown.Menu aria-label="Static Actions" css={{ width: "300px" }}>
          {[
            ...options.map((opt) => renderDropdownItem(opt)),
            <Dropdown.Item
              textValue="add new bookmark"
              withDivider
              key="add-new"
              color="success"
              icon={<DeleteIcon size={16} fill="currentColor" />}
            >
              <Text color="currentColor" onClick={() => setVisible(true)}>
                Add New Bookmark
              </Text>
            </Dropdown.Item>,
          ]}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default ApexBookmarks;
