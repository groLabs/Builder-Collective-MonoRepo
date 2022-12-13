import axios from 'axios';
import { Stats } from '../types';
import { showError } from '../handler/logHandler';
import {
    queryAllCollectives,
    queryPersonalCollectives,
} from '../graphql/collectives';


export const callSubgraph = async (
    url: string,
    account: string,
    first: number,
    skip: number,
    stats: Stats,
): Promise<any> => {
    let q;
    if (stats === Stats.ALL) {
        q = queryAllCollectives(
            first,
            skip
        );
    } else if (stats === Stats.PERSONAL) {
        q = queryPersonalCollectives(
            account,
            first,
            skip
        );
    } else {
        showError(
            'caller/subgraphCaller.ts->callSubgraph()',
            `unknown stats ${stats}}`,
        );
        return null;
    }
    const result = await axios.post(
        url,
        { query: q }
    );
    if (result.data.errors) {
        showError(
            'caller/subgraphCaller.ts->callSubgraph() [Error from Subgraph]',
            JSON.stringify(result.data.errors, null, 1),
        );
    }
    return result.data;
}
