//const token = "7809497412:AAHIEaxA1Ma6n-Y9ClkXh8XcTTjSWY0UNew";
const token = "8024030285:AAHK1G3DWTRrzzJehp8doQm0rV7MXGvzFYI";
const admins = [5483232752];

const TelegramBot = require("node-telegram-bot-api");
const { JsonCore } = require("./jsoncore.js");
const express = require("express");
const fs = require("fs");
//const expressWs = require("express-ws");

const bot = new TelegramBot(token, { polling: true });
const jsc = new JsonCore();
const web = express();
//expressWs(web);
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

/*
function convertSeconds(seconds) {
    const secondsInMinute = 60;
    const secondsInHour = 60 * secondsInMinute;
    const secondsInDay = 24 * secondsInHour;
    const secondsInMonth = 30 * secondsInDay;
    const secondsInYear = 12 * secondsInMonth;

    let years = Math.floor(seconds / secondsInYear);
    seconds %= secondsInYear;

    let months = Math.floor(seconds / secondsInMonth);
    seconds %= secondsInMonth;

    let days = Math.floor(seconds / secondsInDay);
    seconds %= secondsInDay;

    let hours = Math.floor(seconds / secondsInHour);
    seconds %= secondsInHour;

    let minutes = Math.floor(seconds / secondsInMinute);
    seconds %= secondsInMinute;

    return {
        years,
        months,
        days,
        hours,
        minutes,
        seconds
    };
}


function convertSeconds(seconds) {
    const secondsInDay = 24 * 60 * 60; // تعداد ثانیه‌ها در یک روز
    const secondsInWeek = 7 * secondsInDay; // تعداد ثانیه‌ها در یک هفته
    const secondsInMonth = 30 * secondsInDay; // تعداد ثانیه‌ها در یک ماه (تقریبی)
    const secondsInYear = 12 * secondsInMonth; // تعداد ثانیه‌ها در یک سال (تقریبی)

    let years = Math.floor(seconds / secondsInYear);
    seconds %= secondsInYear;

    let months = Math.floor(seconds / secondsInMonth);
    seconds %= secondsInMonth;

    let weeks = Math.floor(seconds / secondsInWeek);
    seconds %= secondsInWeek;

    let days = Math.floor(seconds / secondsInDay);
    seconds %= secondsInDay;

    // نمایش نتایج
    return {
        years,
        months,
        weeks,
        days
    };
}



// مثال استفاده:
//const futureTime = convertSeconds(1000000000); // تعداد ثانیه‌ها را به عنوان ورودی وارد کنید
//console.log(futureTime); // { years: ..., months: ..., weeks: ..., days: ... }

function convertMilliseconds(milliseconds) {
    const millisecondsInDay = 24 * 60 * 60 * 1000; // تعداد میلی‌ثانیه‌ها در یک روز
    const millisecondsInWeek = 7 * millisecondsInDay; // تعداد میلی‌ثانیه‌ها در یک هفته
    const millisecondsInMonth = 30 * millisecondsInDay; // تعداد میلی‌ثانیه‌ها در یک ماه (تقریبی)
    const millisecondsInYear = 12 * millisecondsInMonth; // تعداد میلی‌ثانیه‌ها در یک سال (تقریبی)

    let years = Math.floor(milliseconds / millisecondsInYear);
    milliseconds %= millisecondsInYear;

    let months = Math.floor(milliseconds / millisecondsInMonth);
    milliseconds %= millisecondsInMonth;

    let weeks = Math.floor(milliseconds / millisecondsInWeek);
    milliseconds %= millisecondsInWeek;

    let days = Math.floor(milliseconds / millisecondsInDay);
    milliseconds %= millisecondsInDay;

    // نمایش نتایج
    return {
        years,
        months,
        weeks,
        days
    };
}

// مثال استفاده:
//const futureTime = convertMilliseconds(1000000000000); // تعداد میلی‌ثانیه‌ها را به عنوان ورودی وارد کنید
//console.log(futureTime); // { years: ..., months: ..., weeks: ..., days: ... }
*/

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

// مثال استفاده:
//const futureTime = convertMilliseconds(1000000000000); // تعداد میلی‌ثانیه‌ها را به عنوان ورودی وارد کنید
//console.log(futureTime); // { years: ..., months: ..., weeks: ..., days: ..., hours: ..., minutes: ..., seconds: ... }

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

bot.on("message", (msg) => {
  msg.text = msg.text.toLowerCase();
  //console.log(msg)
  if (admins.includes(msg.from.id)){
    if (msg.text === "/start"){
      bot.sendMessage(
        msg.chat.id,
        makeFont("Admin Panel 💬\n\n/port <...userid...> <...mode...> ☎️\n/delport <...userid...>"),
        { reply_to_message_id: msg.message_id }
      )
    } else if (msg.text.startsWith("/port")){
      const spls = msg.text.split(" ");
      const uid = parseInt(spls[1]);
      const mode = spls[2];
      const stat = jsc.createPort(uid, mode);
      console.log(stat)
      if (stat["status"] === 'OK'){
        bot.sendMessage(
          msg.chat.id,
          makeFont(`Port added ! 🧭\n\n🎫 Port owner: ${uid}\n🍭 Mode: ${mode}\n🔹️ Created port: ${stat.port} | `) + `<code>${stat.port}</code>`,
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

          fs.writeFileSync("users.json", JSON.stringify(users));
          bot.sendMessage(msg.chat.id, makeFont("changes saved 🎖"), { reply_to_message_id: msg.message_id })

        } else { bot.sendMessage(msg.chat.id, makeFont("user has no port 🌐"), { reply_to_message_id: msg.message_id }) }
      } else { bot.sendMessage(msg.chat.id, makeFont("invalid userid 🛑"), { reply_to_message_id: msg.message_id }) }
    }
  }

  if (msg.text === "/install"){
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
  } else if (msg.text === "/profile"){
    const user = jsc.isExists(msg.from.id);
    if (user["status"] === "OK"){
      let message = `Profile Page🧩🔮\n\n🎟 Uid: ${user["user"]["userid"]}`;
      if (user["user"]["has_port"]){
        let ud = convertMilliseconds(user["user"]["port"]["end"] - new Date().getTime());
       // if (ud.year)
        message += "\n🪡 Has port: true";
        //console.log(ud)
        //console.log(new Date().getTime())
        ///
        /*
        if (ud.years == 0){
          if (ud.months == 0){
            if (ud.weeks == 0){
              //if (ud.days == 0){
                //if (ud.hours == 0){
                    message += `\n🔋 Will end in ${ud.days} days`;
                  //} else { message += `\n🔋 Will end in ${ud.minutes} minutes`; }
                //} else { message += `\n🔋 Will end in ${ud.hours} hours`; }
              } else { message += `\n🔋 Will end in ${ud.weeks} weeks`; }
            } else { message += `\n🔋 Will end in ${ud.months} months`; }
            } else { message += `\n🔋 Will end in ${ud.years} years`; }
        */
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
        message += `\n👥️ Subscribers: ${JSON.stringify(user.user.subs, null, 2)}`
        message += `\n🔦 Port: `;
        bot.sendMessage(msg.chat.id, makeFont(message) + `<code>${user["user"]["port"]["hash"]}</code>` + makeFont("\n\n📌 Note: make sure you started bot in pv •"), { reply_to_message_id: msg.message_id, parse_mode: "HTML", reply_markup: { inline_keyboard: [ [{ text: makeFont("get session 📥"), callback_data: "getSession" }] ] } })
        } else { message += `\n🪡 Has port: false`; bot.sendMessage(msg.chat.id, makeFont(message) + makeFont("\n\n📌 Note: make sure you started bot in pv •") , { reply_to_message_id: msg.message_id, parse_mode: "HTML" }) }
      /*
        message += `\n🎞 Port mode: ${user["user"]["port"]["mode"]}`;
        message += `\n🔦 Port: ${user["user"]["port"]["hash"]} | `
      */
        //bot.sendMessage(msg.chat.id, makeFont(message), { reply_to_message_id: msg.message_id, parse_mode: "HTML" })
      } else {
        bot.sendMessage(msg.chat.id, makeFont("sign up with /install first 🥃"), { reply_to_message_id: msg.message_id })
      }
    } else if (msg.text == "/report"){
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
  }

})

bot.on("callback_query", (call) => {
  const user = jsc.isExists(call.from.id);
  //console.log(call.message.reply_to_message)
  if (call.from.id == call.message.reply_to_message.from.id && user["status"] == "OK"){
    if (user["user"]["has_port"]){
      try{
          bot.sendDocument(call.from.id, `authes/${call.from.id}.pack`);
      } catch (e) {
        bot.sendMessage(call.chat.id, makeFont("Please start bot in PV first ! 💬"), { reply_to_message_id: call.message.message_id })
      }
    }
  }
})

setInterval(() => {checkUsers()}, 60000);
web.listen(8080, "0.0.0.0", () => { console.log("connected"); })
