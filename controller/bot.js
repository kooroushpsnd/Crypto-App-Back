const { default: axios } = require("axios");
const TelegramBot = require("node-telegram-bot-api")
const Bot_Token = process.env.BOT_KEY

const bot = new TelegramBot(Bot_Token, {polling: true});

const createInlineButtons = buttons => buttons.map(button => ({
    text: button.text,
    callback_data: button.callback_data
}))

const createBackButton = () => [{ text: 'goBack' ,callback_data: 'back' }]

const sendMessageWithOptions = (chatId ,text ,options) => {
    const defaultOptions = { parse_mode: 'markdown' }
    bot.sendMessage(chatId ,text ,{ ...defaultOptions ,...options })
}

const editMessageWithOptions = (chatId ,messageId ,text ,options) => {
    const defaultOptions = { parse_mode: 'markdown'}
    bot.editMessageText(text ,{ chat_id: chatId ,message_id: messageId, ...defaultOptions ,...options})
}

bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id
    const userName = msg.from.first_name
    const userLastName = msg.from.last_name || ''
    const welcomeMessage = `${userName} ${userLastName} \n Welcome to Crypto World`

    const startOptions = {
        reply_markup: {
            inline_keyboard: [
                createInlineButtons([
                    { text: 'About Me', callback_data: 'about_me' },
                    { text: 'Crypto List', callback_data: 'Crypto' }]),
            ],
        },
    }

    sendMessageWithOptions(chatId, welcomeMessage, startOptions)
})

bot.on('callback_query', async callbackQuery => {
    const chatId = callbackQuery.message.chat.id 
    const messageId = callbackQuery.message.message_id
    const data = callbackQuery.data

    switch (data) {
        case 'about_me':
            const kooroushInfo =
            `Hi my name is Kooroush Pasandideh \nIt would be a pleasure to collaborate with you in business \nThanks for using my Telegram Bot`
            const inlineKeyboard = [
                [
                    { text: 'My GitHub', url: "https://github.com/kooroushpsnd" },
                    { text: 'My Telegram', url: "https://t.me/kpthemighty" },
                ],
                createBackButton(),
            ]
            const aboutMeOptions = { reply_markup: { inline_keyboard: inlineKeyboard } }
            editMessageWithOptions(chatId, messageId, kooroushInfo, aboutMeOptions)
            break

        case 'Crypto':
            const response = await axios.get(`http://localhost:3000/crypto`)
            const cryptoData = response.data.crypto

            let cryptoInfo = 'here is the Crypto List in Tooman\n'
            cryptoData.forEach(crypto => {
                cryptoInfo += `- ${crypto.name}:  ${crypto.price} \n`
            });

            const channelsOptions = {
                reply_markup: {
                    inline_keyboard: [
                        createBackButton(),
                    ],
                },
            }
            editMessageWithOptions(chatId, messageId, cryptoInfo, channelsOptions)
            break

        case 'back':
            const startOptions = {
                reply_markup: {
                    inline_keyboard: [
                        createInlineButtons(
                            [
                                { text: 'About Me', callback_data: 'about_me' },
                                { text: 'Crypto List', callback_data: 'Crypto' }
                            ]),
                    ],
                },
            }
            editMessageWithOptions(chatId, messageId, 'Welcome to Crypto World', startOptions)
            break
    }

    bot.answerCallbackQuery(callbackQuery.id)
})