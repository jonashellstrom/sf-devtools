import { Pagination } from "@nextui-org/react";

function DebugLogs() {
  return (
    <Pagination
      total={20}
      initialPage={1}
      onChange={(page) => console.log("page now: ", page)}
    />
  );
}

export default DebugLogs;
