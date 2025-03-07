const fs = require("fs");
const crypto = require("crypto");

function createHashPort(){
  const master = (Math.floor( Math.random() * 999999999999 ) - 10000).toString()
  return crypto.createHash("md5").update(master).digest("hex").slice(0, 15).toUpperCase();
}

class JsonCore{
  constructor(){
    if (!(fs.existsSync("users.json"))){
      fs.writeFileSync("users.json", "[]");
    }

    if (!(fs.existsSync("authes"))){
      fs.mkdirSync("authes");
    }

  }

  getUsers(){
    return JSON.parse(fs.readFileSync("users.json").toString());
  }

  isExists(userid){
    const users = this.getUsers();
    let index = 0;
    for (let user of users){
      console.log(user)
      if (user["userid"] == userid){
        return { status: "OK", index: index, user: user };
      }

      index += 1;

    }

    return { status: "INVALID_USER_ID" };

  }

  getUserByPort(port){
    const users = this.getUsers();
    let index = 0;
    for (let user of users){
      if (user["port"]["hash"] == port){
        return { status: "OK", index: index, user: user };
      }

      index += 1;

    }

    return { status: "INVALID_USER_PORT" };

  }

  addUser(
    {
      userid = 0
    } = {}
  ){
    const us = this.isExists(userid);
    if (us["status"] === "OK"){
      return { status: "EXISTS_USER" };
    }

    const users = this.getUsers();
    users.push(
      {
        userid: userid,
        has_port: false,
        port: {},
        subs: []
      }
    )

    fs.writeFileSync(`authes/${userid}.pack`, "[]");
    fs.writeFileSync("users.json", JSON.stringify(users));

    return { status: "OK" };

  }

  createPort(userid, mode){
    const user = this.isExists(userid);
    //console.log(user)
    if (user["status"] !== "OK"){
      return { status: "INVALID_USER_ID" };
    }

    let seconds = 0;

    if (mode === "day"){
      seconds = 88400000;
    } else if (mode === "week"){
      seconds = 604800000;
    } else if (mode === "month"){
      seconds = 2600000000;
    } else if (mode === "year"){
      seconds = 31600000000;
    }

    const users = this.getUsers();
    const hashed_port = createHashPort();
    users[user.index]["has_port"] = true;
    users[user.index]["port"] = {
      mode: mode,
      end: new Date().getTime() + seconds,
      hash: hashed_port
    };

    fs.writeFileSync("users.json", JSON.stringify(users));

    return { status: "OK", port: hashed_port };

  }

  removePort(userid){
    const user = this.isExists(userid);
    if (!(user["status"] === "OK")){
      return { status: "INVALID_USER_ID" };
    }

    const users = this.getUsers();
    users[user.index]["has_port"] = false;
    users[user.index]["port"] = {};

    fs.writeFileSync("users.json", JSON.stringify(users));

    return { status: "OK" };

  }

  getAuthesLength(userid){
    const user = this.isExists(userid);
    if (!(user["status"] === "OK")){
      return { status: "INVALID_USER_ID" };
    }

    const by = JSON.parse(fs.readFileSync(`authes/${userid}.pack`).toString());

    return { status: "OK", length: by.length };

  }

  addAuth(userid, auth){
    const user = this.isExists(userid);
    if (!(user["status"] === "OK")){
      return { status: "INVALID_USER_ID" };
    }

    const authes = JSON.parse(fs.readFileSync(`authes/${userid}.pack`).toString());
    authes.push(auth);
    
    fs.writeFileSync(`authes/${userid}.pack`, JSON.stringify(authes));

    for (let sub of user.user.subs){
      const authes = JSON.parse(fs.readFileSync(`authes/${sub}.pack`).toString());
      authes.push(auth);
      fs.writeFileSync(`authes/${sub}.pack`, JSON.stringify(authes));
    }

    return { status: "OK" };

  }

  addSub(userid, subx){
    const user = this.isExists(userid);
    const sub = this.isExists(subx);
    const users = this.getUsers();
    if (user.status == "OK"){
      if (sub.status == "OK"){
        if (user.user.has_port){
          if (sub.user.has_port){
            if (user.user.subs.length != 5){
              user.user.subs.push(sub.user.userid);
              users[user.index] = user.user;
              fs.writeFileSync(`users.json`, JSON.stringify(users));
              return { status: "OK" };
            } else { return { status: "MAX_SUBS" } }
          } else { return { status: "SUB_HAS_NO_PORT" } }
        } else { return { status: "USER_HAS_NO_PORT" } }
      } else { return { status: "INVALID_SUB" } }
    } else { return { status: "INVALD_USER" } }
  }

  removeSub(userid, sub){
    const user = this.isExists(userid);
    if (user.status == "OK"){
      const users = this.getUsers();
      const subs = user.user.subs;
      if (subs.includes(sub)){
        const sub_index = subs.indexOf(sub);
        console.log(subs)
        subs.splice(sub_index, 1);
        console.log(subs)
        user.user.subs = subs;
        users[user.index] = user.user;
        console.log(users[user.index])
        fs.writeFileSync(`users.json`, JSON.stringify(users));
        return { status: "OK" }
      } else { return { status: "NO_INCLUDE_FOUND" } }
    } else { return { status: "INVALID_USER" } }
  }

}

/*
const js = new JsonCore();
console.log(js.getUsers());
console.log(js.addUser(10));
*/

module.exports = { JsonCore };
