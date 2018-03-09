import { IWalletBalance } from "./Interfaces/IWalletBalance";
import fetch from 'node-fetch';

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

    Transfer = async (amount: number, address: string): Promise<boolean | string> =>
    {
        let payload = {
            "destinations": [{amount: (amount * this.CoinUnits) as number, address: address }],
            "mixin":4,
            "get_tx_key": true,
            "fee": this.Fee,
            "unlock_time": 3
        };
        let result = await this._RPC("transfer", payload);
        
        if(result.error)
            return result.error.message;

        return result && result.result && result.result.tx_hash;
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