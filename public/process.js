$(document).ready(function(){

    const abi = [
        {
            "inputs": [],
            "name": "claim_tolenXU",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_tokenXu",
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
                    "name": "_vi",
                    "type": "address"
                }
            ],
            "name": "SM_ban_data",
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
    ];
    const addressSM = "0xaFCc915A7943E2cFB01b3D60C1981c3c35B85840";
    var currentAccount = "";
    const web3 = new Web3(window.ethereum);
    window.ethereum.enable();

    var contract_MM = new web3.eth.Contract(abi,addressSM);
    console.log(contract_MM)
    var provider = new Web3.providers.WebsocketProvider("wss://goerli.infura.io/ws/v3/8f0906b3b3e0469087f944e364f7b4c4")
    var web3_infura = new Web3(provider);
    var contract_Infura = web3_infura.eth.Contract(abi, addressSM);
    console.log(contract_Infura);

    contract_Infura.events.SM_ban_data({filter:{}, fromBlock: "latest"}, function(error, data){
        if(error){
            console.log(error+"hefaehfao");
        }else{
            console.log(data+"Aefawefawef");
            console.log("fadfwfawe")
        }
    });

    checkMM();
    $("#btnDangky").click(function(){
        if(currentAccount.length ==0){
            alert("vui long dang nhap metamash");
        }else{
            $.post("./dangky", {
                Email: $("#txtHoten").val(),
                Hoten: $("#txtEmail").val(),
                SoToken: $("#txtSoToken").val()
            }, function(data){
                if(data.ketqua == 1){
                    contract_MM.methods.claim_tolenXU().send({
                        from: currentAccount
                    });
                    console.log("gui thanh cong")
                }
            })
        }
    })
    $("#connectMM").click(function(){
        connectMM().then((data)=>{
            currentAccount = data[0];
            console.log(currentAccount);
        }).catch(
            (err)=>{
                console.log(err)
            }
        );
    })

    $("#btn_Connect_MM").click(function(){
        connectMM().then(function(data){
            $("#address").html(data[0]);
            var rand = randomString(10);
            $("#random").html(rand);
            web3.eth.personal.sign(rand, data[0], (err, hash)=>{
                if(!err){
                    $("#hash").html(hash);
                }
            });
        })
    });

    function checkMM(){
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
        }else{
            console.log('ban chua cai metamask kia');
        }
    }

    async function connectMM(){
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        return accounts;
    }
    function randomString(long){
        const textArr = ["a", "b", "c", "0", "1", "2", "3"];
        var s= "";
        for(var i=0; i< long; i++){
            s += textArr[Math.floor(Math.random() * textArr.length)];
        }
        return s;
    }






})