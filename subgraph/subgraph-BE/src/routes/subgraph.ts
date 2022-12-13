import express, { Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';
import { validate } from '../common/validate';
import { showError } from '../handler/logHandler';
import { etlCollectives } from '../etl/etlCollectives';
import {
    Stats,
    Subgraph,
} from '../types';


const router = express.Router();

const wrapAsync = function wrapAsync(fn: any) {
    return function wrap(req: Request, res: Response, next: NextFunction) {
        fn(req, res, next).catch(next);
    };
}

// E.g.: http://localhost:3016/gro_together/gro_all_collectives?subgraph=prod_hosted
router.get(
    '/all_collectives',
    validate([
        query('subgraph')
            .trim()
            .notEmpty()
            .withMessage(`field <subgraph> can't be empty`),
    ]),
    wrapAsync(async (req: Request, res: Response) => {
        try {
            // if errors during validation, response has been already sent, so just exit
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return;
            const { subgraph } = req.query;
            if ((<any>Object).values(Subgraph).includes(subgraph)) {
                const personalStats = await etlCollectives(
                    Subgraph.PROD_AWS,
                    '',
                    0,
                    [],
                    Stats.ALL
                );
                res.json(personalStats);
            } else if (subgraph) {
                // subgraph value is incorrect
                const err_msg = `unknown target subgraph <${subgraph}>`;
                showError('routes->subgraph.ts on /gro_stats_mc', err_msg);
                res.json(`error :( ${err_msg}`);
            }
        } catch (err) {
            showError('routes/subgraph.ts->gro_stats_mc', err);
            res.json(`error :( ${err}`);
        }
    })
);

// E.g.: http://localhost:3016/subgraph/gro_personal_collectives?subgraph=prod_hosted&address=0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
router.get(
    '/personal_collectives',
    validate([
        query('subgraph')
            .trim()
            .notEmpty()
            .withMessage(`field <subgraph> can't be empty`),
        query('address')
            .notEmpty()
            .withMessage(`address can't be empty`)
            .isLength({ min: 42, max: 42 })
            .withMessage('address must be 42 characters long')
            .matches(/^0x[A-Za-z0-9]{40}/)
            .withMessage('should be a valid address and start with "0x"'),
    ]),
    wrapAsync(async (req: Request, res: Response) => {
        try {
            // if errors during validation, response has been already sent, so just exit
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return;
            const { subgraph, address } = req.query;
            if ((<any>Object).values(Subgraph).includes(subgraph)) {
                // address & subgraph fields are correct
                const personalStats = await etlCollectives(
                    Subgraph.PROD_AWS,
                    address as string,
                    0,
                    [],
                    Stats.PERSONAL
                );
                res.json(personalStats);
            } else if (subgraph) {
                // subgraph value is incorrect
                const err_msg = `unknown target subgraph <${subgraph}>`;
                showError('routes->subgraph.ts on /gro_personal_position_mc', err_msg);
                res.json(`error :( ${err_msg}`);
            }
        } catch (err) {
            showError('routes/subgraph.ts->gro_personal_position_mc', err);
            res.json(`error :( ${err}`);
        }
    })
);

export default router;
