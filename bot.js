const Discord = require('discord.js');
const client = new Discord.Client();
const get = require('get-file');
const fs = require('fs');

var Data = {};

client.on("ready", () => {
  // initialize
  console.log('RorgBot Initialized');

  // FETCHREADME FUNCTION
  let rawData = "";
  // fetch data from github
  get('prodzpod/-RorgMod', 'README.md', function(err, res) {
    if (err) return console.error(err);
    res.on('data',function(data){
      rawData += data.toString();
    });
    
    res.on('end',function(){
        // swap github "image" with discord emotes
        rawData = rawData.replace(/!\[Energy\]\(http:\/\/tinyurl\.com\/IroncladEnergy\)/g, "<:red_energy:669488816142155800>");
        rawData = rawData.replace(/!\[Energy\]\(http:\/\/tinyurl\.com\/SilentsEnergy\)/g, "<:green_energy:669488892998844437>");
        rawData = rawData.replace(/!\[Energy\]\(http:\/\/tinyurl\.com\/DefectEnergy\)/g, "<:blue_energy:669488945997938688>");
        rawData = rawData.replace(/!\[Energy\]\(http:\/\/tinyurl\.com\/WatcherEnergy\)/g, "<:purple_energy:669489067439947776>");
        rawData = rawData.replace(/!\[Energy\]\(http:\/\/tinyurl\.com\/ColorlessEnergy\)/g, "<:colorless_energy:669489128651358208>");

        let match;

        // get Cards
        myRegexp = new RegExp(/\* \*\*([^*]+)\*\* \(([^,]+), ([^(),]+), ([^(),]+), ([^(),]+)\)(.+)?\n  \* (.+)/g);

        match = myRegexp.exec(rawData);
        while (match != null) {
          console.log("Detected Card", match[1]);
          Data[match[1]] = '> **' + match[1] + '**\n> ' + match[2] + ' `' + match[3] + '` `' + match[4] + '` `' + match[5] + '`' + (match[6] ? match[6] : '') + '\n> ' + match[7]
          match = myRegexp.exec(rawData);
        }

        // get Relics
        myRegexp = new RegExp(/\* \*\*([^*]+)\*\* \(([^(),]+), ([^(),]+)\)(.+)?\n  \* (.+)/g);

        match = myRegexp.exec(rawData);
        while (match != null) {
          console.log("Detected Relic", match[1]);
          Data[match[1]] = '> **' + match[1] + '**\n> `' + match[2] + '` `' + match[3] + '`' + (match[4] ? match[4] : '') + '\n> ' + match[5]
          match = myRegexp.exec(rawData);
        }
    });
  });
})

client.on("message", message => {
  if (message.content.indexOf("find") + 1 && message.author.id == "472912585121857538") {
message.channel.send("no were not going to change it to find get out")
return
}
  if (message.author.bot) return;
  if (message.content.startsWith("#")) { // detect prefix
    let args = message.content.substring(1).trim().toLowerCase();
    if (!args.length) return; // filter out empty sentences
    if (args == "gay") {
      message.channel.send("@sanfu\n#5819bruh it doesnt exist stop seraching gay sanfu");
      return;
    }
    // MESSAGE FUNCTION //
    let List = []; let exactMatch;
    let myRegExp = new RegExp(args)
    for (let key in Data) {
      if (key.replace(/[^\w ]/g, '').toLowerCase() == args) { // detect exact match
        exactMatch = key;
        break;
      }
      if (key.replace(/[^\w ]/g, '').toLowerCase().match(myRegExp)) // indexOf returns -1 if search fails, -1 + 1 is 0 which is false
        List.push(key)
    }
    
    // lets get this brod
    if (exactMatch) message.channel.send(Data[exactMatch]); // exact matches are considered first
    else if (List.length == 0) // Nothing found
      message.channel.send("> I couldn't find a card/relic named __" + args[0].toUpperCase() + args.substring(1) + "__. Maybe it's in the base game?")
    else if (List.length == 1) // Only 1 thing found
      message.channel.send(Data[List[0]]) // send that
    else if (List.length <= 5) // 5 is arbiturary
      message.channel.send("> We found multiple card/relic related to __" + args[0].toUpperCase() + args.substring(1) + "__. Try: \n> **" + List.join("**, **") + "**")
    else 
      message.channel.send("> We found too many card/relics with that search term. Try putting in more letters.")
  }
});

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

client.login(process.env.BOT_TOKEN);
