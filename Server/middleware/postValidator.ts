import {Request, Response, NextFunction} from "express";
import {check, validationResult} from "express-validator";

interface ParsedBody {
    tags?: string | string[];
    featured?: string | boolean;
}

const parseData = (req: Request<{}, {}, ParsedBody>, res: Response, next: NextFunction): void => {
    try {
        const { tags, featured } = req.body;

        if (tags) req.body.tags = typeof tags === "string" ? JSON.parse(tags) : tags;
        if (featured) req.body.featured = typeof featured === "string" ? JSON.parse(featured) : featured;

        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid JSON format in tags or featured" });
        return;
    }
};


export {parseData};


export const postValidator = [
    check('title').trim().not().isEmpty().withMessage('Title is missing!'),
    check('content').trim().not().isEmpty().withMessage('Content is missing!'),
    check('meta').trim().not().isEmpty().withMessage('Meta is missing!'),
    check('slug').trim().not().isEmpty().withMessage('Slug is missing!'),
    check('tags').custom((tags: string | string[]) => {
        if (!Array.isArray(tags)) {
            throw new Error('Tags must be an array');
        }
        return true;
    }),
];

export function validate(req: Request, res: Response, next: NextFunction) {

    const errors = validationResult(req).array();
    if (errors.length > 0) {
        res.status(401).json({error: errors[0].msg});
        return;
    }
    next();
}
