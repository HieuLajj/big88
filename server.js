var express = require("express");
const cors = require('cors');
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/scripts", express.static(__dirname+"/node_modules/web3.js-browser/build/"))
let ChatServer = require("./classes/ChatServer");
const corsOptions = {
    optionsSuccessStatus: 200, // For legacy browser support
    credentials: true, // This is important.
    origin: "https://chalkcoin.io",
};
app.use(cors());
var bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({extended:false}));
var server = require("http").Server(app);
var io = require("socket.io")(server,
	{cors: {
		origin: '*',
		credentials: true
	}
	}
);
server.listen(8000);
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({extended: true}))
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

var betPlayer = 0;
var betedPlayer = 0;
var betRandomNumber = -1;
var stateGameCurrent = 0;

let chatServer = new ChatServer();
io.on("connection", function(socket){
    console.log("new connection: " + socket.id);
	socket.on('BetPlay', function(data){
		// const obj = JSON.parse(data);
		//if(stateGameCurrent == 0){
			betPlayer++;
			console.log("nhan betplay"+betPlayer)
		//}
	})

	socket.on('BetedPlay', function(data){
		// const obj = JSON.parse(data);
		// console.log(obj.idPlayer+ "thanh cong nay")
		betedPlayer++;
		console.log("nhan betedplay"+betedPlayer)
	})

	// socket.on('ChatCommunity', function(data){
	// 	console.log(JSON.stringify(data));
	// })
	//chat
	let serverChat = chatServer;
	chatServer.socket = socket;
	chatServer.createEvents(); 
	

    socket.on("disconnect", function(){
        console.log(socket.id + "has been disconnected");
    });
});

const userRoute = require('./routes/user_router');
const chatRoute = require('./routes/user_chat');
app.use("/laihieu/user",userRoute);
app.use("/laihieu/chat",chatRoute);
//game logic

var Round = require("./models/Round");

var currentRoundNumber = null;
function createNewRound(){
	betPlayer = 0;
	betedPlayer = 0;
	betRandomNumber = -1;
	stateGameCurrent = 0;

	var newRound = new Round({
		small_money: 0,
		small_players: 0,
		big_money: 0,
		big_players: 0,
		counter: 0,
		result: -2,
		state_game: 0,
		dice: 0,
		dateCreated : Date.now()
	});
	newRound.save(function(e){
		if(!e){
			//console.log("New round" + newRound.roundNumber);
			currentRoundNumber = newRound?.roundNumber;
			roundCounter(currentRoundNumber);
		}else{
			currentRoundNumber = null;
		}
	})
}
function roundCounter(roundNu){
	Round.findOne({roundNumber : roundNu}, function(e, round){
		if(!e && round != null){
			if(round.counter < 60){
				round.counter++;
				//console.log(roundNu + "::"+ round.counter);
				round.save((e)=>{
					io.sockets.emit("server-send-current-round", JSON.stringify(round));
					setTimeout(()=>{
						roundCounter(roundNu);
					},1000)
				});
			}else{
				if(betPlayer==0){
					console.log("khong co polygon");
					round.result = Math.floor(Math.random()*2);
					if(round.result==0){
						round.dice = Math.floor(Math.random()*9)+1;
					}else{
						round.dice = Math.floor(Math.random()*9)+10;
					}
					round.state_game  = 1;
					stateGameCurrent = round.state_game;
					round.save((eSave)=>{
						io.sockets.emit("server-send-current-round", JSON.stringify(round));
						setTimeout(()=>{
							round.state_game  = 2;
							stateGameCurrent = round.state_game;
							round.save((eSave)=>{
								io.sockets.emit("server-send-current-round", JSON.stringify(round));
							});
						}, 10000)
						setTimeout(()=>{createNewRound();}, 15000)
					});
					console.log("het gio roi khong polygon");
				}else if(betPlayer == betedPlayer && betedPlayer!=0){
					initBetPlay(round);
				}else{
					if(round.counter < 120){
						round.counter++;
						round.save((e)=>{
							setTimeout(()=>{
								roundCounter(roundNu);
							},1000)
						});
					}else{
						initBetPlay(round);
					}
				}

				// round.result = Math.floor(Math.random()*2);
				// if(round.result==0){
				// 	round.dice = Math.floor(Math.random()*9)+1;
				// }else{
				// 	round.dice = Math.floor(Math.random()*9)+10;
				// }
				// round.state_game  = 1;
				// round.save((eSave)=>{
				// 	io.sockets.emit("server-send-current-round", JSON.stringify(round));
				// 	setTimeout(()=>{
				// 		round.state_game  = 2;
				// 		round.save((eSave)=>{
				// 			io.sockets.emit("server-send-current-round", JSON.stringify(round));
				// 		});
				// 	}, 10000)
				// 	setTimeout(()=>{createNewRound();}, 15000)
				// });
				// console.log("het gio roi");
			}
		}else{

		}
	});
}
//createNewRound();



// smart contract 

// var Web3 = require("Web3");
// const abi =[
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "_amountTokenGuess",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "_guess",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "bet",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "claim_tokenXU",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "play",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "pushArray",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "_token",
// 				"type": "address"
// 			}
// 		],
// 		"stateMutability": "nonpayable",
// 		"type": "constructor"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{
// 				"indexed": false,
// 				"internalType": "address",
// 				"name": "_vi",
// 				"type": "address"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "string",
// 				"name": "_id",
// 				"type": "string"
// 			}
// 		],
// 		"name": "SM_start_game",
// 		"type": "event"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "xoaarrya",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "amount",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "arraytest",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "owner",
// 		"outputs": [
// 			{
// 				"internalType": "address payable",
// 				"name": "",
// 				"type": "address"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "",
// 				"type": "address"
// 			}
// 		],
// 		"name": "playerBet",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "amountTokenGuess",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "guess",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "stakerAddressList",
// 		"outputs": [
// 			{
// 				"internalType": "address",
// 				"name": "",
// 				"type": "address"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "tokenXU",
// 		"outputs": [
// 			{
// 				"internalType": "contract IERC20",
// 				"name": "",
// 				"type": "address"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "usersClaimed",
// 		"outputs": [
// 			{
// 				"internalType": "address",
// 				"name": "",
// 				"type": "address"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	}
// ];
// const addressSM = "0xAA5d9f31A5A5CdE29dD6D707919e10b9C1BBbCDe";
// const web3 = new Web3();
// var contract_MM = new web3.eth.Contract(abi,addressSM);
// var provider = new Web3.providers.WebsocketProvider("https://polygon-mumbai.infura.io/v3/fecb9acc0c6f4f1693e2d416177b5317")
// var web3_infura = new Web3(provider);
// var contract_Infura = new web3_infura.eth.Contract(abi, addressSM);
// console.log(contract_Infura);
// contract_Infura.events.SM_start_game({fillter:{}, fromBlock:"latest"}, function(error, event){
//     if(error){
//         console.log("fhasdhf");
//         console.log(error);
//     }else{
//         console.log(event);
//     }
// });













//require("./controllers/game")(app);
// var Web3 = require("Web3");
// var web3 = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/"));

// app.post("/verifyHash", function(req,res){
//    if(!req.body.random || !req.body.hash){
//         res.send("failed");
//    }else{
//         let account = web3.eth.accounts.recover(req.body.random, req.body.hash);
//         res.send(account);
//    } 
// });



const Web3 = require('web3');

//const web3 = new Web3("https://polygon-mumbai.infura.io/v3/fecb9acc0c6f4f1693e2d416177b5317");
const abi =[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "betNumber",
				"type": "uint256"
			}
		],
		"name": "SMdataBetNumber",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "amount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "arraytest",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amountTokenGuess",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_guess",
				"type": "uint256"
			}
		],
		"name": "bet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claim_tokenXU",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "play",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "playerBet",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountTokenGuess",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "guess",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pushArray",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "stakerAddressList",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenXU",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "usersClaimed",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "xoaarrya",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
const addressSM = "0xAa7D1E308BaA9663588ABd9457fDBf7Fb5482a71";
//test



var provider = new Web3.providers.WebsocketProvider("wss://polygon-mumbai.g.alchemy.com/v2/vdDFGGiobeIX1sP8w7cPnMWzzlm1dGrG");
var web3_alchemy = new Web3(provider);
var contract_Alchemy = new web3_alchemy.eth.Contract(abi,addressSM);
contract_Alchemy.events.SMdataBetNumber({filter:{}, fromBlock:"latest"}, function(error,event){
	if(error){
		console.log("loi roi"+ error)
	}else{
		betRandomNumber = event.returnValues.betNumber;
		console.log("hehe"+event.returnValues.betNumber+"thanh cong roi")
	}
})

const web3 = new Web3("https://polygon-mumbai.g.alchemy.com/v2/vdDFGGiobeIX1sP8w7cPnMWzzlm1dGrG");
web3.eth.accounts.wallet.add("ab421cb7dfb40d8a7056255a815a8f4cbe33eeeb855a8c3fe89c991ffc6cf496");
var contract_MM = new web3.eth.Contract(abi,addressSM);

sender = "0x91aAA108997BA2540C9aF1c67d4dccB48Fb34f06";
const initBetPlay = async (round)=>{
    console.log("fddddd2");
	round.state_game  = 1;
	stateGameCurrent = round.state_game;
	round.save((eSave)=>{
		io.sockets.emit("server-send-current-round", JSON.stringify(round));
	})
	console.log("ooo");
   	var data = await contract_MM.methods.play().send({
        from: sender,
        gas: 72000
    });
	round.result = betRandomNumber;
	console.log("????");
	if(round.result==0){
		round.dice = Math.floor(Math.random()*9)+1;
	}else{
		round.dice = Math.floor(Math.random()*9)+10;
	}
	round.state_game  = 2;
	stateGameCurrent = round.state_game;
	round.save((eSave)=>{
		io.sockets.emit("server-send-current-round", JSON.stringify(round));
	});
	setTimeout(()=>{createNewRound();}, 5000)
    console.log("fdddddeeee==hoanthanh");
}   
//initBetPlay();

