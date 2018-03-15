




var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var os = require('os')
app.set('port', (process.env.PORT || 5000))



var jsonParser = bodyParser.json();
//app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot and I will send a push now')
})

app.get('/sendpush', function (req, res) {
    sendGenericMessage('1441264492560807')
    sendGenericAccaddeOggi('1417913761586201')
    res.send('Push just sent to 1441264492560807 and 1417913761586201')
})

// for Facebook verification
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'a4bd86e22cd33fd594a598181fa3049d') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})





// Spin up the server
app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'))

})

app.post('/webhook', jsonParser, function (req, res) {
    messaging_events = req.body.entry[0].messaging

    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            //console.log("event.message.text = " + text)


            if (text.toLowerCase() === 'news') {
                sendGenericMessage(sender)
                SaveSender(sender)
                //console.log("sendGenericMessage (news)")
                continue
            }

            if (text.toLowerCase() === 'accadde oggi') {
                sendGenericAccaddeOggi(sender)
                //console.log("sendGenericAccaddeOggi")
                continue
            }
            if (text.toLowerCase() === 'si, disattiva') {
                console.log("ActivatePushSender(postback, 0)")
                ActivatePushSender(sender, 0)
                continue
            }
            if (text.length > 50) {
                sendTextMessage(sender, "Aspetta, aspetta! Mi dispiace sono solo un bot e non riesco ancora a leggere frasi lunghe. Usa il menu o scrivi Help per sapere quali parole utilizzare. Grazie")
                continue
            }
            if (text.toLowerCase() === 'guida tv') {
                sendTextMessage(sender, "La guida tv è accessibile dal menu")
                continue
            }
			 if (text.toLowerCase() === 'ciao') {
                sendTextMessage(sender, "Ciao, sono il bot di Rai Storia!")
                continue
            }
			 if (text.toLowerCase() === 'buongiorno') {
                sendTextMessage(sender, "Buongiorno anche a te, sono il bot di Rai Storia!")
                continue
            }
			 if (text.toLowerCase() === 'buonasera') {
                sendTextMessage(sender, "Buonasera anche a te,sono il bot di Rai Storia!")
                continue
            }
            if (text.toLowerCase() === 'si, attiva') {
                console.log("ActivatePushSender(postback, 1)")
                ActivatePushSender(sender, 1)
                continue
            }
            if (text.toLowerCase() === 'no, grazie') {
                console.log("ha risposto: no, grazie")
                continue
            }

            if (text.toLowerCase() === 'help') {
                sendGenericMessageHelp(sender)
                continue
            }
            
              sendGenericCerca(sender,text.substring(0, 200))
       //     sendTextMessage(sender, "Hai scritto " + text.substring(0, 200) + ", non è un comando valido. Se hai bisogno scrivi Help")


        }

        if (event.postback) {
            var text = JSON.stringify(event.postback.payload)
            if (text.toLowerCase() === "\"inizia\"") {
                sendTextMessage(sender, "Buongiorno, stiamo lavorando ad una versione Beta del Bot Messenger di Rai Storia per rispondere rapidamente a tutti gli utenti.\n Per ora è possibile utilizzare alcuni comandi o cercare video utilizzando parole chiave. \n \n Per sapere quali comandi utilizzare digita Help o seleziona le voci dal menù.", token)
                SaveSender(sender)
                continue

            }
            else if (text.toLowerCase() === "\"start\"") {
                sendTextMessage(sender, "Benvenuto, digita News", token)
                SaveSender(sender)
                continue

            }
            else if (text.toLowerCase() === "\"news\"") {
                sendGenericMessage(sender)
                console.log("save sender starting: " + sender)
                SaveSender(sender)
                //console.log("sendGenericMessage (news - postback)")
                console.log("save sender starting " + sender)
                continue

            }

            else if (text.toLowerCase() === "\"accadde\"") {
                sendGenericAccaddeOggi(sender)
                //console.log("sendGenericAccaddeOggi (postback)")
                continue

            }
            else if (text.toLowerCase() === "\"notifiche\"") {
                console.log("sendQuickAnswer(postback)")
                sendQuickAnswer(sender)
                continue

            }
			
			  else if (text.toLowerCase() === "\"cerca\"") {
                sendGenericAccaddeOggi(sender)
                
                continue

            }
            else if (text.toLowerCase() === "\"disattivasi\"") {
                console.log("ActivatePushSender(postback, 0)")
                ActivatePushSender(sender, 0)
                continue

            }
            else if (text.toLowerCase() === "\"disattivano\"") {
                console.log("ActivatePushSender(postback,1)")
                ActivatePushSender(sender, 1)
                continue

            }

                /* 	 	else if (text.toLowerCase() === "\"guida tv\"") {
                            
                            //  vedere come fare 
                sendGenericGuidaTV(sender)
                //	sendGenericMessageHelp(sender)
                                continue
        
                     } */



            else if (text.toLowerCase() === "\"help\"") {
                sendGenericMessageHelp(sender)
                continue

            }

            else if (text.toLowerCase() === "\"Disattiva\"") {
                sendDisattiva(sender)
                continue

            }

        }

    }

    res.sendStatus(200)
})

var token = "EAANch1rmYo4BAGACvAPZBVopuZB3jOKtUFTisGBEO0C0kJuqHve4ITEQNr0l74y1b7iZA0rid2QKlGjAeF5briYSTgTzvgETJXkDnBPjVj8FEzRN59u2gujQuPi47pbkWpv0wJm9FYLqeUCTO2RnQUZAbIQnhd1NRXZCifnnGoQZDZD"



function sendTextMessage(sender, text) {

    let messageData = { text: text }
    request({
        url: 'https://graph.facebook.com/v2.8/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendDisattiva(sender) {

    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements":

			  [{
			      "title": "Help",
			      "subtitle": "Scrivi News per ricevere le ultime notizie da Rai Storia"

			  }, {

			      "title": "Disattiva",
			      "subtitle": "Scrivi 'si, disattiva' per non ricevere più messaggi"

			  }]


            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'DELETE',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

}


function sendGenericMessageHelp(sender) {

    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements":

			  [{
			      "title": "News",
			      "subtitle": "Scrivi News per ricevere le ultime notizie da Rai Storia"

			  }, {

			      "title": "Accadde Oggi",
			      "subtitle": "Scrivi Accadde Oggi per gli avvenimenti del giorno"

			  }
			   

, {

    "title": "Guida TV",
    "subtitle": "Scegli Guida TV dal menu per la programmazione"

}

, {

    "title": "Disattiva",
    "subtitle": "Scegli Notifiche dal menu per disattivare"

}


			  ]


            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

}
var elements = "";

/*function accaddeoggi() {

    var request = require('request');
    request('http://www.raistoria.rai.it/storiabot/bot-accaddeoggi.aspx', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            elements = body;
            console.log(body)
        }
    })


}*/


function sendGenericCerca(sender, parola) {

    // #Giuseppe visto che la chiamata a bot-accaddeoggi.aspx è asincrona la chiamata alla messages può essere fatta 
    // solo dopo che la risposta a bot-accaddeoggi.aspx è arrivata; per questo la chiamata ad accaddeoggi() è inutile;
    // portava al problema della risposta posticipata
    //accaddeoggi();
    //storia();
    var request = require('request');
    var statraiplay = '&wt_mc=2.maap.fbbot.raicultura_nomeprogramma.&wt';
    request('http://www.raistoria.rai.it/storiabot/cerca.aspx?S=' + parola + statraiplay, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            messageData = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": body
                    }
                }
            }
            request({
                url: 'https://graph.facebook.com/v2.6/me/messages',
                qs: { access_token: token },
                method: 'POST',
                json: {
                    recipient: { id: sender },
                    message: messageData,
                }
            }, function (error, response, body) {
                if (error) {
                    console.log('Error sending messages: ', error)
                } else if (response.body.error) {
                    console.log('Error: ', response.body.error)
                }
            })
        }
    })
}



function sendGenericAccaddeOggi(sender) {

    // #Giuseppe visto che la chiamata a bot-accaddeoggi.aspx è asincrona la chiamata alla messages può essere fatta 
    // solo dopo che la risposta a bot-accaddeoggi.aspx è arrivata; per questo la chiamata ad accaddeoggi() è inutile;
    // portava al problema della risposta posticipata
    //accaddeoggi();
    //storia();
    var request = require('request');
    request('http://www.raistoria.rai.it/storiabot/bot-accaddeoggi.aspx', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            messageData = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": body
                    }
                }
            }
            request({
                url: 'https://graph.facebook.com/v2.6/me/messages',
                qs: { access_token: token },
                method: 'POST',
                json: {
                    recipient: { id: sender },
                    message: messageData,
                }
            }, function (error, response, body) {
                if (error) {
                    console.log('Error sending messages: ', error)
                } else if (response.body.error) {
                    console.log('Error: ', response.body.error)
                }
            })
        }
    })
}

function sendQuickAnswer(sender)
{
    // distinguere se l'utente ha o meno le notifiche abilitate..
    var request = require('request');
    var messageData = "";
    console.log("sendQuickAnswer() " + sender + " link: http://www.raistoria.rai.it/storiabot/get_sender_status.aspx?senderid=" + sender);
    request('http://www.raistoria.rai.it/storiabot/get_sender_status.aspx?senderid=' + sender, function (error, response, body) {
        console.log("response.statusCode = " + response.statusCode);
        if (!error && response.statusCode == 200) {
            if (body == "0") {
                messageData = {
                    "text": "Vuoi attivare le notifiche?",
                    "quick_replies": [
                      {
                          "content_type": "text",
                          "title": "Si, attiva",
                          "payload": "disattivano"
                      },
                      {
                          "content_type": "text",
                          "title": "No, grazie",
                          "payload": ""
                      }
                    ]
                }
            }
            else if (body == "1") {
                messageData = {
                    "text": "Vuoi disattivare le notifiche?",
                    "quick_replies": [
                      {
                          "content_type": "text",
                          "title": "Si, disattiva",
                          "payload": "disattivasi"
                      },
                      {
                          "content_type": "text",
                          "title": "No, grazie",
                          "payload": ""
                      }
                    ]
                }
            }
            if (messageData != "") {
                request({
                    url: 'https://graph.facebook.com/v2.6/me/messages',
                    qs: { access_token: token },
                    method: 'POST',
                    json: {
                        recipient: { id: sender },
                        message: messageData,
                    }
                }, function (error, response, body) {
                    if (error) {
                        console.log('Error sending messages: ', error)
                    } else if (response.body.error) {
                        console.log('Error: ', response.body.error)
                    }
                })
            }
            else
            {
                console.log("message data empty")
            }
        }
        else
        {
            console.log("get_sender_status error: " + error)
        }
    })
}

/*function storia() {

    var request = require('request');
    request('http://www.raistoria.rai.it/storiabot/bot-response.aspx', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            elements = body;
            console.log(body)
        }
    })


}*/

function sendGenericMessage(sender) {
    //storia();
    console.log("sendGenericMessage(" + sender + ")")
    var request = require('request');
    request('http://www.raistoria.rai.it/storiabot/bot-response.aspx', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("sendGenericMessage start")
            messageData = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": body
                    }
                }
            }
            request({
                url: 'https://graph.facebook.com/v2.6/me/messages',
                qs: { access_token: token },
                method: 'POST',
                json: {
                    recipient: { id: sender },
                    message: messageData,
                }
            }, function (error, response, body) {
                if (error) {
                    console.log('Error sending messages: ', error)
                } else if (response.body.error) {
                    console.log('Error: ', response.body.error)
                }
            })
        }
    })
}

function SaveSender(sender) {
    var request = require('request');
    request('https://graph.facebook.com/v2.6/' + sender + '/?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + token, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log("body: " + body)
            var userprofile = JSON.parse(body);
            /*console.log("userprofile.firstname: " + userprofile.first_name)
            request({
                url: 'http://www.raistoria.rai.it/storiabot/save_sender.aspx',
                //qs: { access_token: token },
                method: 'POST',
                json: {
                    senderid: sender ,
                    first_name: userprofile.first_name,
                    last_name: userprofile.last_name,
                    profile_pic: userprofile.profile_pic,
                    locale: userprofile.locale,
                    timezone: userprofile.timezone,
                    gender: userprofile.gender
                }
            }, function (error, response, body) {
                console.log("save_sender response: " + body)
                if (error) {
                    console.log('Error sending messages: ', error)
                }
            })*/
            console.log('http://www.raistoria.rai.it/storiabot/save_sender.aspx?senderid=' + sender + '&first_name=' + encodeURIComponent(userprofile.first_name) + '&last_name=' + encodeURIComponent(userprofile.last_name) + '&profile_pic=' + encodeURIComponent(userprofile.profile_pic))
            request('http://www.raistoria.rai.it/storiabot/save_sender.aspx?senderid=' + sender + '&first_name=' + encodeURIComponent(userprofile.first_name) + '&last_name=' + encodeURIComponent(userprofile.last_name) + '&profile_pic=' + encodeURIComponent(userprofile.profile_pic), function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("SaveSender result:" + body)
                }
            })
        }
    })
}

function ActivatePushSender(sender, value) {
    // if value = 0 disactivate push for sender; if value = 1 activate push for sender
    var request = require('request');
    request('http://www.raistoria.rai.it/storiabot/activate_push_sender.aspx?v=' + value + '&senderid=' + sender, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("ActivatePushSender result:" + body)
            if (value == 1) {
                sendTextMessage(sender, "Da questo momento in poi riceverai le notifiche di Rai Storia")
            }
            else if (value == 0) 
            {
                sendTextMessage(sender, "Da questo momento in poi non riceverai le notifiche di Rai Storia")
            }
            
        }
    })
}

function SaveSenderPost(sender) {
    console.log("SaveSenderPost start: " + sender)
    var http = require('http');
    var data = JSON.stringify({
        'sender': sender
    });

    var options = {
        host: 'http://www.raistoria.rai.it',
        port: '80',
        path: '/StoriaBot/save_sender.aspx',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': data.length
        }
    };

    var req = http.request(options, function (res) {
        var msg = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log(chunk);
            msg += chunk;
        });
        res.on('end', function () {
            console.log(JSON.parse(msg));
        });
    });
    console.log("SaveSenderPost req end")
    req.write(data);
    req.end();
    console.log("SaveSenderPost end: " + sender)

    /*var fs = require('fs');
    fs.writeFile("/tmp/senders", sender, function (err) {
        if (err) {
            return console.log("Error saving file: " + err);
        }
        console.log("The file was saved: sender id = " + sender);
        setTimeout(function () { sendGenericAccaddeOggi(sender); }, 30000)
    });*/
}



