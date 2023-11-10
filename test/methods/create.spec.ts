import dataProvider from "../../src";

describe("create", () => {
    it("correct response", async () => {
        const response = await dataProvider(
            "local",
            "http://localhost:5173/test.db",
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
