
const Telegram = require("node-telegram-bot-api");
const OpenAI = require("openai");

const botToken = "6622880972:AAEiuOvgqKGJ3_0oSYPE76CYjLPW41Erwl4";
const openaiToken = "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";

const openai1 = new OpenAI({
    apiKey: openaiToken,
});

const openai = new OpenAI(openai1);
const conversationState = {};
const bot = new Telegram(botToken, { polling: true });
const welcomed = {};
const chatgpt = {};
let distance, electricity, waste, meals; // Variables to store user input

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    if (conversationState[chatId] && conversationState[chatId].length > 0) {
        const userResponse = msg.text;
        conversationState[chatId] = [];
    } else {
        if (!welcomed[chatId]) {
            const welcomeMessage = "Welcome to the Carbon ChatBot! \nI can provide information related to carbon and the environment. \nEnter \n'1' to calculate your carbon footprint\n'2' for getting your doubts cleared";
            bot.sendMessage(chatId, welcomeMessage);

            welcomed[chatId] = true;
        }

        const choice = msg.text.toLowerCase();
        switch (choice) {
            case '1':
                const EMISSION_FACTORS = {
                    "India": {
                        "Transportation": 0.14,  // kgCO2/km
                        "Electricity": 0.82,     // kgCO2/kWh
                        "Diet": 1.25,            // kgCO2/meal, 2.5kgco2/kg
                        "Waste": 0.1             // kgCO2/kg
                    }
                };
                bot.sendMessage(chatId, "Great! Let's calculate your carbon footprint. Please answer a few questions.");

                await askUserQuestion(chatId, "Enter your 🚗 Daily commute distance (in km)");
                distance = await getUserResponse(chatId);

                await askUserQuestion(chatId, "Enter your 💡 Monthly electricity consumption (in kWh)");
                electricity = await getUserResponse(chatId);

                await askUserQuestion(chatId, "Enter your 🍽️ Waste generated per week (in kg)");
                waste = await getUserResponse(chatId);

                await askUserQuestion(chatId, "Enter your 🍽️ Number of meals per day");
                meals = await getUserResponse(chatId);

                const normalizedDistance = distance > 0 ? (distance * 365).toFixed(2) : 0;
                const normalizedElectricity = electricity > 0 ? (electricity * 12).toFixed(2) : 0;
                const normalizedMeals = meals > 0 ? (meals * 365).toFixed(2) : 0;
                const normalizedWaste = waste > 0 ? (waste * 52).toFixed(2) : 0;

                const transportationEmissions = ((0.14 * normalizedDistance) / 1000).toFixed(2);
                const dietEmissions = ((1.25 * normalizedMeals) / 1000).toFixed(2);
            const wasteEmissions = ((0.1 * normalizedWaste) / 1000).toFixed(2);
            const electricityEmissions = ((0.82 * normalizedElectricity) / 1000).toFixed(2);

            let totalEmissions = (
                parseFloat(transportationEmissions) +
                parseFloat(electricityEmissions) +
                parseFloat(dietEmissions) +
                parseFloat(wasteEmissions)
                ).toFixed(2);
                bot.sendMessage(chatId, `Results:\n\nTransportation: ${transportationEmissions} tonnes CO2 per year\nElectricity: ${electricityEmissions} tonnes CO2 per year\nDiet: ${dietEmissions} tonnes CO2 per year\nWaste: ${wasteEmissions} tonnes CO2 per year\n\nTotal Carbon Footprint: ${totalEmissions} tonnes CO2 per year`);
                await bot.sendMessage(chatId, "Please choose '1' to calculate again or '2' for getting your doubts cleared.");
                break;

            case '2':
                bot.on("message", async (msg1) => {
                    const chatId = msg1.chat.id;
                    const chatCompletion = await openai.chat.completions.create({
                        model: "gpt-3.5-turbo",
                        messages: [
                            { "role": "user", "content": msg1.text },
                            { "role": "system", "content": "You will answer only to queries related to nature, carbon, emission,fuel, diet emissions and the environment. If it is not related, just say I am only authorized to answer questions related to Environment and nature. Dont send the 'I am not authorized message'when the choice 2 is typed" }
                        ],
                        temperature: 0.5,
                    });

                    const replyText = chatCompletion.choices[0].message.content;
                    bot.sendMessage(chatId, replyText);
                });
                
                
                break;
        }
    }
});

async function askUserQuestion(chatId, question) {
    bot.sendMessage(chatId, question);
    conversationState[chatId] = [{ "role": "bot", "content": question }];
}

async function getUserResponse(chatId) {
    return new Promise((resolve) => {
        bot.on("message", (msg) => {
            if (msg.chat.id === chatId) {
                resolve(msg.text.toLowerCase());
            }
        });
    });
}