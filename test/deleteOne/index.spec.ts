import dataProvider from "../../src";

describe("deleteOne", () => {
    const apiUrl = "./test.db"

    it("correct response", async () => {
        const response = await dataProvider(apiUrl)
            .deleteOne({ resource: "posts", id: "1" });

        const { data } = response;

        expect(data).toEqual(null);
    });
});