export interface pair_interface {
    foreign: string,
    home: string

}
export interface authHandle_interface {
    buyLimit(pair: pair_interface, price: number, amount: number);
    sellLimit(pair: pair_interface, price: number, amount: number);
    buyMarket(pair: pair_interface, amount: number);
    sellMarket(pair: pair_interface, amount: number);
    getBlance(): Promise<{ [name: string]: number }>
}
export interface market_interface {
    getPairs(): Promise<pair_interface[]>;
    getLastPrice(pair: pair_interface): Promise<number>;
    getAuthHandle(appId: string, key: string): authHandle_interface

}
export abstract class market implements market_interface {
    constructor(parameters) {

    }
    abstract getPairs(): Promise<pair_interface[]>;
    abstract getLastPrice(pair: pair_interface): Promise<number>;
    abstract getAuthHandle(appId: string, key: string): authHandle_interface;
}
export abstract class authHandle implements authHandle_interface {
    abstract async buyLimit(pair: pair_interface, price: number, amount: number);
    abstract async sellLimit(pair: pair_interface, price: number, amount: number);
    abstract async buyMarket(pair: pair_interface, amount: number);
    abstract async sellMarket(pair: pair_interface, amount: number);
    abstract async getBlance(): Promise<{ [name: string]: number }>
}