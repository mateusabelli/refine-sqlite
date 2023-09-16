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

// TODO: implement this function properly
export const generateFilter = (filters?: CrudFilters) => {
    const queryFilters: { [key: string]: string } = {};

    if (filters) {
        filters.map((filter) => {
            if (filter.operator === "or" || filter.operator === "and") {
                throw new Error(
                    `[@refinedev/simple-rest]: \`operator: ${filter.operator}\` is not supported. You can create custom data provider. https://refine.dev/docs/api-reference/core/providers/data-provider/#creating-a-data-provider`,
                );
            }

            // Check if the filter is of LogicalFilter type
            if ("field" in filter) {
                const { field, operator, value } = filter;

                if (field === "q") {
                    queryFilters[field] = value;
                    return;
                }

                const mappedOperator = mapOperator(operator);
                queryFilters[`${field}${mappedOperator}`] = value;
            }
        });
    }

    return queryFilters;
};