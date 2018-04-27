interface IWalletTransaction
{
    Address: string,
    Amount: number,
    BlockIndex: number,
    Fee: number,
    Outgoing: boolean,
    PaymentID: string,
    SendTime: number,
    TransactionHash: string
}

export  { IWalletTransaction }