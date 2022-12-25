import { useState } from "react";
import { Dropdown, Text, useModal } from "@nextui-org/react";

import { DeleteIcon } from "../../../components/icons/DeleteIcon";
import ApexBookmarkModal from "./ApexBookmarkModal";
import {
  type BookmarkedApex,
  DEFAULT_BOOKMARKED_APEX,
  BOOKMARKS_LOCAL_STORAGE_KEY,
} from "./utils";
import ApexBookmarkItem from "./ApexBookmarkItem";

function getInitialBookmarks(): BookmarkedApex[] {
  const localStore = localStorage.getItem(BOOKMARKS_LOCAL_STORAGE_KEY);
  if (localStore) {
    return [...JSON.parse(localStore)];
  } else {
    return [...DEFAULT_BOOKMARKED_APEX];
  }
}

function ApexBookmarks() {
  const [bookmarks, setBookmarks] = useState(getInitialBookmarks);
  const { bindings, setVisible } = useModal();

  return (
    <>
      <ApexBookmarkModal
        isModalOpen={bindings.open}
        setIsModalOpen={setVisible}
        bookmarks={bookmarks}
        setBookmarks={setBookmarks}
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
            ...bookmarks.map((b) => (
              <Dropdown.Item key={b.name} textValue={b.name}>
                <ApexBookmarkItem
                  key={b.name}
                  bookmark={b}
                  bookmarks={bookmarks}
                  setBookmarks={setBookmarks}
                />
              </Dropdown.Item>
            )),
            <Dropdown.Item
              key="add-new"
              textValue="add new bookmark"
              withDivider
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
