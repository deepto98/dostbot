const fs = require("fs");
var welcome = require("./utils/welcome");
var openai = require("./utils/openai");
var mentions = require("./utils/mentions");
var scheduler = require("./utils/scheduler");

const { Client, MessageMedia, LocalAuth, Buttons } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

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
});

client.initialize();

client.on("message_create", (message) => {
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
      case "remind":
        scheduler.createReminder(message);
        break;
      case "tagall":
        mentions.tagAllGroupMembers(client, message);
        break;
      case "gpt":
        var gptPrompt = array.slice(2).join(" ");
        openai.fetchChatGPTReply(message, gptPrompt);
        break;
      case "dalle":
        var gptPrompt = array.slice(2).join(" ");
        openai.fetchDalleReply(message, gptPrompt);
        break;

      // Trying to do something like most used words in a group, analytics etc, but only a fraction of messages are being fetched by this
      case "history":
        (async () => {
          var allMessages = [];
          var chat = await message.getChat();
          var messages = await chat.fetchMessages({ limit: Number.MAX_VALUE });

          messages.forEach((e) => allMessages.push(e.body));
          console.log("allMessages");

          console.log(allMessages[0]);
          console.log(allMessages[1]);
          console.log(allMessages[allMessages.length - 1]);

          console.log(allMessages.length);
        })();

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

          client.sendMessage(chatId, url);
        })();

        break;

      default:
    }
  }
});
