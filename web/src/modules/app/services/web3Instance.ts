/* eslint-disable @typescript-eslint/no-unsafe-argument */
import Web3 from 'web3';
import { web3Provider } from './web3Provider';

let instance: Web3;

export function setWeb3Instance(item: Web3): void {
    instance = item;
    window.web3 = item;
}

export function web3Instance(): Web3 {
    if (!instance) {
        setWeb3Instance(new Web3(web3Provider));
    }

    return instance;
}
