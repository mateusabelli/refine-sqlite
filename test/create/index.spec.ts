import dataProvider from "../../src";

describe("create", () => {
    const apiUrl = "./test.db"

    it("correct response", async () => {
        const response = await dataProvider(
            apiUrl
        ).create({
            resource: "posts",
            variables: { id: 1001, title: "foo", category_id: 1 },
        });

        const { data } = response;

        expect(data["id"]).toBe(1001);
        expect(data["title"]).toBe("foo");
        expect(data["category_id"]).toBe(1);
    });
});