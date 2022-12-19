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

const isSuccessResponse = <T>(
  res: SfdxResponse
): res is SfdxSuccessResponse<T> => {
  return res.status === 0;
};

const sfdxResponses = {
  isSuccessResponse,
};
export default sfdxResponses;
