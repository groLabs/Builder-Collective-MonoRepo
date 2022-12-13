import axios from 'axios'

const graphAPI = axios.create({
  baseURL:
    "https://9d0x5174a3.execute-api.eu-west-2.amazonaws.com/gro_together",
});

export async function getCollectives() {
    const { data } = await graphAPI.get(
      "/all_collectives?subgraph=prod_hosted"
    );

    return data
}
