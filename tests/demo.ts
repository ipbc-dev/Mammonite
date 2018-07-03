import { CryptoniteWallet } from '../src/CryptoniteWallet';

let wallet = new CryptoniteWallet("localhost", 24184);

wallet.Transfer(0.1, "bxcmikn2Wz4Vap1TkxPwrKjpMPkFe4N6u7MGsvrqbKKe7Q1mcfpTRzcKRc6uuQrTxRQpTqLv1JJGwhSu4zNH1okN2VnsppPaY", 5, 0.05,"c7b1a08b88a241af99f24ee5c7a93bea02e5752f1d2d496c8983c7cd4c64d727".toUpperCase()).then(result => {
    console.log("transfer result", result);
});

wallet.GetTransfers().then(result => {
    console.log("Transfers Count: ", result.length);
});


wallet.GetBalance().then((value)=>{
    console.log("Balance[LOCKED]: ", value.Locked);
    console.log("Balance[UNLOCKED]: ", value.Unlocked);
});

wallet.GetHeight();