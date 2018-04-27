import { CryptoniteWallet } from '../src/CryptoniteWallet';

let wallet = new CryptoniteWallet("localhost", 30001);

wallet.GetBalance().then((value)=>{
    console.log("Balance[LOCKED]: ", value.Locked);
    console.log("Balance[UNLOCKED]: ", value.Unlocked);
});

// wallet.Transfer(0.1, "bxcmikn2Wz4Vap1TkxPwrKjpMPkFe4N6u7MGsvrqbKKe7Q1mcfpTRzcKRc6uuQrTxRQpTqLv1JJGwhSu4zNH1okN2VnsppPaY").then(result => {

// });

wallet.GetTransfers().then(result => {
    console.log(result);
});
