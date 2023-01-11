var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

// connect moongose
//hieu mk:12112000
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hieu:12112000@cluster0.1xwjc.mongodb.net/BIG88?retryWrites=true&w=majority', function(e){
    if(e){
        console.log("moongose error"+ e)
    }else{
        console.log("moongose success")
    }  
});

var currentRoundNumber = null;

var Round = require("./models/Round");
function createdNewRound(){
    var newRound = new Round({
        small_money: 1000,
        small_players: 0,
        big_money: 500,
        big_players: 10,
        counter : 1,
        result: -1,
        dateCreated: Date.now()
    });
    newRound.save(function(e){
        if(!e){
            console.log("new round created: " + newRound.roundNumber)
            currentRoundNumber = newRound.roundNumber;
            roundCounter(currentRoundNumber);
        }else{
           currentRoundNumber = null;
        }
    })
}
function roundCounter(roundNo){
    Round.findOne({roundNumber : roundNo}, function(e, round){
        if(!e && round != null){
            if(round.counter < 5){
                round.counter++;
                round.small_money += Math.floor(Math.random() * 1000000);
                round.big_money += Math.floor(Math.random() * 1000000);
                console.log("current" + roundNo + ", count" + round.counter)
                round.save((eSave)=>{
                    setTimeout(()=>{
                        roundCounter(roundNo)
                    }, 1000)
                });
            }else{
                console.log("het gio");
                round.result = Math.floor(Math.random() * 2);
                if(!round.result == 0){
                    round.dice = Math.floor(Math.random()*3) + 1;
                }else{
                    round.dice = Math.floor(Math.random()* 3) + 4;
                }
                round.save((eSave)=>{
                    console.log("winner is:" + round.result);
                    setTimeout(()=>{
                        createdNewRound();
                    }, 1000);
                })
            }
        }else{

        }
    })
}

createdNewRound();

io.on("connection", function(socket){
    console.log("new connection: " + socket.id);

    socket.on("disconnect", function(){
        console.log(socket.id + "has been disconnected");
    });
});