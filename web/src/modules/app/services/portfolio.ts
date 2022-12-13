import axios from "axios";

const etherscanAPI = axios.create({
  baseURL: "https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com",
});

export async function getPortfolio(wallet: string) {
  const { data } = await etherscanAPI.get(`/portfolio/${wallet}`);
  return data
}


export async function getTransactionHistory(wallet: string) {
  const { data } = await etherscanAPI.get(`/transaction/history/${wallet}`);
  return data;
}