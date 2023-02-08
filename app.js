const { Telegraf } = require("telegraf");
require("dotenv").config();
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);
const backendApi = process.env.BACKEND_API;

const categories = [];
const categoriesKeyboard = [];
const categoriesName = [];
const products = [];
const activeCategory = {};

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

    categories.map((category) => {
      categoriesName.push(category.parent.trim());
    });

    categoriesKeyboard.push(["Назад"]);
  })
  .catch((err) => console.log(err));

axios
  .get(`${backendApi}/products`)
  .then((res) => {
    res.data.products.forEach((product) => {
      products.push(product);
    });
  })
  .catch((err) => console.log(err));

bot.start((ctx) => {
  ctx.replyWithHTML(
    `Здравствуйте ${ctx.from.username}! \n\nДобро пожаловать в наш бот
 \n\nВы всегда можете связаться с нами
 \n\n<b>Telegram</b> : @mone_cafe \n\n<b>Instagram</b> : @mone_cafe \n\n<b>Facebook</b> : @mone_cafe`,
    {
      reply_markup: {
        keyboard: [["Меню", "Контакт"], ["Заказ"]],
        resize_keyboard: true,
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
            url: "https://t.me/uzbekistan",
          },
          {
            text: "Адрес",
            callback_data: "location",
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

bot.hears("Назад Меню", (ctx) => {
  ctx.reply("Choose a category", {
    reply_markup: {
      keyboard: categoriesKeyboard,
      resize_keyboard: true,
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
    "Вы можете посетить наши филиалы с 8:00 до 18:00. Все филиалы работают каждый день",
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
  ctx.replyWithLocation(41.311081, 69.240562);
});

bot.action("branch2", (ctx) => {
  // send location of branch 2
  ctx.replyWithLocation(41.311081, 69.240562);
});

bot.action("branch3", (ctx) => {
  // send location of branch 3
  ctx.replyWithLocation(41.311081, 69.240562);
});

bot.action("menu", (ctx) => {
  // go to telegram channel
  ctx.replyWithHTML("Вы можете посмотреть наше меню в нашем канале 👇", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Канал",
            url: "https://t.me/uzbekistan",
          },
        ],
      ],
    },
  });
});

bot.on("message", (ctx) => {
  if (
    categoriesName.includes(ctx.message.text) &&
    products.filter((product) => product.parent === ctx.message.text).length > 0
  ) {
    activeCategory.name = ctx.message.text;

    products.filter((product) => product.parent === ctx.message.text).length > 5
      ? ctx.reply("0-5 торты", {
          reply_markup: {
            keyboard: [["Назад Меню", "5-10"]],
            resize_keyboard: true,
          },
        })
      : ctx.reply("Других фото в этом категории 😞", {
          reply_markup: {
            keyboard: [["Назад Меню"]],
            resize_keyboard: true,
          },
        });

    products
      .filter((product) => product.parent === ctx.message.text)
      .forEach((product, index) => {
        if (index < 5) {
          // send photo with inline keyboard
          ctx.replyWithPhoto(product.image, {
            caption: `#${product.parent} - ${product.title}`,
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Заказать",
                    url: "https://t.me/Salesmanager_mone",
                  },
                ],
              ],
            },
          });
        }
      });
  } else if (ctx.message.text === "5-10") {
    products.filter((product) => product.parent === activeCategory.name)
      .length > 10
      ? ctx.reply("5-10 торты", {
          reply_markup: {
            keyboard: [["Назад Меню", "10-15"]],
            resize_keyboard: true,
          },
        })
      : ctx.reply("Других фото в этом категории 😞", {
          reply_markup: {
            keyboard: [["Назад Меню"]],
            resize_keyboard: true,
          },
        });

    products.map((product, index) => {
      if (index > 4 && index < 10 && product.parent === activeCategory.name) {
        ctx.replyWithPhoto(product.image, {
          caption: `#${product.parent} - ${product.title}`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Заказать",
                  url: "https://t.me/Salesmanager_mone",
                },
              ],
            ],
          },
        });
      }
    });
  } else if (ctx.message.text === "10-15") {
    products.filter((product) => product.parent === activeCategory.name)
      .length > 15
      ? ctx.reply("10-15 торты", {
          reply_markup: {
            keyboard: [["Назад Меню", "15-20"]],
            resize_keyboard: true,
          },
        })
      : ctx.reply("Других фото в этом категории 😞", {
          reply_markup: {
            keyboard: [["Назад Меню"]],
            resize_keyboard: true,
          },
        });

    products.forEach((product, index) => {
      if (index > 9 && index < 15 && product.parent === activeCategory.name) {
        ctx.replyWithPhoto(product.image, {
          caption: `#${product.parent} - ${product.title}`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Заказать",
                  url: "https://t.me/Salesmanager_mone",
                },
              ],
            ],
          },
        });
      }
    });
  } else if (ctx.message.text === "15-20") {
    products.filter((product) => product.parent === activeCategory.name)
      .length > 20
      ? ctx.reply("15-20 торты", {
          reply_markup: {
            keyboard: [["Назад Меню", "20-25"]],
            resize_keyboard: true,
          },
        })
      : ctx.reply("Других фото в этом категории 😞", {
          reply_markup: {
            keyboard: [["Назад Меню"]],
            resize_keyboard: true,
          },
        });

    products.forEach((product, index) => {
      if (index > 14 && index < 20 && product.parent === activeCategory.name) {
        ctx.replyWithPhoto(product.image, {
          caption: `#${product.parent} - ${product.title}`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Заказать",
                  url: "https://t.me/Salesmanager_mone",
                },
              ],
            ],
          },
        });
      }
    });
  } else if (ctx.message.text === "20-25") {
    products.filter((product) => product.parent === activeCategory.name)
      .length > 25
      ? ctx.reply("20-25 торты", {
          reply_markup: {
            keyboard: [["Назад Меню", "25-30"]],
            resize_keyboard: true,
          },
        })
      : ctx.reply("Других фото в этом категории 😞", {
          reply_markup: {
            keyboard: [["Назад Меню"]],
            resize_keyboard: true,
          },
        });

    products.forEach((product, index) => {
      if (index > 19 && index < 25 && product.parent === activeCategory.name) {
        ctx.replyWithPhoto(product.image, {
          caption: `#${product.parent} - ${product.title}`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Заказать",
                  url: "https://t.me/Salesmanager_mone",
                },
              ],
            ],
          },
        });
      }
    });
  } else if (ctx.message.text === "25-30") {
    products.filter((product) => product.parent === activeCategory.name)
      .length > 30
      ? ctx.reply("25-30 торты", {
          reply_markup: {
            keyboard: [["Назад Меню", "30-35"]],
            resize_keyboard: true,
          },
        })
      : ctx.reply("Других фото в этом категории 😞", {
          reply_markup: {
            keyboard: [["Назад Меню"]],
            resize_keyboard: true,
          },
        });

    products.forEach((product, index) => {
      if (index > 24 && index < 30 && product.parent === activeCategory.name) {
        ctx.replyWithPhoto(product.image, {
          caption: `#${product.parent} - ${product.title}`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Заказать",
                  url: "https://t.me/Salesmanager_mone",
                },
              ],
            ],
          },
        });
      }
    });
  } else if (ctx.message.text === "30-35") {
    products.filter((product) => product.parent === activeCategory.name)
      .length > 35
      ? ctx.reply("30-35 торты", {
          reply_markup: {
            keyboard: [["Назад Меню", "35-40"]],
            resize_keyboard: true,
          },
        })
      : ctx.reply("Других фото в этом категории 😞", {
          reply_markup: {
            keyboard: [["Назад Меню"]],
            resize_keyboard: true,
          },
        });

    products.forEach((product, index) => {
      if (index > 29 && index < 35 && product.parent === activeCategory.name) {
        ctx.replyWithPhoto(product.image, {
          caption: `#${product.parent} - ${product.title}`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Заказать",
                  url: "https://t.me/Salesmanager_mone",
                },
              ],
            ],
          },
        });
      }
    });
  } else {
    ctx.reply("Других фото в этом категории 😞");
  }
});

bot.launch();
