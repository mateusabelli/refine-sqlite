import { CrudOperators } from "@refinedev/core";
import { mapOperator } from "../../src/utils";

describe("mapOperator", () => {
    it("should return correct mapping for given operator", () => {
        const operatorMappings: Record<CrudOperators, string> = {
            ne: "IS NOT",
            gte: ">=",
            lte: "<=",
            contains: "LIKE",
            eq: "IS",
            and: "",
            between: "",
            containss: "",
            endswith: "",
            endswiths: "",
            gt: "",
            in: "",
            lt: "",
            ncontains: "",
            ncontainss: "",
            nendswith: "",
            nendswiths: "",
            nnull: "",
            nin: "",
            nbetween: "",
            nstartswith: "",
            nstartswiths: "",
            null: "",
            or: "",
            startswith: "",
            startswiths: "",
            ina: "",
            nina: ""
        };

        for (const operator in operatorMappings) {
            const expectedResult = operatorMappings[operator as CrudOperators];
            expect(mapOperator(operator as CrudOperators)).toEqual(
                expectedResult,
            );
        }
    });

    it.each(["unsupported", "", undefined, null])(
        "should return empty string for %s operator ",
        (operator) => {
            expect(mapOperator(operator as CrudOperators)).toEqual("");
        },
    );
});
