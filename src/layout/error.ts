
export class MissingPropertyError extends Error {
	constructor(message: string){
		super(message);
		this.name = "MissingPropertyError";
	}
}
export class WrongPropertyTypeError extends Error {
    constructor(message: string){
		super(message);
		this.name = "PropertyTypeError";
	}
}

const isOfType = (type: string, toCheck: any) : boolean => {
    if (type === "array"){
        return Array.isArray(toCheck);
    }
    return type === typeof(toCheck);
};
export const validateProperties = (propsObject: object) => ((obj: object) => {
    const keys = Reflect.ownKeys(propsObject) as string[];
    for (const key of keys){
        const prop = obj[key];
        const propType = typeof(prop);
        const requiredType = propsObject[key];
        if (propType === "undefined"){
            throw new MissingPropertyError(`missing property ${key} in ` + obj);
        }
        if (!isOfType(requiredType, prop)){
            throw new WrongPropertyTypeError(`property ${key} in ${obj} must be ${requiredType} but is ${propType}`);
        }
    }
});


import { Style } from "../style";
import { hasFontFamilyUnicode } from "../font-data/katex-font-util";
export const validateCharInFont = (style: Style, char: string) => {
	if (!hasFontFamilyUnicode(style.fontFamily, style.emphasis, char.charCodeAt(0))){
		throw `font ${style.fontFamily}-${style.emphasis} does not contain '${char}'`
	}
};