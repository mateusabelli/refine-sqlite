import {CrudOperators} from "@refinedev/core";

export const mapOperator = (operator: CrudOperators): string => {
    switch (operator) {
        case "ne":
            return "IS NOT";
        case "gte":
            return ">=";
        case "lte":
            return "<=";
        case "contains":
            return "LIKE"
        case "eq":
            return "IS"
        default:
            return "";
    }
};
