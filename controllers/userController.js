const User = require("../models/user");
const UserRound = require("../models/UserRound");
const Round = require("../models/Round");
const Web3 = require('web3');
var moment = require('moment');
const web3user = new Web3("https://polygon-mumbai.g.alchemy.com/v2/vdDFGGiobeIX1sP8w7cPnMWzzlm1dGrG");
const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
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
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
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
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
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
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
const addressSM = "0x62624fcBc7cB2b3540829e45c5AbB5562A0b2820";
var contract_MMUser = new web3user.eth.Contract(abi,addressSM);

const userController = {
    userLogin: async(req,res) => {
        const {addresswallet} = req.body;
        console.log(addresswallet);
        const user = await User.findOne({addresswallet});
        if (!user){
            return  res.send(JSON.stringify({
                        success: false,
                        message: 'user not found, with the given email!',
                    }))
        }  
        console.log(user+"hmm");
        res.send(JSON.stringify(user))
    },


    //test
    add_user: async(req,res)=>{
        const {name,email,addresswallet} = req.body;
            const user = await User({
                name,
                email,
                addresswallet 
            })
            await user.save();
            res.send(JSON.stringify(user))
            //res.json(user);
        },
	//add round user
	add_round: async(req,res)=>{
		const {gameID, transactionID,moneybet,bet,userID}= req.body;
		const rounduser = await UserRound({
			gameID, transactionID, moneybet, bet,userID
		});
		await rounduser.save();
		res.send(JSON.stringify(rounduser));
	},
	find_round: async(req,res)=>{
		const {userID} = req.body;
		const finduser = await UserRound.find({"userID":userID}).populate("gameID")
		let finduser2 = finduser.map((data)=>{
			return{
                gameID: data.gameID.roundNumber,
                transactionID: data.transactionID,
                moneybet: data.moneybet,
				status: (data.bet == data.gameID.result) ? "win" : "lose",
				moneyafterbet: (data.bet == data.gameID.result)? data.moneybet*2 :data.moneybet,
				bet:(data.bet) ? "Tai" : "Xiu"
            }
		})
		res.json(finduser2)
		//res.send(JSON.stringify(finduser2));
	},
	find_round_gamehistory: async(req,res)=>{
		const finduser = await Round.find().limit(10);
		let finduser2  = finduser.map((data)=>{
			return{
				small_money: data.small_money,
				big_money : data.big_money,
				small_players: data.small_players,
				big_players: data.big_players,
				result : (data.result) ? "Tai" : "Xiu",
				roundNumber : data.roundNumber,
				dateCreated : moment(data.dateCreated).format('MM:HH DD-MM-YYYY')
			}
		})
		res.json(finduser2)
		//res.send(JSON.stringify(finduser2));
		//small_money big_money result roundNumber dateCreated


	},
    getBalaceUser: async(req,res)=>{
        const {addressSmartContract} = req.body;
        let result = await contract_MMUser.methods.balanceOf(addressSmartContract).call();
        res.send(web3user.utils.fromWei(result, "ether"))
        // console.log(web3user.utils.fromWei(result, "ether"));
    }
}
module.exports = userController;