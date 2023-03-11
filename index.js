const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const backendApi = process.env.API;

bot.start((ctx) => {
  ctx.replyWithHTML(
    `Здравствуйте <b>${ctx.from.username}</b>! \n\nДобро пожаловать в наш бот,`,
    {
      reply_markup: {
        keyboard: [
          ["Меню нашей кухни"],
          ["Индивидуальные заказы тортов"],
          ["Жалоба и Предложения"],
          ["Заказ", "Контакт"],
        ],
        resize_keyboard: true,
      },
    }
  );
});

bot.hears("Индивидуальные заказы тортов", async (ctx) => {
  try {
    await ctx.replyWithChatAction("typing");
    const res = await axios.get(`${backendApi}/category`);
    const categoryList = res.data.map((category) => {
      return [
        {
          text: category.parent,
          url: category.url,
        },
      ];
    });
    await ctx.reply("Вы можете выбрать из категорий 👇", {
      reply_markup: {
        inline_keyboard: categoryList,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

bot.hears("Заказ", (ctx) => {
  // order with phone or telegram account
  ctx.replyWithHTML(
    "Вы можете заказать в 👇: \n \nТелефон : 📞 <b>+998988880055</b> \n\nMенеджер : <b>@Salesmanager_mone</b>"
  );
});

bot.hears("Жалоба и Предложения", (ctx) => {
  ctx.reply(
    "Вы можете отправить нам свои предложения и жалобы по ссылке ниже 👇",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Жалоба и Предложения",
              url: "https://review.monebakery.uz/",
            },
          ],
        ],
      },
    }
  );
});

bot.hears("Меню нашей кухни", (ctx) => {
  ctx.reply(
    "Вы можете просмотреть все наши продукты, нажав на ссылку ниже 👇",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Меню нашей кухни",
              url: "https://menu.monebakery.uz/",
            },
          ],
        ],
      },
    }
  );
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
            callback_data: "call_me",
          },
        ],
      ],
    },
  });
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

bot.action("call_me", (ctx) => {
  ctx.reply("Наш контакт:  +998988880055");
});

bot.action("branch1", (ctx) => {
  ctx.replyWithLocation(39.673365, 66.969126);
  ctx.reply("Дахбет 25-А: +998988880055");
});

bot.action("branch2", (ctx) => {
  ctx.replyWithLocation(39.644942, 66.951527);
  ctx.reply("Орзу Махмудова 12 дом: +998999990055");
});

bot.action("branch3", (ctx) => {
  ctx.replyWithLocation(39.644823, 66.954632);
  ctx.reply("Буюк Ипак йули 72 дом: +998944440055");
});

bot.launch();
