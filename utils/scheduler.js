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
  var { chatId, messageId, senderId, senderName } = job.attrs.data;
  var mentions = [];
  await client.getContactById(senderId).then((contact) => {
    mentions.push(contact);
    var text = `@${senderName} `;
    client.sendMessage(chatId, text, { mentions });
  });
});

/**
 * @param {Message} message The string
 */
async function createReminder(message) {
  var chatId = (await message.getChat()).id._serialized;
  var messageId = message.id.id;

  await agenda.start();

  await agenda.schedule("in 10 seconds", "send_reminder", {
    chatId: chatId,
    messageId: messageId,
    senderId: message.author,
    senderName: (await message.getContact()).id.user,
  });
}
