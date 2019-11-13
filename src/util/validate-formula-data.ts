import { FormulaNode } from "../types";

interface ValidationData {
    valid: boolean
};

export const validateFormulaData = (data: FormulaNode) : ValidationData => {
    return { valid: true };
};