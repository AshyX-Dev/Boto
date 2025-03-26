const fs = require("fs");
const crypto = require("crypto");

function createHashPort(){
  const master = (Math.floor( Math.random() * 999999999999 ) - 10000).toString()
  return crypto.createHash("md5").update(master).digest("hex").slice(0, 15).toUpperCase();
}

class JsonCore{
  constructor(){

    if (!(fs.existsSync("fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf"))){
      fs.mkdirSync("fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf");
    }
    
    if (!(fs.existsSync("fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/users.json"))){
      fs.writeFileSync("fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/users.json", "[]");
    }

    if (!(fs.existsSync("fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/authes"))){
      fs.mkdirSync("fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/authes");
    }

  }

  getUsers(){
    return JSON.parse(fs.readFileSync("fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/users.json").toString());
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
      if (user.port.carry.includes(port)){
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
        language: "eng",
        port: { carry: [] }
      }
    )

    fs.writeFileSync(`fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/authes/${userid}.pack`, "[]");
    fs.writeFileSync("fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/users.json", JSON.stringify(users));

    return { status: "OK" };

  }

  changeLanguage(userid, lang){
    const user = this.isExists(userid);
    if (user["status"] !== "OK"){
      return { status: "INVALID_USER_ID" };
    }

    const users = this.getUsers();
    users[user.index]["language"] = lang;

    fs.writeFileSync("fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/users.json", JSON.stringify(users));

    return { status: "OK" };

  }

  hasPort(userid){
    const user = this.isExists(userid);
    if (user["status"] !== "OK"){
      return { status: "INVALID_USER_ID" };
    }
    if (user.user.port.carry.length === 0) return false;
    else return true;
  }

  createPort(userid, mode, dominant, mode_length = 1){
    const user = this.isExists(userid);
    //console.log(user)
    if (user["status"] !== "OK"){
      return { status: "INVALID_USER_ID" };
    }

    let seconds = 0;

    if (mode === "day"){
      seconds = 88400000 * mode_length;
    } else if (mode === "week"){
      seconds = 606000000 * mode_length;
    } else if (mode === "month"){
      seconds = 2600960000 * mode_length;
    } else if (mode === "year"){
      seconds = 37763100000 * mode_length;
    }

    const users = this.getUsers();
    const hashed_port = createHashPort();
    users[user.index]["has_port"] = true;
    users[user.index]["port"]["carry"].push(hashed_port);
    users[user.index]["port"][hashed_port] = {};
    users[user.index]["port"][hashed_port] = {
      mode: mode,
      end: new Date().getTime() + seconds,
      hash: hashed_port,
      dominant: dominant,
      subs: []
    };

    fs.writeFileSync("fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/users.json", JSON.stringify(users));

    return { status: "OK", port: hashed_port };

  }

  removePort(userid, hashed_port) {
    const user = this.isExists(userid);
    if (!(user["status"] === "OK")) {
        return { status: "INVALID_USER_ID" };
    }

    const portCarryIndex = user.user.port.carry.indexOf(hashed_port);

    if (portCarryIndex !== -1) {
        // Remove the hashed_port from the carry array
        user.user.port.carry.splice(portCarryIndex, 1);
        
        // Debugging: Check if hashed_port exists before deletion
        console.log("Before deletion:", user.user.port);
        if (user.user.port.hasOwnProperty(hashed_port)) {
            delete user.user.port[hashed_port];
            console.log(`${hashed_port} deleted.`);
        } else {
            console.log(`${hashed_port} not found in user.user.port.`);
        }
        console.log("After deletion:", user.user.port);
        const c = user.user.port.carry;
        const users = this.getUsers();
        users[user.index]["port"] = user.user.port;
        
        // Update has_port status
        if (user.user.port.carry.length === 0) {
            users[user.index]["has_port"] = false;
        }

        fs.writeFileSync("fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/users.json", JSON.stringify(users));
        console.log("After deletion:", user.user.port);

        return { status: "OK" };
    } else {
        return { status: "INVALID_PORT" };
    }
}

  getAuthesLength(userid){
    const user = this.isExists(userid);
    if (!(user["status"] === "OK")){
      return { status: "INVALID_USER_ID" };
    }

    const by = JSON.parse(fs.readFileSync(`fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/authes/${userid}.pack`).toString());

    return { status: "OK", length: by.length };

  }

  addAuth(userid, port, auth){
    const user = this.isExists(userid);
    if (!(user["status"] === "OK")){
      return { status: "INVALID_USER_ID" };
    }

    const authes = JSON.parse(fs.readFileSync(`fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/authes/${userid}.pack`).toString());
    authes.push(auth);
    
    fs.writeFileSync(`fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/authes/${userid}.pack`, JSON.stringify(authes));

    for (let sub of user.user[port].subs){
      const authes = JSON.parse(fs.readFileSync(`fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/authes/${sub}.pack`).toString());
      authes.push(auth);
      fs.writeFileSync(`fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/authes/${sub}.pack`, JSON.stringify(authes));
    }

    return { status: "OK" };

  }

  addSub(userid, subx, for_port){
    const user = this.isExists(userid);
    const sub = this.isExists(subx);
    const users = this.getUsers();
    if (user.status == "OK"){
      if (sub.status == "OK"){
        if (user.user.has_port){
          if (sub.user.has_port){
            if (user.user.port.carry.includes(for_port)){
              if (user.user.port[for_port].subs.length != 5){
                user.user.port[for_port].subs.push(sub.user.userid);
                users[user.index] = user.user;
                fs.writeFileSync(`fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/users.json`, JSON.stringify(users));
                return { status: "OK" };
              } else { return { status: "MAX_SUBS" } }
            } else { return { status: "INVALID_PORT" } }
          } else { return { status: "SUB_HAS_NO_PORT" } }
        } else { return { status: "USER_HAS_NO_PORT" } }
      } else { return { status: "INVALID_SUB" } }
    } else { return { status: "INVALD_USER" } }
  }

  removeSub(userid, sub, from_port){
    const user = this.isExists(userid);
    if (user.status == "OK"){
      const users = this.getUsers();
      if (user.user.port.carry.includes(from_port)){
        if (user.user.port[from_port].subs.includes(sub)){
          const subs = user.user.port[from_port].subs;
          const sub_index = subs.indexOf(sub);
          subs.splice(sub_index, 1);
          user.user.port[from_port].subs = subs;
          users[user.index] = user.user;
          fs.writeFileSync(`fdsuhfdushfsdf9hdsf89hsd9fh8dsfsdfuhusdfusdfsdf/users.json`, JSON.stringify(users));
          return { status: "OK" }
        } else { return { status: "NO_INCLUDE_FOUND" } }
      } else { return { status: "INVALID_PORT" } }
    } else { return { status: "INVALID_USER" } }
  }

  getPort(userid, port){
    const user = this.isExists(userid);
    if (!(user["status"] === "OK")){
      return { status: "INVALID_USER_ID" };
    }

    for (let portx of user.user.port.carry){
      if (portx === port){
        return { status: "OK", port: user.user.port[port] };
      }
    }

    return { status: "INVALID_PORT" };

  }

}

/*
const js = new JsonCore();
console.log(js.getUsers());
console.log(js.addUser(10));
*/

module.exports = { JsonCore };
