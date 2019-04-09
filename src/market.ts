import { EventEmitter } from "events";

export interface pair_interface {
    foreign: string,
    home: string

}
// export interface authHandle_interface {
//     buy(pair: pair_interface, price: number, amount: number): Promise<string>;
//     sell(pair: pair_interface, price: number, amount: number): Promise<string>;

//     getBlance(): Promise<{ [name: string]: number }>;
//     cancelOrder(pair: pair_interface, orderId: string): Promise<boolean>
// }
// export interface market_interface {

//     getPairs(): Promise<pair_interface[]>;
//     getLastPrice(pair: pair_interface): Promise<{ price: number, percentChange: number, lowestAsk: number, highestBid: number }>;
//     subscribeTrade(pair: pair_interface);
//     getAuthHandle(appId: string, key: string): authHandle_interface;


// }
export abstract class market extends EventEmitter {
    constructor() {
        super();
    }
    abstract getPairs(): Promise<pair_interface[]>;
    abstract getLastPrice(pair: pair_interface): Promise<{ price: number, percentChange: number, lowestAsk: number, highestBid: number }>;
    abstract getAuthHandle(appId: string, key: string): authHandle;
    abstract getWsHandle(): marketWs;
}
export abstract class authHandle {
    protected appId: string = "";
    protected key: string = ""
    constructor(appId: string, key: string) {
        this.appId = appId;
        this.key = key;
    }
    abstract async buy(pair: pair_interface, price: number, amount: number): Promise<string>;
    abstract async sell(pair: pair_interface, price: number, amount: number): Promise<string>;
    abstract async cancelOrder(pair: pair_interface, orderId: string): Promise<boolean>;
    abstract async getBlance(): Promise<{ [name: string]: number }>
}
export abstract class marketWs {
    constructor() {

    }
}