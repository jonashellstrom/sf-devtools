export type BookmarkedApex = {
  name: string;
  code: string;
};

const LOCAL_STORAGE_KEY = "@sf-devtools-bookmarked-apex";

export function setOptionsInLocalStorage(options: readonly BookmarkedApex[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(options));
}

const STOP_ALL_CRON_JOBS = `
List<CronTrigger> cronTriggers = [SELECT Id, CronJobDetail.Name FROM CronTrigger LIMIT 140];
if (cronTriggers.size() > 0) {
    for (Integer i = 0; i < cronTriggers.size(); i++) {
        System.abortJob(cronTriggers[i].Id);
    }
}`;

export const DEFAULT_BOOKMARKED_APEX: BookmarkedApex[] = [
  { name: "Stop all active CRON jobs", code: STOP_ALL_CRON_JOBS },
];
