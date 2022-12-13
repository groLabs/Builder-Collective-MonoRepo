/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
/* eslint-disable func-style */

import { RPCSubprovider } from "@0x/subproviders/lib/src/subproviders/rpc_subprovider";
import { TrezorSubprovider } from "@0x/subproviders/lib/src/subproviders/trezor";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import type { MetaMaskInpageProvider } from "@metamask/inpage-provider";

// @ts-ignore
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import TrezorConnect from "trezor-connect";
import Web3ProviderEngine from "web3-provider-engine";
// @ts-ignore
import CacheSubprovider from "web3-provider-engine/subproviders/cache";
import { INFURA_ID, isMainnet } from "../../../constants";

//  Used when we reload a page, we try to pick the previous connected metamask provider

const MAINNET_RPC = `https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`;
const ROPSTEN_RPC = `https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`;
const AVAX_RPC = "https://api.avax.network/ext/bc/C/rpc";

export async function getStoredMetamaskProvider(): Promise<any> {
  // see: https://www.npmjs.com/package/@metamask/detect-provider
  // From now on, this should always be true: provider === window.ethereum
  try {
    if (window.ethereum) {
      const eth = window.ethereum as MetaMaskInpageProvider;
      await eth.request({ method: "eth_requestAccounts" });
      return { provider: window.ethereum };
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function getTrezorProvider(isAvax?: boolean): Promise<any> {
  try {
    TrezorConnect.manifest({
      appUrl: "https://8rg3h.csb.app/",
      email: "dummy@abc.xyz",
    });

    const engine = new Web3ProviderEngine({ pollingInterval: 12000 });
    const subprovider = new TrezorSubprovider({
      accountFetchingConfigs: {},
      networkId: 3,
      trezorConnectClientApi: TrezorConnect,
    });
    engine.addProvider(subprovider);

    engine.addProvider(new CacheSubprovider());
    engine.addProvider(
      new RPCSubprovider(isAvax ? AVAX_RPC : ROPSTEN_RPC, 12000)
    );

    engine.start();

    return { provider: engine };
  } catch (e) {
    return null;
  }
}

export async function getLedgerProvider(isAvax?: boolean): Promise<any> {
  try {
    const engine = new Web3ProviderEngine({ pollingInterval: 12000 });
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getTransport = () => TransportWebUSB.create();
    const ledger = createLedgerSubprovider(getTransport, {
      accountsLength: 5,
      networkId: 3,
    });
    engine.addProvider(ledger);
    engine.addProvider(
      new RPCSubprovider(isAvax ? AVAX_RPC : MAINNET_RPC, 12000)
    );

    engine.start();

    return { provider: engine };
  } catch (e) {
    return null;
  }
  // try {
  //     const transport = await TransportWebUSB.create();
  //     const eth = new Eth(transport);
  //     const { address } = await eth.getAddress("44'/60'/0'/0/0", false);
  //     const provider = new web3.providers.HttpProvider(MAINNET_RPC);
  //     return { account: address, provider };
  // } catch (e) {
  //     console.warn(e);
  //     const provider = new web3.providers.HttpProvider(MAINNET_RPC);
  //     return {
  //         account: '0x106E7ECA4A0DAc78EadfaB1FeA20336290694139',
  //         provider,
  //     };
  // }
}

export async function getCoinbaseWalletProvider(): Promise<any> {
  try {
    const provider = new CoinbaseWalletSDK({
      appLogoUrl: "",
      appName: "GRO",
      darkMode: false,
    });

    const coinbaseProvider = provider.makeWeb3Provider(MAINNET_RPC, 1);
    await coinbaseProvider.enable();
    return { provider: coinbaseProvider };
  } catch (err) {
    return null;
  }
}

export async function getWalletConnectProvider(
  isArgent?: boolean
): Promise<any> {
  const qrOptions = isArgent
    ? {
        qrcodeModalOptions: {
          desktopLinks: [],
        },
      }
    : {};
  try {
    const provider = new WalletConnectProvider({
      chainId: isMainnet ? 1 : 3,
      infuraId: INFURA_ID,
      ...qrOptions,
      rpc: {
        1: MAINNET_RPC,
        3: ROPSTEN_RPC,
        43114: AVAX_RPC,
      },
    });

    //  Enable session (triggers QR Code modal or reconnects if it has connected before)
    await provider.enable();

    // Hack to remove request and allow to listen for receipt events https://github.com/ChainSafe/web3.js/issues/3891#issuecomment-828722105
    // Can remove in V1.6.1 of web3
    // At some point we want to update to version 2 of wallet connect https://docs.walletconnect.org/v/2.0/quick-start/dapps/web3-provider
    // eslint-disable-next-line
    // delete provider.__proto__.request;
    // // eslint-disable-next-line
    // if (provider.hasOwnProperty('request')) {
    //     // @ts-ignore
    //     delete provider.request;
    // }

    return { provider };
  } catch (e) {
    return null;
  }
}

let currentProvider: any = null;

export function getCurrentProvider(): any {
  return currentProvider;
}

export function setCurrentProvider(provider: any): void {
  currentProvider = provider;
}

export async function closeSession(): Promise<void> {
  const provider = getCurrentProvider();

  if (provider && provider.disconnect) {
    await provider.disconnect();
  }

  localStorage.clear();
  // window.location.reload();
}
