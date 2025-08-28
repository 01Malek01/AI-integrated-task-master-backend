import cron from "node-cron";
import NotificationService from "../services/NotificationService.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

// Run every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  const tasks = await Task.find({ dueDate: { $lte: new Date(Date.now() + 24*60*60*1000) } }); // tasks due in 24h
  for (const task of tasks) {
    const notify = new NotificationService({user: task.user.toString(), message: `Task "${task.title}" is due soon!`, type: "reminder"});
    await notify.createNotification();
  }
});


// Run every day at 4 PM
cron.schedule("0  0 16 * *", async () => { 
const allUsers = await User.find();
for (const user of allUsers) {
  const messages = [
    `You're doing amazing, ${user.username}! Keep up the great work!`,
    `Keep pushing forward, ${user.username}! Your progress is inspiring.`,
    `Great job today, ${user.username}! You're making a real difference.`,
    `Your hard work is paying off, ${user.username}! Keep it up!`,
    `Stay focused and keep achieving, ${user.username}! You've got this!`
  ];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const notify = new NotificationService({
    //@ts-ignore
    user: user._id.toString(), 
    message: randomMessage, 
    type: "motivation"
  });
  await notify.createNotification();
}
});

