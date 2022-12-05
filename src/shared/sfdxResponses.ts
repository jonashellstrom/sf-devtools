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
  result: [
    {
      log: string;
    }
  ];
};
