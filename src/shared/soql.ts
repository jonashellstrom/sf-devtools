import type {
  DebugLevel,
  TraceFlag,
} from "../features/Debugging/TraceFlags/types";

type SoqlQueryResponse<T> = {
  result: {
    done: boolean;
    totalSize: number;
    records: T[];
  };
};

const QUERY_TRACE_FLAGS =
  "SELECT Id, CreatedDate, CreatedById, StartDate, ExpirationDate, LogType, TracedEntityId, TracedEntity.Name, ApexCode, ApexProfiling, Callout, Database, System, Validation, Visualforce, Workflow FROM TraceFlag";
export type QueryTraceFlags = SoqlQueryResponse<TraceFlag>;

const QUERY_DEBUG_LEVELS = "SELECT Id, DeveloperName FROM DebugLevel";
export type QueryDebugLevels = SoqlQueryResponse<DebugLevel>;

const soql = {
  QUERY_TRACE_FLAGS,
  QUERY_DEBUG_LEVELS,
};
export default soql;
