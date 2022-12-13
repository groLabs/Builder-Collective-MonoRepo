import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { now } from '../utils/utils';


const validate = function validate(validations: ValidationChain[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json(`error :( ${JSON.stringify(errors)}`);
        return next();
    };
};

export {
    validate,
};
