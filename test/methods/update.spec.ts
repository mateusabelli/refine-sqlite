import dataProvider from "../../src";

describe("update", () => {
    it("correct response", async () => {
        const response = await dataProvider(
            "inMemory",
            "http://localhost:5173/test.db"
        ).update({
            resource: "posts",
            id: "1",
            variables: {
                id: 1,
                title: "foo",
            },
        });

        const { data } = response;

        expect(data["id"]).toBe(1);
        expect(data["title"]).toBe("foo");
    });
});
