const { Agenda } = require("@hokify/agenda");
const { Message, MessageMedia } = require("whatsapp-web.js");

require("dotenv").config();

module.exports = {
  createReminder,
};

const dbUri = process.env.DOSTBOST_DB;

const agenda = new Agenda({ db: { address: dbUri } });

/**
 * Define scheduled tasks as agendas
 * @param {Message} message The string
 */
agenda.define("send_reminder", async (job) => {
  var { message } = job.attrs.data;
  console.log("agenda msg");
  console.log(message);
  var reconMessage = Object.assign(new Message(), message);
  console.log("recon msg");
  console.log(reconMessage);
  reconMessage.reply("Reminder");
  message.reply("Reminder");
});

/**
 * @param {Message} message The string
 */
async function createReminder(message) {
  console.log("org msg");
  console.log(message);
  // IIFE to give access to async/await
  await agenda.start();

  // await agenda.every('3 minutes', 'delete old users');
  agenda.schedule("in 20 seconds", "send_reminder", { message: message });

  // Alternatively, you could also do:
  // await agenda.every('*/3 * * * *', 'delete old users');
}
