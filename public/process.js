$(document).ready(function(){
    var currentAccount = "";
    checkMM();
    $("#btnDangky").click(function(){
        $.post("./dangky", {
            Email: $("#txtHoten").val(),
            Hoten: $("#txtEmail").val(),
            SoToken: $("#txtSoToken").val()
        }, function(data){
            console.log(data);
        })
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
})