
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
    const keys = Reflect.ownKeys(propsObject);
    for (const key of keys){
        const prop = obj[key];
        const propType = typeof(prop);
        const requiredType = propsObject[key];
        if (propType === "undefined"){
            throw new MissingPropertyError(`missing property ${prop} in ` + obj);
        }
        if (!isOfType(requiredType, propType)){
            throw new WrongPropertyTypeError(`property ${prop} in ${obj} must be ${requiredType} but is ${propType}`);
        }
    }
});