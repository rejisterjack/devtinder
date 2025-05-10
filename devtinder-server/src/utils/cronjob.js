const cron = require('node-cron');

cron.schedule('* * * * * *', () => {
  console.log('Running a task every day at midnight', new Date());
  // Add your task logic here
});