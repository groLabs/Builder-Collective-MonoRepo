import axios from 'axios'

const etherscanAPI = axios.create({ baseURL: "https://api.etherscan.io/" });

export async function getWalletTransactions(wallet: string) {
    const { data } = await etherscanAPI.get("/api", {
      params: {
        module: "account",
        action: "txlist",
        address: wallet,
        startblock: 0,
        endblock: 99999999,
        apikey: "C8FNTC46DIGY4XZH9W4KS5XVXF71I19CHX",
      },
    });

    return data?.result
}