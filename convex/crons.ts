import { cronJobs } from "convex/server";
// Cron jobs will be added after RSS fetching is fully implemented
// For now, articles can be fetched manually via dashboard actions

const crons = cronJobs();

// TODO: Enable after RSS integration is tested
// crons.interval(
//   "fetch-et-articles",
//   { minutes: 30 },
//   internal.rss.fetchAllFeeds
// );

export default crons;
