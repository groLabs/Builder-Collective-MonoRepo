import {
    getCollectives
} from '../handler/collectivesHandler';
import {
    Stats,
    Subgraph,
} from '../types';
import {
    now,
    getUrl,
} from '../utils/utils';
import {
    showInfo,
    showError,
} from '../handler/logHandler';


export const etlCollectives = async (
    subgraph: Subgraph,
    _account: string,
    skip: number,
    result: any,
    stats: Stats,
): Promise<any> => {
    try {
        const url = getUrl(subgraph);
        let resultEth;
        if (stats === Stats.ALL) {
            resultEth = await getCollectives(
                url.ETH,
                '',
                skip,
                result,
                stats,
            );
        } else if (stats === Stats.PERSONAL) {
            const account = _account.toLowerCase(); // Subgraphs store addresses in lowercase
            resultEth = await getCollectives(
                url.ETH,
                account,
                skip,
                result,
                stats
            );
        } else {
            console.log('No stats for ETL');
            return;
        }

        if (resultEth.errors) {
            // return personalStatsError(
            //     now(),
            //     _account,
            //     resultEth.errors.map((item: any) => item)
            // );
            return 'oops! an error here';
        } else if (resultEth) {
            // const resultEthParsed = parsePersonalStatsSubgraphEthereum(
            //     account,
            //     resultEth
            // );
            showInfo(`Graphql query requested`);
            // console.log(resultEth);
            // console.dir(resultEth, { depth: null });
            return resultEth;
        } else {
            return 'shit! no data';
        }
    } catch (err) {
        showError('etl/etlSubgraph.ts->etlCollective()', err);
        return `error :( ${err}`;
    }
}
