const fs = require("fs");

const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Path where the session data will be stored
// const SESSION_FILE_PATH = './session.json';

// // Load the session data if it has been previously saved
// let sessionData;
// if(fs.existsSync(SESSION_FILE_PATH)) {
//     sessionData = require(SESSION_FILE_PATH);
// }

const myGroupName = "Murphy's Law";

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
  client.getChats().then((chats) => {
    myGroup = chats.find(
      (chat) => chat.name === myGroupName
    );
    console.log(myGroup);
    client.sendMessage(myGroup.id._serialized,"Hi")
    
  });
});

// client.on('authenticated', (session) => {
//     sessionData = session;
//     fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
//         if (err) {
//             console.error(err);
//         }
//     });
// });

client.initialize();

client.on("message", (message) => {
  console.log(message.body);
});

client.on("message", (message) => {
  if (message.body === "!ping") {
    message.reply("pong");
  }

});
