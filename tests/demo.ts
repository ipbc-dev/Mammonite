import { CryptoniteWallet } from '../src/CryptoniteWallet';

let wallet = new CryptoniteWallet("localhost", 30012);

wallet.GetBalance().then((value)=>{
    console.log("Balance[LOCKED]: ", value.Locked);
    console.log("Balance[UNLOCKED]: ", value.Unlocked);
});

wallet.GetHeight();

// wallet.Transfer(1, "bxdLhsWY56SNjVN2aQ5Yyb6hhCFfAQJVbYszWCUjeDTJMgHad8wZbNJBdrvujZzPvRY2X5AiWdTDCP626s4WbHcG1TYdEot9f", 4, 0.13,"c7b1a08b88a241af99f24ee5c7a93bea02e5752f1d2d496c8983c7cd4c64d727").then(result => {
//     console.log("transfer result", result);
// });

// wallet.GetTransfers().then(result => {
//     console.log(result);
// });
