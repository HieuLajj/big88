const User = require("../models/user");
const UserRound = require("../models/UserRound");
const Round = require("../models/Round");
const jwt = require("jsonwebtoken")
const Web3 = require('web3');
var moment = require('moment');
const cloudinary = require("../helper/imageUpload")
const web3user = new Web3("https://polygon-mumbai.g.alchemy.com/v2/vdDFGGiobeIX1sP8w7cPnMWzzlm1dGrG");
// const abi = [
//     {
//       "inputs": [],
//       "stateMutability": "nonpayable",
//       "type": "constructor"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "spender",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "value",
//           "type": "uint256"
//         }
//       ],
//       "name": "Approval",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "previousOwner",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "newOwner",
//           "type": "address"
//         }
//       ],
//       "name": "OwnershipTransferred",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "from",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "value",
//           "type": "uint256"
//         }
//       ],
//       "name": "Transfer",
//       "type": "event"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "spender",
//           "type": "address"
//         }
//       ],
//       "name": "allowance",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "spender",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "amount",
//           "type": "uint256"
//         }
//       ],
//       "name": "approve",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         }
//       ],
//       "name": "balanceOf",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "amount",
//           "type": "uint256"
//         }
//       ],
//       "name": "burn",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "amount",
//           "type": "uint256"
//         }
//       ],
//       "name": "burnFrom",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "decimals",
//       "outputs": [
//         {
//           "internalType": "uint8",
//           "name": "",
//           "type": "uint8"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "spender",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "subtractedValue",
//           "type": "uint256"
//         }
//       ],
//       "name": "decreaseAllowance",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "spender",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "addedValue",
//           "type": "uint256"
//         }
//       ],
//       "name": "increaseAllowance",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "amount",
//           "type": "uint256"
//         }
//       ],
//       "name": "mint",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "name",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "owner",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "renounceOwnership",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "symbol",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "totalSupply",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "amount",
//           "type": "uint256"
//         }
//       ],
//       "name": "transfer",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "from",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "amount",
//           "type": "uint256"
//         }
//       ],
//       "name": "transferFrom",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "newOwner",
//           "type": "address"
//         }
//       ],
//       "name": "transferOwnership",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     }
//   ]
//const addressSM = "0x62624fcBc7cB2b3540829e45c5AbB5562A0b2820";
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
//const addressSM = "0xA2E23A5FB2bC40815b5bFf0bE9196b920C3A049e";
const addressSM = "0x062E565224cf749DccFC8ACCec1f63a08b6124Db"
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
		const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn:'1d'});
        
		const userInfo = {
			_id: user._id,
			name: user.name,
			email: user.email,
			win: user.win,
			lose: user.lose,
			profit: user.profit,
			addresswallet: user.addresswallet,
			lostmoney: user.lostmoney,
			avatar: user.avatar,
			token: token,
			status: user.status,
		}		
		//res.json(userInfo);
        res.send(JSON.stringify(userInfo))
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
		const finduser = await UserRound.find({"userID":userID}).sort({gameID: -1}).populate("gameID").limit(20);
		
		let finduser2 = finduser.map((data)=>{
			let resultpre = data.gameID.result;
			let statuslast="null";
			let moneyafterbetlast;
			if(resultpre==-2){
				statuslast = "null";
			}else{
				statuslast = (data.bet == data.gameID.result) ? "Win" : "Lose";
			}
			if(statuslast == "null"){
				moneyafterbetlast = 0;
			}else{
				moneyafterbetlast = (data.bet == data.gameID.result)? data.moneybet*2 :data.moneybet;
			}

			return{
                gameID: data.gameID.roundNumber,
                transactionID: data.transactionID,
                moneybet: data.moneybet,
				status: statuslast,
				moneyafterbet: moneyafterbetlast,
				bet:(data.bet) ? "Big" : "Small"
            }
		})
		res.json(finduser2)
		//res.send(JSON.stringify(finduser2));
	},
	
	find_round_gamehistory: async(req,res)=>{
		const finduser = await Round.find().sort({dateCreated: -1}).limit(10);
		let finduser2  = finduser.map((data)=>{
      let result2;
      if(data.result == 0){
        result2 = "Small";
      }else if(data.result == 1){
        result2 = "Big"
      }else{
        result2 = "Not"
      }
			return{
				small_money: data.small_money,
				big_money : data.big_money,
				small_players: data.small_players,
				big_players: data.big_players,
				result : result2,
				roundNumber : data.roundNumber,
        dateCreated : moment(data.dateCreated).format('HH:mm dd-MM-yyyy')
				//dateCreated : moment(data.dateCreated).format('MM:HH DD-MM-YYYY')
			}
		})
		res.json(finduser2)
		//res.send(JSON.stringify(finduser2));
		//small_money big_money result roundNumber dateCreated


	},
    getBalaceUser: async(req,res)=>{
      try {
        const {addressSmartContract} = req.body;
        let result = await contract_MMUser.methods.balanceOf(addressSmartContract).call();
        res.send(web3user.utils.fromWei(result, "ether"))
      } catch (error) {
        console.log("co loi xay ra khi cap nhap token");
      }
        // console.log(web3user.utils.fromWei(result, "ether"));
    },
	increase_win: async(req,res)=>{
		const {user} = req;
		const {money} = req.body;
		let win = user.win + 1;
		let profit = money;
		try {
			const exp = await  User.findByIdAndUpdate(
				user._id,
				{
				  win,
				  profit
				},
				{ new: true, runValidators: true }
				)
			res.send(JSON.stringify(exp))
		} catch (error) {
			res.send(error);
		}
	},
	increase_lose: async(req,res)=>{
		const {user} = req;
		const {money} = req.body;
		let lose = user.lose + 1;
		let lostmoney = money;
		try {
			const exp = await  User.findByIdAndUpdate(
				user._id,
				{
				  lose,
				  lostmoney
				},
				{ new: true, runValidators: true }
				)
			res.send(JSON.stringify(exp))
		} catch (error) {
			res.send(error);
		}
	},
	getAll: async(req,res)=>{
		try {
			const exp = await User.find().sort({"win":-1}).limit(5);
			res.send(JSON.stringify(exp))
		} catch (error) {
			res.send(error);
		}
	},

	//update
	updateProfile: async(req,res)=>{
		const {user} = req;
		const {name, email, status} = req.body;
		try {
			const exp = await User.findByIdAndUpdate(
			user._id,
			{
				name,
				email,
				status,
			},
			{ new: true, runValidators: true }
			)
			res.send(JSON.stringify(exp));
		} catch (error) {
			res.json(error);
		}
	},

	updateImage: async(req, res) => {
		const {user} = req;
		if (!user)
		return res
		  .status(401)
		  .json({ success: false, message: 'unauthorized access!' });

		try {
			const result = await cloudinary.uploader.upload(req.file.path,{
				public_id: `${user._id}_profile`,
				width: 500,
				height:500,
				crop: 'fill'
			});
			const exp = await User.findByIdAndUpdate(
				user._id,
				{ avatar: result.url },
				{ new: true, runValidators: true }
			)
			res.send(result.url);
		} catch (error) {
			res.json(error);
		}
	},

  //find User
  findUser : async(req,res)=>{
    const keyword = req.query.search
    ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
      }
    : {};
    try {
      console.log("tim keim tahnh vien"+req.query.search)
      const users = await User.find(keyword);
      res.send(users);    
    } catch (err) {
      res.status(500).json(err);
    } 
  }
}
module.exports = userController;