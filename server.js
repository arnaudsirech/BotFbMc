const fs = require("fs");
var gis = require('g-i-s');
const login = require("facebook-chat-api");
var child_process = require('child_process');
const credentials = require('./ressources/credentials')

 const arrEnigmes = ["Avant hier, Catherine avait 17 ans ; l'année prochaine, elle aura 20 ans. Comment est-ce possible ?", " Un père et un fils ont à eux deux 36 ans. Sachant que le père a 30 ans de plus que le fils, quel âge a le fils ?", "Un escargot est dans un puits de 10 mètres. Il monte 3 mètres chaque jour et descend 2 mètres chaque nuit. En combien de jours sera-t-il rendu en haut ?", "Si nous ne sommes pas le lendemain de lundi ou le jour avant jeudi, que demain n'est pas dimanche, que ce n'était pas dimanche hier et que le jour d'après-demain n'est pas samedi, et que le jour avant hier n'était pas mercredi, quel jour sommes-nous ?", "Le premier jour, il y a 1 nénuphar sur le lac. Le 2ème jour, il y a 2 nénuphars et chaque jour le nombre de nénuphars double. Au bout de 50 jours, le lac est rempli de nénuphars. Au bout de combien de jour le lac fut-il à moitié plein ?"]

login({email: credentials.login, password: credentials.password}, (err, api) => {
    if(err) return console.error(err);

    const runServer = (ID) => {
        var MCserver =  child_process.exec(__dirname + '/run.bat');
       

        MCserver.stdout.on('data', function(data) {
            // waiting for init message
            if(data.includes('Done')){
                api.sendMessage("Serveur online 👌 ! ", ID);
            }
        });
    }

    api.listenMqtt((err, message) => {

                switch (message.body) {

                    case "!image":
                        filter = message.body.replace('!image', '')
                        // sending one of the three top pictures on google image
                        gis(filter, (err,res) => {
                            var msg = {
                                url: res[(Math.floor(Math.random() * Math.floor(3)))].url
                            }
                            api.sendMessage(msg, message.threadID);
                        });
                        break;
        
                    case "!commands":
                            api.sendMessage("!minecraft !enigme !image <tag>", message.threadID);
                            break;
        
                    case "!minecraft":
                        api.sendMessage("Je lance le serveur mc, comptez une dizaine de secondes...", message.threadID);
                        runServer(message.threadID);
                        break;
        
                    case "!enigme":
                    api.sendMessage(arrEnigmes[(Math.floor(Math.random() * Math.floor(arrEnigmes.length-1)))], message.threadID);
                    break;
         
                    default:
                        break;
                }
        
    });
    


});