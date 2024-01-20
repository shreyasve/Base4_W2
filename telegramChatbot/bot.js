
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

                const yearlyDistance = distance * 365;
                const yearlyElectricity = electricity * 12;
                const yearlyMeals = meals * 365;
                const yearlyWaste = waste * 52;

                // Calculate carbon emissions
                const transportationEmissions = EMISSION_FACTORS["India"]["Transportation"] * yearlyDistance;
                const electricityEmissions = EMISSION_FACTORS["India"]["Electricity"] * yearlyElectricity;
                const dietEmissions = EMISSION_FACTORS["India"]["Diet"] * yearlyMeals;
                const wasteEmissions = EMISSION_FACTORS["India"]["Waste"] * yearlyWaste;

                // Convert emissions to tonnes and round off to 2 decimal points
                const roundedTransportation = (transportationEmissions / 1000).toFixed(2);
                const roundedElectricity = (electricityEmissions / 1000).toFixed(2);
                const roundedDiet = (dietEmissions / 1000).toFixed(2);
                const roundedWaste = (wasteEmissions / 1000).toFixed(2);

                // Calculate total emissions
                const totalEmissions = (transportationEmissions + electricityEmissions + dietEmissions + wasteEmissions).toFixed(2);
                bot.sendMessage(chatId, `Results:\n\nTransportation: ${roundedTransportation} tonnes CO2 per year\nElectricity: ${roundedElectricity} tonnes CO2 per year\nDiet: ${roundedDiet} tonnes CO2 per year\nWaste: ${roundedWaste} tonnes CO2 per year\n\nTotal Carbon Footprint: ${totalEmissions} tonnes CO2 per year`);
                bot.sendMessage(chatId, "Please choose '1' to calculate again or '2' for getting your doubts cleared.");
                break;

            case '2':
                bot.on("message", async (msg1) => {
                    const chatId = msg1.chat.id;
                    const chatCompletion = await openai.chat.completions.create({
                        model: "gpt-3.5-turbo",
                        messages: [
                            { "role": "user", "content": msg1.text },
                            { "role": "system", "content": "You will answer only to queries related to nature and the environment. If it is not related, just say I am only authorized to answer questions related to Environment and nature" }
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
