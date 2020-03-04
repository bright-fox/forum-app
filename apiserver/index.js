import config from "config";
import app from "./app";
import { CronJob } from "cron";
import { updateGrowingCommunitiesList } from "./cronjobs";

// Cronjob for updating the growing communities collection (every 7 days)
const job = new CronJob(
  " * * */7 * *",
  () => {
    console.log("==================CRONJOB====================");
    console.log("Updating the Growing Communities Collection..");
    console.log("=============================================");
    updateGrowingCommunitiesList();
  },
  null,
  true // starting the cron job
);

const server = app.listen(config.PORT, () => {
  const port = server.address().port;
  console.log(`App now running on port ${port}`);
});
