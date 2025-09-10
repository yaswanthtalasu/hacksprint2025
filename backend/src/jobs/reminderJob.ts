
import cron from "cron";
import Reminder from "../models/Reminder";
import User from "../models/User";
import { sendMail } from "../services/mailService";
import AuditLog from "../models/AuditLog";

// Runs every minute to keep simple — production: use queue / worker
const job = new cron.CronJob("* * * * *", async () => {
  try {
    const now = new Date();
    const due = await Reminder.find({ remindAt: { $lte: now }, done: false });
    for (const r of due) {
      const user = await User.findById(r.owner);
      if (!user) continue;
      // simple email
      try {
        await sendMail(
          user.email,
          `Reminder: ${r.title}`,
          r.message || "You have a reminder"
        );
        await AuditLog.create({
          user: user._id,
          action: "sent_reminder_email",
          meta: { reminder: r._id },
        });
      } catch (e) {
        console.error("failed to send mail", e);
      }

      // repeat handling
      if (r.repeat === "none") {
        r.done = true;
      } else {
        const next = new Date(r.remindAt);
        if (r.repeat === "daily") next.setDate(next.getDate() + 1);
        if (r.repeat === "weekly") next.setDate(next.getDate() + 7);
        if (r.repeat === "monthly") next.setMonth(next.getMonth() + 1);
        r.remindAt = next;
      }
      await r.save();
    }
  } catch (err) {
    console.error("reminder job error", err);
  }
});

export default job;