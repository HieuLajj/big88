var express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require('cors');
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/scripts", express.static(__dirname+"/node_modules/web3.js-browser/build/"))
let ChatServer = require("./classes/ChatServer");
app.use(cors());
var bodyParser = require("body-parser");
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
mongoose.connect(process.env.MONGODB_URL, function(e){
    if(e){
        console.log("moongose error"+ e)
    }else{
        console.log("moongose success")
    }  
});

var betPlayer = 0;
var betedPlayer = 0;
var betRandomNumber = 0;
var stateGameCurrent = 0;
var small_money_flag = 0;
var small_players_flag = 0;
var big_money_flag = 0;
var big_players_flag = 0;

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
		const obj = JSON.parse(data);
		// console.log(obj.idPlayer+ "thanh cong nay")
		betedPlayer++;
		//console.log(data+"__"+obj._id+"nhan betedplay"+obj.money)
    console.log(obj.bet+"hhehehe");
		if(obj.bet==1){
			big_players_flag++;
			big_money_flag+=obj.money;
      console.log("tai")
		}else{
			small_players_flag++;
			small_money_flag+=obj.money;
      console.log("xiu")
		}
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
	betRandomNumber = 0;
	stateGameCurrent = 0;
	small_money_flag = 0;
    small_players_flag = 0;
    big_money_flag = 0;
    big_players_flag = 0;

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
		//console.log(round);
		if(!e && round != null){
			round.big_money = big_money_flag;
			round.small_money = small_money_flag;
			round.big_players = big_players_flag;
			round.small_players = small_players_flag;
			if(round.counter < 100){
				round.counter++;
				round.save((e)=>{
					io.sockets.emit("server-send-current-round", JSON.stringify(round));
					setTimeout(()=>{
						roundCounter(roundNu);
					},1000)
				});
			}else{
				if(betPlayer==0){

					round.result = Math.floor(Math.random()*2);
          console.log("khong co polygon"+round.result);
					if(round.result==0){
						round.dice = Math.floor(Math.random()*6)+3;
					}else{
						round.dice = Math.floor(Math.random()*8)+10;
					}
					round.state_game  = 1;
					stateGameCurrent = round.state_game;
					round.save((eSave)=>{
						io.sockets.emit("server-send-current-round", JSON.stringify(round));
            setTimeout(()=>{
							round.state_game  = 2;
							stateGameCurrent = round.state_game;
							round.save((eSave)=>{
                //console.log("2"+JSON.stringify(round));
                io.sockets.emit("server-send-current-round", JSON.stringify(round));
								//io.sockets.emit("server-send-current-round", JSON.stringify(round));
							});
						}, 10000)
						setTimeout(()=>{createNewRound();}, 15000)
					});
				// }else if(betPlayer == betedPlayer && betedPlayer!=0){
				// 	initBetPlay(round);
				}else{
					if(round.counter < 110){
						round.state_game  = 1;
						round.counter++;
						round.save((e)=>{
							io.sockets.emit("server-send-current-round", JSON.stringify(round));
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
createNewRound();
const Web3 = require('web3');
const abi = [
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
			},
			{
				"internalType": "uint256",
				"name": "_gameRound",
				"type": "uint256"
			}
		],
		"name": "bet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
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
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Congtien",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Hoantien",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_gameRound",
				"type": "uint256"
			}
		],
		"name": "play",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
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
				"internalType": "address",
				"name": "_addressToCheck",
				"type": "address"
			}
		],
		"name": "checkAddress",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
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
			},
			{
				"internalType": "uint256",
				"name": "gameRound",
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
	}
]
const addressSM = "0x38d35E1889C2fE4841574b829F88eD260C15b48F";
var provider = new Web3.providers.WebsocketProvider("wss://polygon-mumbai.g.alchemy.com/v2/vdDFGGiobeIX1sP8w7cPnMWzzlm1dGrG");
var web3_alchemy = new Web3(provider);
var contract_Alchemy = new web3_alchemy.eth.Contract(abi,addressSM);
contract_Alchemy.events.SMdataBetNumber({filter:{}, fromBlock:"latest"}, function(error,event){
	if(error){
		console.log("loi roi"+ error)
	}else{
		betRandomNumber = event.returnValues.betNumber;
		//console.log("ket qua la"+event.returnValues.betNumber)
	}
})

contract_Alchemy.events.Congtien({filter:{}, fromBlock:"latest"}, function(error,event){
	if(error){
		console.log("loi roi"+ error)
	}else{
		//event.returnValues.winer
		console.log("cong tien"+event.returnValues.buyer.toLowerCase()+"thanh cong roi"+ event.returnValues.amount)
    let message = ({  
      address: event.returnValues.buyer.toLowerCase(),
      amount: event.returnValues.amount/1000000000000000000,
    })
    io.sockets.emit("notification_game_cong", JSON.stringify(message));
	}
})
contract_Alchemy.events.Hoantien({filter:{}, fromBlock:"latest"}, function(error,event){
	if(error){
		console.log("loi roi"+ error)
	}else{
		//event.returnValues.winer
		console.log("hoan tien"+event.returnValues.buyer.toLowerCase()+"thanh cong roi"+ event.returnValues.amount)
    let message = ({  
      address: event.returnValues.buyer.toLowerCase(),
      amount: event.returnValues.amount/1000000000000000000,
    })
    io.sockets.emit("notification_game_hoan", JSON.stringify(message));
	}
})



//naptien
const abi_ico = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "bnb_rate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "usdt_rate",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "wallet",
				"type": "address"
			},
			{
				"internalType": "contract IERC20",
				"name": "icotoken",
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
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "BuyTokenByBNB",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "DrawBNB",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newRate",
				"type": "uint256"
			}
		],
		"name": "SetBNBRate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newRate",
				"type": "uint256"
			}
		],
		"name": "SetUSDTRate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "contract IERC20",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "SetUSDTToken",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "BNB_rate",
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
		"inputs": [],
		"name": "USDT_rate",
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
		"inputs": [],
		"name": "_wallet",
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
		"name": "buyTokenByBNB",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "USDTAmount",
				"type": "uint256"
			}
		],
		"name": "drawBNB",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "BNBAmount",
				"type": "uint256"
			}
		],
		"name": "getTokenAmountBNB",
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
				"name": "USDTAmount",
				"type": "uint256"
			}
		],
		"name": "getTokenAmountUSDT",
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
		"inputs": [],
		"name": "owner",
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
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "new_rate",
				"type": "uint256"
			}
		],
		"name": "setBNBRate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "new_rate",
				"type": "uint256"
			}
		],
		"name": "setUSDTRate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "token_address",
				"type": "address"
			}
		],
		"name": "setUSDTToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
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
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "usdtToken",
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
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawErc20",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
const address_ico = "0xD81b86f4d9dF8FD1822149C8454e11A37807C0Bb"
var contract_Alchemy_ico = new web3_alchemy.eth.Contract(abi_ico, address_ico);
contract_Alchemy_ico.events.DrawBNB({filter:{}, fromBlock:"latest"}, function(error,event){
	if(error){
		console.log("loi roi"+ error)
	}else{
		//betRandomNumber = event.returnValues.betNumber;
		console.log(event.returnValues.buyer+"_thanh cong roi_"+event.returnValues.amount)
		let moneymoubt = event.returnValues.amount/1000000000000000000;
		transfer_money(moneymoubt,event.returnValues.buyer)
	}
})
contract_Alchemy_ico.events.BuyTokenByBNB({filter:{}, fromBlock:"latest"}, function(error,event){
	if(error){
		console.log("loi roi"+ error)
	}else{
		
		let moneymoubt = event.returnValues.amount/1000000000000000000;
		let message = ({  
			address: event.returnValues.buyer.toLowerCase(),
			amount: moneymoubt,
		})
		io.sockets.emit("naptien", JSON.stringify(message));
	}
})


const web3 = new Web3("https://polygon-mumbai.g.alchemy.com/v2/vdDFGGiobeIX1sP8w7cPnMWzzlm1dGrG");
//const privateKey = 'ab421cb7dfb40d8a7056255a815a8f4cbe33eeeb855a8c3fe89c991ffc6cf496'
const privateKey = '5cf9e305ca378a5008377bad2001ce4e3d0941bde04c8c0bbaeecb26e6e237b3'
web3.eth.accounts.wallet.add(privateKey);
var contract_MM = new web3.eth.Contract(abi,addressSM);
const account = web3.eth.accounts.privateKeyToAccount(privateKey)
const transfer_money = async (mount, address_receive)=>{
	console.log("hummm"+String(mount));
	const maticValue = web3.utils.toWei(String(mount), 'ether')
	web3.eth.sendTransaction({
		from: account.address,
		to: address_receive,
		value:  maticValue,
		gas: 72000
	})
	.then((receipt) => {
		console.log("thanh cong"+receipt);
		// rut tien
		let message = ({  
			address: address_receive.toLowerCase(),
			amount: mount*1000,
		})
		io.sockets.emit("ruttien", JSON.stringify(message));
	})
	.catch((error) => {
		console.error("that bai"+error);
	});
}
// test();

//sender = "0x91aAA108997BA2540C9aF1c67d4dccB48Fb34f06";
sender = "0x22c2c31ed0BDe2D57431dc0Cdc2436D4fF1431a6";
const initBetPlay = async (round)=>{

  round.state_game  = 1;
  stateGameCurrent = round.state_game;
  round.save((eSave)=>{
    io.sockets.emit("server-send-current-round", JSON.stringify(round));
  })
  try {
    var data = await contract_MM.methods.play(round.roundNumber).send({
      from: sender,
      gas: 1000000
    });
  } catch (error) {
    console.log("loi roi :(("+ error)
  }

  round.result = betRandomNumber;
  if(round.result==0){
    // round.dice = Math.floor(Math.random()*9)+1;
    round.dice = Math.floor(Math.random()*6)+3;
  }else{
    round.dice = Math.floor(Math.random()*8)+10;
    //round.dice = Math.floor(Math.random()*9)+10;
  }
  round.state_game  = 2;
  stateGameCurrent = round.state_game;
  round.save((eSave)=>{
    io.sockets.emit("server-send-current-round", JSON.stringify(round));
  });
  setTimeout(()=>{createNewRound();}, 5000)
}   

