const { Client, Message } = require("whatsapp-web.js");

/**
 * @param {Client} client The date
 * @param {Message} message The string
 */
function tagAllGroupMembers(client, message) {
  try {
    (async () => {
      const chat = await message.getChat();

      // Fetch sender's id to exclude sender from tags
      var senderId = message.author;
      let text = "";
      let mentions = [];

      for (let participant of chat.participants) {
        // Exclude sender
        var participantId = participant.id._serialized;
        if (senderId === participantId) {
          continue;
        }
        var contact = await client.getContactById(participantId);

        mentions.push(contact);
        text += `@${participant.id.user} `;
      }
      message.reply(text, null, { mentions });
    })();
  } catch (error) {
    console.log("Error:");

    console.log(error.message);
    console.log("Error end_________");
    message.reply("⚠️ Request Failed ⚠️");
  }
}

module.exports = {
  tagAllGroupMembers,
};
