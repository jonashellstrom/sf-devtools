import { DateTime } from "luxon";

type SfDateTime = string; // 2022-11-29T23:20:57.000+0000

export type TraceFlag = {
  attributes: {
    type: string;
    url: string;
  };
  Id: string;
  CreatedDate: SfDateTime;
  CreatedById: string;
  StartDate: SfDateTime;
  ExpirationDate: SfDateTime;
  LogType: "USER_DEBUG" | "DEVELOPER_LOG" | "CLASS_TRACING";
  TracedEntityId: string;
  TracedEntity: {
    attributes: {
      type: "Name";
      url: string;
    };
    Name: string;
  };
  ApexCode: "FINEST";
  ApexProfiling: "INFO";
  Callout: "INFO";
  Database: "INFO";
  System: "DEBUG";
  Validation: "INFO";
  Visualforce: "FINER";
  Workflow: "INFO";
};

export type DebugLevel = {
  attributes: {
    type: string;
    url: string;
  };
  Id: string;
  DeveloperName: string;
};

export type NewTraceFlag = {
  startTime: DateTime;
  endTime: DateTime;
  debugLevelId: string;
  tracedEntityId: string;
};
