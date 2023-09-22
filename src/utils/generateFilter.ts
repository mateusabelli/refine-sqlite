import {CrudFilters} from "@refinedev/core";
import {CrudOperators} from "@refinedev/core";

const mapOperator = (operator: CrudOperators): string => {
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

export const generateFilter = (filters?: CrudFilters) => {
    let queryFilterString = "";

    if (filters) {
        filters.map((filter) => {
            if (filter.operator === "or" || filter.operator === "and") {
                throw new Error(
                    `[refine-sqlite]: \`operator: ${filter.operator}\` is not supported. You can create custom data provider. https://refine.dev/docs/api-reference/core/providers/data-provider/#creating-a-data-provider`,
                );
            }

            // Check if the filter is of LogicalFilter type
            if ("field" in filter) {
                const { field, operator, value } = filter;

                queryFilterString += `${field} ${mapOperator(operator)} ${value} AND `;
            }
        });
    }

    // Returns the query string without the last 5 characters (AND + space)
    return queryFilterString.slice(0, -5)
};