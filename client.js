const fs = require("fs");

const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

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
    myGroup = chats.find((chat) => chat.name === myGroupName);
    console.log(myGroup);
    client.sendMessage(myGroup.id._serialized, "badia haal hai");
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

const Config = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});
const openai = new OpenAIApi(Config);

client.on("message", (message) => {
  let body = message.body;
  // console.log(body);
  console.log(body.startsWith("!dost"));

  if (body.startsWith("!dost")) {
    var array = body.split(" ");
    console.log(array);
    rootCmd = array[1];

    switch (rootCmd) {
      case "gpt":
        message.reply("Fetching ChatGPT reply");

        var gptPrompt = array.slice(2).join(' ');
        console.log("gptPrompt");
        console.log(gptPrompt);

        runCompletion(gptPrompt).then((result) => message.reply(result));

        break;

      default:
      // code block
    }
  }
});

async function runCompletion(message) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    max_tokens: 2000,
  });
  return completion.data.choices[0].text;
}
