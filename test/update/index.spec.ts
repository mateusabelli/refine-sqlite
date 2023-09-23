import dataProvider from "../../src/index";

// TODO: Fix this test
describe("update", () => {
    const apiUrl = "./test.db"

    it("correct response", async () => {
        const response = await dataProvider(apiUrl)
            .update({
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