const { Configuration, OpenAIApi } = require("openai");
const { Message, MessageMedia } = require("whatsapp-web.js");
require("dotenv").config();
module.exports = {
  fetchChatGPTReply,
  fetchDalleReply,
};

const Config = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});
const openAIApi = new OpenAIApi(Config);

/**
 * @param {Message} message The string
 * @param {String} gptPrompt The string
 */
function fetchChatGPTReply(message, gptPrompt) {
  message.reply("Fetching ChatGPT reply");
  try {
    createTextCompletion(gptPrompt).then((result) =>
      message.reply(result.trimStart())
    );
  } catch (error) {
    console.log("Error:");
    console.log(error.message);
    console.log("_________Error end_________");
    message.reply("⚠️ Request Failed ⚠️");
  }
}
/**
 * @param {Message} message The string
 * @param {String} gptPrompt The string
 */
function fetchDalleReply(message, gptPrompt) {
  message.reply("Fetching DallE image");
  try {
    createImage(gptPrompt).then((image) => message.reply(image));
  } catch (error) {
    console.log("Error:");
    console.log(error.message);
    console.log("_________Error end_________");
    message.reply("⚠️ Request Failed ⚠️");
  }
}

/**
 * @param {String} gptPrompt The string
 * @param {String} result The string
 */
async function createTextCompletion(gptPrompt) {
  try {
    const completion = await openAIApi.createCompletion({
      model: "text-davinci-003",
      prompt: gptPrompt,
      max_tokens: 2000,
    });
    var result = completion.data.choices[0].text;
    console.log(result);
    return result;
  } catch (error) {
    console.log("Error:");
    console.log(error.message);
    console.log("Error end_________");
    return "⚠️ Request Failed ⚠️";
  }
}
/**
 * @param {String} gptPrompt The string
 * @param {MessageMedia} media The string
 */
async function createImage(message) {
  try {
    const completion = await openAIApi.createImage({
      n: 1,
      prompt: message,
      size: "1024x1024",
    });
    var imgUrl = completion.data.data[0].url;
    console.log(imgUrl);
  } catch (error) {
    console.log("Error:");

    console.log(error.message);
    console.log("Error end_________");
    return "⚠️ Request Failed ⚠️";
  }

  var image = await MessageMedia.fromUrl(imgUrl, {
    unsafeMime: true,
  });
  return image;
}
