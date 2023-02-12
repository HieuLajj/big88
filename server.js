var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/scripts", express.static(__dirname+"/node_modules/web3.js-browser/build/"))
var bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({extended:false}));
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);
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


io.on("connection", function(socket){
    console.log("new connection: " + socket.id);

    socket.on("disconnect", function(){
        console.log(socket.id + "has been disconnected");
    });
});

const userRoute = require('./routes/user_router');
app.use("/laihieu/user",userRoute);


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

// const Web3 = require('web3');
// const web3 = new Web3("https://goerli.infura.io/v3/89b400afdacf4e07979a7d55976451c1");
// web3.eth.accounts.wallet.add("ab421cb7dfb40d8a7056255a815a8f4cbe33eeeb855a8c3fe89c991ffc6cf496");
// const abi = [
//     {
//         "inputs": [],
//         "name": "claim_tolenXU",
//         "outputs": [],
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [
//             {
//                 "internalType": "address",
//                 "name": "_tokenXu",
//                 "type": "address"
//             }
//         ],
//         "stateMutability": "nonpayable",
//         "type": "constructor"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "internalType": "address",
//                 "name": "_vi",
//                 "type": "address"
//             }
//         ],
//         "name": "SM_ban_data",
//         "type": "event"
//     },
//     {
//         "inputs": [],
//         "name": "amount",
//         "outputs": [
//             {
//                 "internalType": "uint256",
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "inputs": [],
//         "name": "tokenXU",
//         "outputs": [
//             {
//                 "internalType": "contract IERC20",
//                 "name": "",
//                 "type": "address"
//             }
//         ],
//         "stateMutability": "view",
//         "type": "function"
//     }
// ];
// const addressSM = "0xaFCc915A7943E2cFB01b3D60C1981c3c35B85840";
// var contract_MM = new web3.eth.Contract(abi,addressSM);
// sender = "0x91aAA108997BA2540C9aF1c67d4dccB48Fb34f06";
// const init = async ()=>{
//     console.log("fddddd2");
//     contract_MM.methods.claim_tolenXU().send({
//         from: sender,
//         gas: 72000
//     });
//     console.log("fddddd");
// }   
//  init();