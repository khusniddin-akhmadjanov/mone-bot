const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const backendApi = process.env.API;

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
let lastMessage = ""; // store the user's previous message

bot.hears("Жалоба", (ctx) => {
  ctx.reply("Вы можете написать свою жалобу здесь");
  lastMessage = "Жалоба";
});

bot.hears("Предложения", (ctx) => {
  ctx.reply("Вы можете написать свое предложение здесь");
  lastMessage = "Предложения";
});

bot.on("text", (ctx) => {
  if (lastMessage === "Жалоба") {
    // send the complaint to the admin panel via API
    axios
      .post(`${backendApi}/complaint/add`, {
        username: ctx.from.username,
        description: ctx.message.text,
      })
      .then(() => {
        ctx.reply("Ваша жалоба отправлена");
      })
      .catch((err) => {
        console.log(err);
        ctx.reply("Ошибка при отправке жалобы");
      });
  } else if (lastMessage === "Предложения") {
    // send the offer to the API
    axios
      .post(`${backendApi}/suggestion/add`, {
        username: ctx.from.username,
        suggestion: ctx.message.text,
      })
      .then(() => {
        ctx.reply("Ваше предложение отправлено");
      })
      .catch((err) => {
        console.log(err);
        ctx.reply("Ошибка при отправке предложения");
      });
  }
});

bot.hears("Контакт", async (ctx) => {
  await ctx.reply("Вы всегда можете связаться с нами", {
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
  ctx.reply("вы можете выбрать из меню", {
    reply_markup: {
      keyboard: [["Меню", "Контакт"], ["Заказ", "Жалоба"], ["Предложения"]],
      resize_keyboard: true,
    },
  });
});

bot.hears("Меню", async (ctx) => {
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
    "Вы можете заказать в 👇: \n \nТелефон : 📞 <b>+998 98 888 00 55</b> \n\nMенеджер : <b>@Salesmanager_mone</b>"
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

bot.launch();
