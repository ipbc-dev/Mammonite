import { IWalletBalance } from "./Interfaces/IWalletBalance";
import fetch from 'node-fetch';
import { IWalletTransaction } from "./Interfaces/IWalletTransaction";
import { IWalletTransferResult } from './Interfaces/IWalletTransferResult';

export class CryptoniteWallet
{
    CoinUnits: number = 100000000;
    Host: string;
    Port: number;
    Fee: number = 100000;
    constructor(host: string, port: number)
    {
        this.Host = host;
        this.Port = port;
    }

    GetBalance = async () : Promise<IWalletBalance> =>
    {
        // let result = await this.MoneroWallet.balance();
        
        let result = (await this._RPC("getbalance")).result;
        return <IWalletBalance>{
            Unlocked: parseInt(result.available_balance) / this.CoinUnits,
            Locked: parseInt(result.locked_amount) / this.CoinUnits
        };
    }

    Transfer = async (amount: number, address: string, mixin?: number, fee?: number, paymentId? : string): Promise<IWalletTransferResult> =>
    {
        let payload = {
            "destinations": [{amount: (amount * this.CoinUnits) as number, address: address }],
            "mixin": mixin ? mixin : 4,
            "get_tx_key": true,
            "fee": fee ? fee * this.CoinUnits : this.Fee,
            "unlock_time": 3,
            'payment_id': paymentId ? paymentId : ''
        };
        let result = await this._RPC("transfer", payload);
        
        if(result.error)
            return <IWalletTransferResult>
            {
                Success: false,
                Message: result.error.message,
                TransactionHash: null
            };
        else
            return <IWalletTransferResult>
            {
                Success: true,
                Message: "Transaction Complete",
                TransactionHash: result.result.tx_hash
            };
    }

    GetHeight = async() : Promise<number> =>
    {
        let result = (await this._RPC("get_height")).result;
        return result.height;
    }

    GetTransfers = async() : Promise<IWalletTransaction[]> =>
    {
        let result = (await this._RPC("get_transfers", {
            in: true,
            out: true,
            pending: true
        })).result;
        let transfers = new Array<IWalletTransaction>();

        
        if(result.in)
            (<Array<any>>result.in).forEach(transfer => {
                // console.log("in", transfer.fee / this.CoinUnits);
                transfers.push({
                    Address: transfer.address,
                    Amount: transfer.amount / this.CoinUnits,
                    BlockIndex: transfer.height,
                    //Fee: transfer.fee / this.CoinUnits,
                    Fee: -1,
                    Outgoing: false,
                    PaymentID: transfer.payment_id,
                    SendTime: transfer.timestamp,
                    TransactionHash: transfer.txid,
                    Pending: false
                });
            });

        if(result.out)
            (<Array<any>>result.out).forEach(transfer => {
                // console.log("out", transfer.fee / this.CoinUnits);
                transfers.push({
                    Address: transfer.destinations && transfer.destinations.length > 0 ? transfer.destinations[0].address : transfer.address,
                    Amount: transfer.amount / this.CoinUnits,
                    BlockIndex: transfer.height,
                    Fee: transfer.fee / this.CoinUnits,
                    Outgoing: true,
                    PaymentID: transfer.payment_id,
                    SendTime: transfer.timestamp,
                    TransactionHash: transfer.txid,
                    Pending: false
                });
            });

        if(result.pending)
            (<Array<any>>result.pending).forEach(transfer => {
                // console.log("pending", transfer.fee / this.CoinUnits);
                transfers.push({
                    Address: transfer.address,
                    Amount: transfer.amount / this.CoinUnits,
                    BlockIndex: transfer.height,
                    Fee: transfer.fee / this.CoinUnits,
                    Outgoing: true,
                    PaymentID: transfer.payment_id,
                    SendTime: transfer.timestamp,
                    TransactionHash: transfer.txid,
                    Pending: true
                });
            });

        return transfers;
    }

    isIPBCAddressValid = async(address: string) : Promise<boolean> =>
    {
        let pattern = new RegExp(/b[0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{96}$/g);
        return pattern.test(address);
    }

    private _RPC = async (method: string, params?: any) =>
    {
        // encode the request into JSON
        let body: any = {
                jsonrpc: '2.0',
                id: '0',
                method: method
        };

        if(params)
            body.params = params;
        
        let result = await fetch(`http://${this.Host}:${this.Port}/json_rpc`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        let resultJson = await result.json();
        return resultJson;
    }
}