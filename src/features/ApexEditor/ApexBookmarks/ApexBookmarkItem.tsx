import { Loading, Row, Text, Tooltip } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";

import { IconButton } from "../../Dashboard/ScratchView/IconButton";
import { type BookmarkedApex, setBookmarksInLocalStorage } from "./utils";
import mainApi from "../../../mainApi";
import ActionButton from "../../../components/ActionButton";

type ApexBookmarkItemProps = {
  bookmark: BookmarkedApex;
  bookmarks: BookmarkedApex[];
  setBookmarks: (bookmarks: BookmarkedApex[]) => void;
};

function ApexBookmarkItem({
  bookmark,
  bookmarks,
  setBookmarks,
}: ApexBookmarkItemProps) {
  const { mutate: runAnonymous, isLoading } = useMutation(mainApi.runAnonymous);

  function handleOnRunClick() {
    runAnonymous(bookmark.code);
  }

  function handleOnBookmarkDelete() {
    const filteredOptions = bookmarks.filter((bm) => bm.name !== bookmark.name);
    setBookmarksInLocalStorage([...filteredOptions]);
    setBookmarks([...filteredOptions]);
  }

  return (
    <Row justify="space-between" align="center">
      <Tooltip
        content="Run this script"
        color="primary"
        onClick={() => handleOnRunClick()}
        css={{ zIndex: "10000000 !important" }}
      >
        <IconButton>
          {isLoading ? (
            <Loading size="xs" />
          ) : (
            <Text color="primary" css={{ width: "100%" }}>
              {bookmark.name}
            </Text>
          )}
        </IconButton>
      </Tooltip>
      <ActionButton
        onPress={() => handleOnBookmarkDelete()}
        text="DELETE"
        color="error"
        withConfirmPress={{
          confirmText: "CONFIRM!",
        }}
      />
    </Row>
  );
}

export default ApexBookmarkItem;
