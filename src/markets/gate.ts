import { pair_interface, market, authHandle } from "../market";
import * as request from "request-promise-native";
import * as querystring from "querystring";
import * as crypto from "crypto";
export class gateIO extends market {
    async getPairs(): Promise<pair_interface[]> {
        let data = await this.Get("/api2/1/pairs");
        let _pairs: string[] = JSON.parse(data);
        let pairs: pair_interface[] = [];
        _pairs.forEach(a => {
            let d = a.split("_");
            pairs.push({
                home: d[1].toUpperCase(),
                foreign: d[0].toUpperCase()
            })
        })
        return pairs;
    }
    async  getLastPrice(pair: pair_interface): Promise<{ price: number, percentChange: number, lowestAsk: number, highestBid: number }> {
        let _data = await this.Get("/api2/1/ticker/" + pair.foreign + "_" + pair.home);
        let data = JSON.parse(_data);
        return { price: parseFloat(data.last), percentChange: parseFloat(data.percentChange), lowestAsk: parseFloat(data.lowestAsk), highestBid: parseFloat(data.highestBid) }
    }
    getAuthHandle(appId: string, key: string): gateIO_authHandle {
        return new gateIO_authHandle(appId, key);
    }
    subscribeTrade(pair: pair_interface) {

    }

    protected async Get(path: string) {
        const requestOptions = {
            url: "https://data.gateio.co" + path,
            method: "GET"
        };
        try {
            let data = await request(requestOptions);
            if (data.error == undefined) {
                return data;
            }
        } catch (e) {
            console.error(e);
        }

        return null;
    }

}
export class gateIO_authHandle extends authHandle {
    protected async Post(path: string, postData: Object = {}) {
        let unescapeStr = querystring.unescape(querystring.stringify(postData));
        let sign = crypto.createHmac('sha512', this.key).update(unescapeStr).digest('hex').toString();
        const requestOptions = {
            url: "https://api.gateio.co" + path,
            method: "POST",
            header: {
                KEY: this.appId,
                SIGN: sign
            },
            form: postData
        };
        try {
            let data = await request(requestOptions);
            if (data.error == undefined) {
                return data;
            }
        } catch (e) {
            console.error(e);
        }

        return null;
    }

    async  buy(pair: pair_interface, price: number, amount: number): Promise<string> {
        let data = await this.Post("/api2/1/private/buy", { currencyPair: pair.foreign + "_" + pair.home, rate: price, amount: amount });
        return JSON.parse(data).orderNumber

    }
    async sell(pair: pair_interface, price: number, amount: number): Promise<string> {
        let data = await this.Post("/api2/1/private/sell", { currencyPair: pair.foreign + "_" + pair.home, rate: price, amount: amount });
        return JSON.parse(data).orderNumber
    }
    async cancelOrder(pair: pair_interface, orderId: string): Promise<boolean> {
        let data = await this.Post("/api2/1/private/cancelOrder", { currencyPair: pair.foreign + "_" + pair.home, orderNumber: orderId });
        return JSON.parse(data).result
    }
    async getBlance(): Promise<{ [name: string]: number }> {
        let data = await this.Post("/api2/1/private/balances", {});
        return JSON.parse(data).available;
    }
}