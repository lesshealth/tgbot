const TelegramBot = require('node-telegram-bot-api');
const sequelize = require('./db');
const GroupModel = require('./models/groups');

const Group = GroupModel(sequelize, require('sequelize').DataTypes);

const TOKEN = '7207562918:AAFSDKbYDsQWtSY4-iMjI0yLTIgLxeHKBcI';
const bot = new TelegramBot(TOKEN, { polling: true });

sequelize.sync()
    .then(() => console.log('Синхронизация прошла успешна'))
    .catch(err => console.error('Ошибка синхронизации:', err));


bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Привет, Октагон! Выберите действие:', {
        reply_markup: {
            keyboard: [
                ['Список групп'],
                ['Добавить группу'],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
        },
    });
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === 'Список групп') {
        await showGroups(chatId);
    } else if (text === 'Добавить группу') {
        await addGroup(chatId);
    }
});

async function showGroups(chatId) {
    try {
        const groups = await Group.findAll({ attributes: ['id', 'name', 'descr'] });

        if (groups.length === 0) {
            bot.sendMessage(chatId, 'Групп пока нет.');
            return;
        }

        let message = 'Список групп:\n\n';
        groups.forEach((group, index) => {
            message += `${index + 1}. ${group.name}\nОписание: ${group.descr}\n\n`;
        });

        bot.sendMessage(chatId, message);
    } catch (error) {
        console.error('Ошибка при выводе списка групп:', error);
        bot.sendMessage(chatId, 'Ошибка при получении списка групп.');
    }
}

async function addGroup(chatId) {
    bot.sendMessage(chatId, 'Напишите название и описание группы в формате: название | описание');

    bot.once('message', async (msg) => {
        const input = msg.text;
        const [name, descr] = input.split('|').map(str => str.trim());

        if (!name || !descr) {
            bot.sendMessage(chatId, 'Неверный формат. Попробуйте ещё раз.');
            return;
        }

        try {
            await Group.create({ name, descr });
            bot.sendMessage(chatId, `Группа "${name}" успешно добавлена.`);
        } catch (error) {
            console.error('Ошибка при добавлении группы:', error);
            bot.sendMessage(chatId, 'Произошла ошибка при добавлении группы.');
        }
    });
}
