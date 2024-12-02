const TelegramBot = require("node-telegram-bot-api");

const token = "6811500600:AAHVWxtcJXMiY65VvJxUOBvUGXI4yq0C4So";

const bot = new TelegramBot(token, { polling: true });

const fs = require("fs");
const ytdl = require("ytdl-core");
// bot.onText(/^[/!#]delete$/, (msg) => {
//   bot.deleteMessage(msg.chat.id, msg.reply_to_message.id, (forma = {}));
// }); // test
bot.setMyCommands([
  { command: "/start", description: "Start" },
  {
    command: "/info",
    description: "Mening mashinamni ko'rishni hohlaysizmi..",
  },
  { command: "/game", description: "O'yin o'ynaymizmi" },
]);
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  //   const fulName = msg.from.first_name;
  //   const userName = msg.from.username;
  //   console.log(msg);
  if (msg.text == "/start") {
    bot.deleteMessage(msg.chat.id, msg.message_id);
    bot.sendMessage(
      chatId,
      `Salom  ${msg.from.first_name} YuklaBotga hushkelibsiz. Menga YouTube dan link tashlang uni sizga yuklab beraman 🔥tekinga🔥 `,
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: "Send location",
                request_location: true,
              },
            ],
            [
              {
                text: "Send contact",
                request_contact: true,
              },
            ],
            [{ text: "Berkitish" }],
          ],
        },
      }
    );
  } else if (msg.text == "Berkitish") {
    bot.sendMessage(chatId, "Berkitildi", {
      reply_markup: {
        remove_keyboard: true,
      },
    });
    bot.deleteMessage(msg.chat.id, msg.message_id);
    bot.deleteMessage(msg.chat.id, msg.message_id + 1);
  } else if (ytdl.validateURL(msg.text)) {
    setTimeout(() => {
      bot.deleteMessage(msg.chat.id, msg.message_id + 1);
    }, 100);
    async function repleceVideo() {
      try {
        bot.sendMessage(chatId, "Link qabul qilindi").then(() => {
          setTimeout(() => {
            bot.deleteMessage(msg.chat.id, msg.message_id);
            bot.deleteMessage(msg.chat.id, msg.message_id + 1);
          }, 2000);
        });
        let info = await ytdl.getInfo(msg.text);
        let video_name = info.videoDetails.title;

        const video = ytdl(msg.text);
        video.pipe(fs.createWriteStream(`./videos/${video_name}.mp4`));
        video.once("response", () => {
          //   async function downVideo() {
          //     try {
          //       await bot.sendMessage(chatId, "Video yuklanmoqda").then(() => {
          //         setTimeout(() => {
          //           bot.deleteMessage(chatId, msg.message_id);
          //         }, 1500);
          //       });
          //     } catch (error) {
          //       console.log(error);
          //     }
          //   }
          //   downVideo();
        });
        // video.on("data", (chunk) => {
        //   progress += chunk.length;
        //   //   console.log(Math.round((100 * progress) / total) + " %");
        //   bot.sendMessage(chatId, "progress");
        //   //   console.log(chunk);
        // });

        video.on("end", () => {
          bot.sendVideo(chatId, `./videos/${video_name}.mp4`);
        });
      } catch (error) {
        console.log(error);
      }
    }
    repleceVideo();
  } else {
    async function sendText() {
      try {
        bot.deleteMessage(msg.chat.id, msg.message_id);
        bot.sendMessage(chatId, "Eeee bu link masu ").then(() => {
          let msgId = msg.message_id + 1;
          setTimeout(() => {
            bot.deleteMessage(msg.chat.id, msgId);
          }, 1500);
        });
      } catch (error) {
        bot.sendMessage(chatId, error);
      }
    }
    sendText();
  }
});

//=====================================arxivlar start=================================
// bot.deleteMessage(msg.chat.id, msg.message_id); // https://github.com/yagop/node-telegram-bot-api/issues/328       <= bu manba =
// https://youtu.be/LOZunrTfMJ8?si=I3_mF41WfKJkP4k_      <== youyube video example
// ytdl(msg.text).pipe(fs.createWriteStream(`./videos/${video_name}.mp4`)); <=== bu video jo'natish
//=====================================arxivlar end=================================
