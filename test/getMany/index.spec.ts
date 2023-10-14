import dataProvider from "../../src/index";

describe("getMany", () => {
    const apiUrl = "./test.db";

    it("correct response", async () => {
        const response = await dataProvider(apiUrl)
            .getMany({ resource: "posts", ids: [2, 5]});

        const { data } = response;

        expect(data[0]["id"]).toBe(2);
        expect(data[1]["id"]).toBe(5);
    });
});
