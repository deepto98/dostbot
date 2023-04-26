const { Client, Message } = require("whatsapp-web.js");

/**
 * @param {Client} client The date
 * @param {Message} message The string
 */
function displayMenu(client, message) {
  console.log("Menu");
  try {
    message.reply("Welcome");
  } catch (error) {
    console.log("Error:");

    console.log(error.message);
    console.log("Error end_________");
    message.reply("⚠️ Request Failed ⚠️");
  }
}
module.exports = {
  displayMenu,
};

