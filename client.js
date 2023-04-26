const fs = require("fs");
var welcome = require("./utils/welcome");

const { Client, MessageMedia, LocalAuth, Buttons } = require("whatsapp-web.js");
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
  // (async () => {
  // client.getChats().then(async (chats) => {
  //   var myGroup = chats.find((chat) => chat.name === myGroupName);
  //   // console.log(myGroup);
  //   var allMessages = [];
  //   // var chat = await message.getChat();
  //   var messages = await myGroup.fetchMessages({ limit: Number.MAX_VALUE });

  //   messages.forEach((e) => allMessages.push(e.body));
  //   console.log("allMessages");
  //   console.log(allMessages);
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
  var chatId = "";
  (async () => {
    // console.log("calling");
    chatId = (await message.getChat()).id._serialized;
  })();
  let body = message.body;

  if (body.startsWith("!dost")) {
    var array = body.split(" ");
    var rootCmd = "";
    typeof array[1] != "undefined" ? (rootCmd = array[1]) : false;
    console.log(rootCmd);

    //Commands
    switch (rootCmd) {
      case "":
      case "help":
        welcome.displayMenu(client, message);
        break;
      case "history":
        (async () => {
          var allMessages = [];
          var chat = await message.getChat();
          // await new Promise((resolve) => setTimeout(resolve, 20000));

          // console.log(chat);

          // var messages = await chat.fetchMessages({ limit: 5 });
          var messages = await chat.fetchMessages({ limit: Number.MAX_VALUE });

          messages.forEach((e) => allMessages.push(e.body));
          console.log("allMessages");

          console.log(allMessages[0]);
          console.log(allMessages[1]);
          console.log(allMessages[allMessages.length - 1]);

          console.log(allMessages.length);
        })();

        break;

      case "meme":
        message.reply("Fetching ChatGPT reply");

        var gptPrompt = array.slice(2).join(" ");
        console.log("gptPrompt");
        console.log(gptPrompt);

        runCompletion(gptPrompt).then((result) =>
          message.reply(result.trimStart())
        );

        break;
      case "gpt":
        message.reply("Fetching ChatGPT reply");

        var gptPrompt = array.slice(2).join(" ");
        console.log("gptPrompt");
        console.log(gptPrompt);

        runCompletion(gptPrompt).then((result) =>
          message.reply(result.trimStart())
        );

        break;
      case "dalle":
        message.reply("Fetching DallE image");

        var gptPrompt = array.slice(2).join(" ");
        console.log("gptPrompt");
        console.log(gptPrompt);

        createImage(gptPrompt).then(
          (result) =>
            // message.reply(result.trimStart())
            message.reply(result)
          // client.sendMessage(chatId, result)
        );

        break;
      case "song":
        (async () => {
          console.log("calling");
          var chatId = (await message.getChat()).id._serialized;
          console.log(chatId);
          // var contact = (await message.getContact()).getChat.toString;
          var url =
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley";

          const media = await MessageMedia.fromUrl(url, {
            unsafeMime: true,
          });

          // // media.mimetype = "image/png";
          // media.filename = "CustomImageName.png";
          client.sendMessage(chatId, url);

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

async function createImage(message) {
  try {
    const completion = await openai.createImage({
      n: 1,
      prompt: message,
      size: "1024x1024",
    });
    var imgUrl = completion.data.data[0].url;
    console.log(imgUrl);
    // ...
  } catch (error) {
    console.log("Error:");

    console.log(error.message);
    console.log("Error end_________");
    return "⚠️ Request Failed ⚠️";
  }

  var media = await MessageMedia.fromUrl(imgUrl, {
    unsafeMime: true,
  });
  return media;
}
