const { Telegraf } = require("telegraf");
require("dotenv").config();
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);
const backendApi = process.env.BACKEND_API;

const categories = [];
const categoriesKeyboard = [];

// get categories from backend

axios
  .get(`${backendApi}/category`)
  .then((res) => {
    res.data.forEach((category) => {
      categories.push(category);
    });

    for (let i = 0; i < categories.length / 2; i++) {
      categoriesKeyboard.push([
        categories[i].parent,
        categories[categories.length / 2 + i].parent,
      ]);
    }

    categoriesKeyboard.push(["Go back"]);
  })
  .catch((err) => console.log(err));

axios
  .get(`${backendApi}/products`)
  .then((res) => {
    res.data.products.forEach((category) => {
      categories.push(category);
    });
  })
  .catch((err) => console.log(err));

bot.start((ctx) => {
  // reply with text and keyboard [menu, contact]
  ctx.reply("Welcome to the bot", {
    reply_markup: {
      keyboard: [["Menu", "Contact"]],
      resize_keyboard: true,
    },
  });
});

bot.hears("Menu", (ctx) => {
  // reply with text and keyboard [categories]
  ctx.reply("Choose a category", {
    reply_markup: {
      keyboard: categoriesKeyboard,
      resize_keyboard: true,
    },
  });
});

bot.hears("Contact", (ctx) => {
  ctx.reply("You can always Connect with Us ", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Telegram",
            url: "https://t.me/uzbekistan",
          },
        ],
        [
          {
            text: "Instagram",
            url: "https://www.instagram.com/uzbekistan/",
          },
          {
            text: "Facebook",
            url: "https://www.facebook.com/uzbekistan/",
          },
        ],
        [
          {
            text: "Location",
            url: "https://www.google.com/maps/place/Uzbekistan",
          },
        ],
      ],
    },
  });
});

bot.hears("Go back", (ctx) => {
  ctx.reply("Welcome to the bot", {
    reply_markup: {
      keyboard: [["Menu", "Contact"]],
      resize_keyboard: true,
    },
  });
});

bot.launch();
