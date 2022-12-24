type ISOTimestamp = string; // "2023-01-25T18:30:22.810Z"
type UnixTimestamp = string; // "1671128872000"
type SQLDate = string; // "2023-01-25"
type DateAndTime = string; // 2023-01-25, 1:30:22 p.m.

export type SfdxResponse = {
  status: 0 | 1;
};

export type SfdxSuccessResponse<T> = {
  status: 0;
  result: T;
};

export type SfdxErrorResponse = {
  status: 1;
  name: string;
  message: string;
  exitCode: 1;
  stack: string;
  warnings: [];
  commandName: string;
};

export type ListLogsResponse = {
  status: 0 | 1;
  result: Array<{
    attributes: {
      type: "ApexLog";
      url: string;
    };
    Id: string;
    Application: "Browser";
    DurationMilliseconds: number;
    Location: "Monitoring";
    LogLength: number;
    LogUser: {
      attributes: {
        type: "Name";
        url: string;
      };
      Name: string;
    };
    Operation: string;
    Request: string;
    StartTime: string;
    Status: "Success";
  }>;
};

export type GetLogResponse = {
  status: 0 | 1;
  logData: ListLogsResponse["result"][0];
  result: [
    {
      log: string;
    }
  ];
};

export type CreateRecordResult = {
  id: string;
  success: true;
  errors: string[];
  warnings: string[];
  infos: string[];
};

export type ListOrgsSuccessResponse = SfdxSuccessResponse<ListOrgsResponse>;

export type ListOrgsResponse = {
  nonScratchOrgs: [
    {
      username: string;
      orgId: string;
      accessToken: string;
      instanceUrl: string;
      loginUrl: string;
      clientId: string;
      isDevHub: boolean;
      instanceApiVersion: string;
      instanceApiVersionLastRetrieved: DateAndTime;
      alias: string;
      lastUsed: string;
      connectedStatus: string;
      isDefaultDevHubUsername?: boolean;
      defaultMarker?: "(D)";
    }
  ];
  scratchOrgs: [
    {
      accessToken: string;
      instanceUrl: string;
      orgId: string;
      username: string;
      loginUrl: string;
      clientId: string;
      isDevHub: boolean;
      devHubUsername: string;
      created: UnixTimestamp;
      expirationDate: SQLDate;
      createdOrgInstance: string;
      instanceApiVersion: string;
      instanceApiVersionLastRetrieved: DateAndTime;
      tracksSource: boolean;
      alias: string;
      lastUsed: ISOTimestamp;
      signupUsername: string;
      createdBy: string;
      createdDate: ISOTimestamp;
      devHubOrgId: string;
      attributes: {
        type: string;
        url: string;
      };
      orgName: string;
      edition: string;
      status: "Active" | "Expired";
      isExpired: false;
      namespace: string;
    }
  ];
};

type ListLimitsResponse = Array<{
  name: string;
  max: number;
  remaining: number;
}>;

export type ListLimitsSuccessResponse = SfdxSuccessResponse<ListLimitsResponse>;

const isSuccessResponse = <T>(
  res: SfdxResponse
): res is SfdxSuccessResponse<T> => {
  return res.status === 0;
};

const sfdxResponses = {
  isSuccessResponse,
};
export default sfdxResponses;
