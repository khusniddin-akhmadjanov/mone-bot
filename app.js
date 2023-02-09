const { Telegraf } = require("telegraf");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.replyWithHTML(
    `Здравствуйте <b>${ctx.from.username}</b>! \n\nДобро пожаловать в наш бот`,
    {
      reply_markup: {
        keyboard: [["Меню", "Контакт"], ["Заказ", "Жалоба"], ["Предложения"]],
        resize_keyboard: true,
      },
    }
  );
});

bot.hears("Жалоба", (ctx) => {
  ctx.reply("вы можете писать свои жалобы по этому адресу телеграм 👇", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Telegram",
            url: "https://t.me/mone_complaint_bot",
          },
        ],
      ],
    },
  });
});

bot.hears("Предложения", (ctx) => {
  ctx.reply("вы можете написать свои предложения на этот адрес телеграм 👇", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Telegram",
            url: "https://t.me/mone_suggestion_bot",
          },
        ],
      ],
    },
  });
});

bot.hears("Контакт", (ctx) => {
  ctx.reply("Вы всегда можете связаться с нами", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Telegram",
            url: "https://t.me/monecafebakery",
          },
          {
            text: "Адрес",
            callback_data: "location",
          },
        ],
        [
          {
            text: "Instagram",
            url: "https://www.instagram.com/monebakery.uz/",
          },
          {
            text: "Facebook",
            url: "https://www.facebook.com/MoneBakery.UZ",
          },
        ],
        [
          {
            text: "+998 98 888 00 55",
            callback_data: "tel:+998 98 888 00 55",
          },
        ],
      ],
    },
  });
});

bot.hears("Назад", (ctx) => {
  ctx.reply("Welcome to the bot", {
    reply_markup: {
      keyboard: [["Меню", "Контакт"], ["Заказ"]],
      resize_keyboard: true,
    },
  });
});

bot.hears("Меню", (ctx) => {
  // reply with text and inline_keyboard categoriesKeyboard
  ctx.reply("Вы можете увидеть все продукты через эти каналы 👇", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Детские",
            url: "https://t.me/mone_cake_kids",
          },
          {
            text: "Юбилейные торжества",
            url: "https://t.me/mone_cake_anniversary",
          },
        ],
        [
          {
            text: "Для женщин",
            url: "https://t.me/mone_cake_women",
          },
          {
            text: "Для мужчин",
            url: "https://t.me/mone_cake_man",
          },
        ],
        [
          {
            text: "Свадебный",
            url: "https://t.me/mone_cake_wedding",
          },
          {
            text: "Канди торты",
            url: "https://t.me/mone_cake_kandy",
          },
        ],
        [
          {
            text: "День влюблённых",
            url: "https://t.me/+Bhb9G8yUxcA1YmQy",
          },
          {
            text: "Новогодние",
            url: "https://t.me/+c6Aa4vDbWdxhMTBi",
          },
        ],
      ],
    },
  });
});

bot.hears("Заказ", (ctx) => {
  // order with phone or telegram account
  ctx.replyWithHTML(
    "Вы можете заказать в 👇: \n \nТелефон : 📞 <b>+998 98 888 00 55</b> \n\nMенеджер : <b>@Salesmanager_mone</b>",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Адрес",
              callback_data: "location",
            },
          ],
        ],
      },
    }
  );
});

bot.action("location", (ctx) => {
  // send our branches two location
  ctx.replyWithHTML(
    "Вы можете посетить наши филиалы с 7:00 до 23:00. Все филиалы работают каждый день",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Дахбет 25-А",
              callback_data: "branch1",
            },
          ],
          [
            {
              text: "Орзу Махмудова 12 дом",
              callback_data: "branch2",
            },
          ],
          [
            {
              text: "Буюк Ипак йули 72 дом",
              callback_data: "branch3",
            },
          ],
        ],
      },
    }
  );
});

bot.action("branch1", (ctx) => {
  // send location of branch 1
  ctx.replyWithLocation(39.673365, 66.969126);
});

bot.action("branch2", (ctx) => {
  // send location of branch 2 with link
  ctx.replyWithLocation(39.644942, 66.951527);
});

bot.action("branch3", (ctx) => {
  // send location of branch 3
  ctx.replyWithLocation(39.644823, 66.954632);
});

bot.action("menu", (ctx) => {
  // go to telegram channel
  ctx.replyWithHTML("Вы можете посмотреть наше меню в нашем канале 👇", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Канал",
            url: "https://t.me/monecafebakery",
          },
        ],
      ],
    },
  });
});

bot.launch();
