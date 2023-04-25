const fs = require("fs");

const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
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
  // puppeteer: {
  //   executablePath: "/usr/bin/google-chrome-stable",
  // },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
  // client.getChats().then((chats) => {
  //   myGroup = chats.find((chat) => chat.name === myGroupName);
  //   console.log(myGroup);
  //   client.sendMessage(myGroup.id._serialized, "badia haal hai");
  // });
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

client.on("message_create", (message) => {
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

        var gptPrompt = array.slice(2).join(" ");
        console.log("gptPrompt");
        console.log(gptPrompt);

        runCompletion(gptPrompt).then((result) =>
          message.reply(result.trimStart())
        );

        break;
      case "song":
        (async () => {
          console.log("calling");

          const media = await MessageMedia.fromUrl(
            "https://unsplash.com/photos/wdVwF3Ese4o/download?ixid=MnwxMjA3fDF8MXxhbGx8MXx8fHx8fDJ8fDE2ODIzNzAwNjI&force=true&w=640",
            {
              unsafeMime: true,
            }
          );
            client.sendMessage(media);

          // let file =
          // "https://unsplash.com/photos/wdVwF3Ese4o/download?ixid=MnwxMjA3fDF8MXxhbGx8MXx8fHx8fDJ8fDE2ODIzNzAwNjI&force=true&w=640",
          // let mimetype;
          // let filename;
          // const attachment = await axios
          //   .get(file, {
          //     responseType: "arraybuffer",
          //   })
          //   .then((response) => {
          //     mimetype = response.headers["content-type"];
          //     filename = file.split("/").pop();
          //     return response.data.toString("base64");
          //   });

          // if (attachment) {
          //   const media = new MessageMedia(mimetype, attachment, filename);
          //   client.sendMessage(media);

          // }
          // const media = await MessageMedia.fromUrl(
          //   "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
          // );
        })();
        // const media = async function () {
        //   console.log("calling");
        //   const media = await MessageMedia.fromUrl(
        //     "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
        //   );
        //   client.sendMessage(media);
        //   // Expected output: "resolved"
        // };
        // media();
        // const media = async await MessageMedia.fromUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley');

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
  var result = completion.data.choices[0].text;
  console.log(result);
  return result;
}
