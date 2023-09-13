import "dotenv/config";
import express from "express";
import { CronJob } from "cron";
import cors from "cors";

import "./queue";

import routes from "./routes";
import {
  callRoutinesReviewReminder,
  callRoutinesCheckInReminder,
  callRoutinesProposalRefused,
  callRoutinesWarningWeekly,
  callRoutinesWarningWeekendCalendar,
  sendNotificationsRoutine,
} from "./app/controllers/NotificationController";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use(routes);

// callRoutinesPendingProposals()

sendNotificationsRoutine()

// new CronJob("*/5,5 * * * *", callRoutinesReviewReminder, null, true);
// new CronJob("*/2,2 * * * *", callRoutinesCheckInReminder, null, true);
// new CronJob("*/2 * * * *", callRoutinesProposalRefused, null, true);
// new CronJob("*/2,4 * * * *", callRoutinesWarningWeekly, null, true);
// new CronJob("*/4,3 * * * *", callRoutinesWarningWeekendCalendar, null, true);
// new CronJob("*/1 * * * *", sendNotificationsRoutine, null, true);


// callRoutinesExternalCalendar()
// callRoutinesCheckInReminder()
// callRoutinesWarningWeekly()
// callRoutinesWarningWeekendCalendar()
// callRoutinesProposalRefused()
// callRoutinesCheckinRememberProposals()

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});