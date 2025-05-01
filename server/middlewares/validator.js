import { body, validationResult } from "express-validator";

const validationRules = ()=>{
    return [
        body('name').notEmpty().withMessage('الاسم مطلوب'),
        body('email')
                    .notEmpty().withMessage('البريد الإلكتروني مطلوب')
                    .isEmail().withMessage('يجب عليك إدخال صيغة بريد إلكتروني صحيحة'),
        body('password')
                    .notEmpty().withMessage("كلمة المرور مطلوبة")
                    .isLength({min: 5}).withMessage("كلمة المرور يجب ألا تقل عن  5 محارف")
    ]
}

const validate = (req, res, next)=>{
    const errors = validationResult(req)
    if(errors.isEmpty()){
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({
        [err.path]: err.msg
    }))
    res.status(400).json({error: extractedErrors})
}

export {validationRules, validate}