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
  var { chatId,messageId } = job.attrs.data;
//   console.log("agenda msg");
//   console.log(message);
//   var reconMessage = Object.assign(new Message(), message);
//   console.log("recon msg");
//   console.log(reconMessage);
  //   reconMessage.reply("Reminder");

  client.sendMessage(chatId, "Reminder");
//   message.reply("Reminder");
});

/**
 * @param {Message} message The string
 */
async function createReminder(message) {
  console.log("org msg");
  // IIFE to give access to async/

  var chatId = (await message.getChat()).id._serialized;
  var messageId = message.id.id;
//   console.log(message);
  console.log(chatId);
  console.log(messageId);

    await agenda.start();

  // await agenda.every('3 minutes', 'delete old users');
    agenda.schedule("in 20 seconds", "send_reminder", {
      chatId: chatId,
      messageId: messageId,
    });
}
