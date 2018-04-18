// # SimpleServer
// A simple chat bot server

var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var router = express();

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
var server = http.createServer(app);

app.listen(process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.send("Server chạy ngon lành.");
});

app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'trungtamngoaingutinhoc') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});

// Đoạn code xử lý khi có người nhắn tin cho bot
app.post('/webhook', function (req, res) {
    var entries = req.body.entry;
    for (var entry of entries) {
        var messaging = entry.messaging;
        for (var message of messaging) {
            var senderId = message.sender.id; ß
            if (message.message) {
                // Nếu người dùng gửi tin nhắn đến
                if (message.message.text) {
                    var text = message.message.text;
                    if (text == 'hi' || text == "hello") {
                        sendMessage(senderId, "Trung tâm Ngoại ngữ tin học Bot: " + 'Xin Chào');
                    }
                    else {
                        sendMessage(senderId, "Trung tâm Ngoại ngữ tin học Bot: " + "Xin lỗi, câu hỏi của bạn chưa có trong hệ thống, chúng tôi sẽ cập nhật sớm nhất.");
                    }
                }
            }
        }
    }

    res.status(200).send("OK");
});

// Gửi thông tin tới REST API để Bot tự trả lời
function sendMessage(senderId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: "EAABw0dVwnWcBAO38Il24eZAHYaEuZCjWYOl3qEsaK7630eo7GgxZAKtMi0M7KLqOaTIUROtU0A9461dZCziuElSE7pi5ZCZBeTrXdyvxi9PdtWS5ksEJA2ZB8WFSSfhcrZCBnq3Joq9IqyFqdNEkDZAhAtb2ZAh1RR4uGmF9VM2ZA2xHgZDZD",
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: message
            },
        }
    });
}