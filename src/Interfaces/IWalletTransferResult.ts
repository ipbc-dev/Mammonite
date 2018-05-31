interface IWalletTransferResult
{
    Success: boolean;
    TransactionHash?: string | null;
    Message: string;
}

export { IWalletTransferResult };