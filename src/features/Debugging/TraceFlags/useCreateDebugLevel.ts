import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import mainApi from "../../../mainApi";
import queryKeys from "../../../shared/queryKeys";
import { CreateRecordResult } from "../../../shared/sfdxResponses";
import soql, { QueryDebugLevels } from "../../../shared/soql";

const SF_DEVTOOLS_DEBUG_LEVEL_NAME = "SF_DEVTOOLS_DEBUG";

function getCreateDebugLevelRequest() {
  return (
    `DeveloperName=${SF_DEVTOOLS_DEBUG_LEVEL_NAME} ` +
    `MasterLabel=${SF_DEVTOOLS_DEBUG_LEVEL_NAME} ` +
    `ApexCode=FINEST ` +
    `ApexProfiling=NONE ` +
    `Callout=NONE ` +
    `Database=NONE ` +
    `System=NONE ` +
    `Validation=NONE ` +
    `Visualforce=NONE ` +
    `Workflow=NONE`
  );
}

function useCreateDebugLevel() {
  const {
    data: debugLevels,
    isLoading,
    isSuccess,
  } = useQuery([queryKeys.DEBUG_LEVELS], () =>
    mainApi.runSoql<QueryDebugLevels>(soql.QUERY_DEBUG_LEVELS)
  );

  const [debugLevelId, setDebugLevelId] = useState<string | null>(null);

  const { mutate: createRecord, isLoading: isMutationLoading } = useMutation(
    async (values: string) =>
      await mainApi.createRecord<CreateRecordResult>(
        "DebugLevel",
        values,
        true
      ),
    {
      onSuccess(data) {
        setDebugLevelId(data.result.id);
      },
    }
  );

  useEffect(() => {
    const createSfDevToolsDebugLevel = async () => {
      if (isSuccess) {
        const wantedLevel = debugLevels?.result.records.find(
          (e) => e.DeveloperName === SF_DEVTOOLS_DEBUG_LEVEL_NAME
        );
        if (!wantedLevel) {
          createRecord(getCreateDebugLevelRequest());
        } else {
          setDebugLevelId(wantedLevel.Id);
        }
      }
    };
    createSfDevToolsDebugLevel();
  }, [createRecord, debugLevels, isSuccess]);

  return {
    isLoading: isLoading || isMutationLoading,
    debugLevelId,
    debugLevelName: SF_DEVTOOLS_DEBUG_LEVEL_NAME,
  };
}

export default useCreateDebugLevel;
