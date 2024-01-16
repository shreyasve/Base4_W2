const Telegram = require("node-telegram-bot-api");
const OpenAI = require("openai");

const botToken = "6622880972:AAEiuOvgqKGJ3_0oSYPE76CYjLPW41Erwl4";
const openaiToken = "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";

const openai1 = new OpenAI({
    apiKey: openaiToken,
  });
  
  const openai = new OpenAI(openai1);

const bot = new Telegram(botToken, {polling: true});




bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    if (msg.text.toLowerCase().includes("carbon") || msg.text.toLowerCase().includes("climate")) {
    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": msg.text}],
            temperature: 0.5,
        });

        const replyText = chatCompletion.choices[0].message.content;
        bot.sendMessage(chatId, replyText);
    } catch (error) {
        console.error("Error processing message:", error);
        bot.sendMessage(chatId, "An error occurred while processing your message.");
    }
    }
    else {
        // If the message doesn't match the desired domain
        bot.sendMessage(chatId, "Sorry, I can only provide information related to carbon and environment.");
    }
});