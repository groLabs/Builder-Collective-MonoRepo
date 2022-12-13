import { TX_ITERATION } from '../constants';
import { Stats } from '../types';
import { showError } from './logHandler';
import { callSubgraph } from '../caller/subgraphCaller';


export const getCollectives = async (
    url: string,
    account: string,
    skip: number,
    result: any,
    stats: Stats,
): Promise<any> => {
    try {
        const call = await callSubgraph(
            url,
            account,
            TX_ITERATION,
            skip,
            stats,
        );
        if (call.errors) {
            return call;
        } else {
            if (skip === 0) {
                result = call.data;
            } else {
                const cols = result.collectives.concat(call.data.collectives);
                result.collectives = cols;
            }
            return (call.data.collectives.length < TX_ITERATION)
                ? result
                : getCollectives(
                    url,
                    account,
                    skip + TX_ITERATION,
                    result,
                    stats,
                );
        }
    } catch (err) {
        showError('handler/collectivesHandler.ts->getCollectives()', err);
        return null;
    }
}
