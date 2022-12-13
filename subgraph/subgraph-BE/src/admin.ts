import { etlCollectives } from './etl/etlCollectives';
import {
    Stats,
    Subgraph,
} from './types';


(async () => {
    try {
        const params: string[] = process.argv.slice(2);

        if (params.length > 0) {
            switch (params[0]) {
                case 'getPersonalStats':
                    if (params.length === 3) {
                        if ((<any>Object).values(Subgraph).includes(params[1])) {
                            await etlCollectives(
                                Subgraph.PROD_AWS,
                                params[2],
                                0,
                                [],
                                Stats.ALL,
                            );
                        } else {
                            console.log(`Field <subgraph> must have a valid value (eg.: prod_hosted, test_studio...)`);
                        }
                    } else {
                        console.log(`Wrong parameters for getPersonalStats - e.g. getPersonalStats <subgraph> <account>`);
                    }
                    break;
                default:
                    console.log(`Unknown parameter/s: ${params}`);
                    break;
            }
        } else {
            console.log(`Wrong parameters for getPersonalStats - e.g. getPersonalStats <subgraph> <account>`);
        }
        process.exit(0);
    } catch (err) {
        console.log(err);
    }
})();
