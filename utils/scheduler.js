const { Agenda } = require("@hokify/agenda");
const { Message, MessageMedia } = require("whatsapp-web.js");

require("dotenv").config();

module.exports = {
  createReminder,
  startAgenda,
};
// Todo : Create Reminders for others
const dbUri = process.env.DOSTBOST_DB;

const agenda = new Agenda({ db: { address: dbUri } });

/**
 * Define scheduled tasks as agendas
 * @param {Message} message The string
 */
agenda.define("send_reminder", async (job) => {
  var { chatId, messageId, senderId, senderName, task } = job.attrs.data;
  var mentions = [];
  await client.getContactById(senderId).then((contact) => {
    mentions.push(contact);
    var text = `*🛑 Reminder For @${senderName} 🛑*
${task}
    `;
    client.sendMessage(chatId, text, { mentions });
  });
});

/**
 * @param {Message} message The string
 */

async function startAgenda() {
  await agenda.start();
}
async function createReminder(message, interval, task) {
  var senderName = (await message.getContact()).id.user;
  var senderId = message.author;
  var chatId = (await message.getChat()).id._serialized;

  await client.getContactById(senderId).then((contact) => {
    var mentions = [];
    mentions.push(contact);
    var text = `*🛑 Reminder Created For @${senderName} 🛑*
${task}
    `;
    client.sendMessage(chatId, text, { mentions });
  });
  var messageId = message.id.id;

  //   Handle this elsewhere, coz server shutdown affects this
  //   await agenda.start();

  await agenda.schedule(interval, "send_reminder", {
    chatId: chatId,
    messageId: messageId,
    senderId: senderId,
    senderName: senderName,
    task: task,
  });
}
