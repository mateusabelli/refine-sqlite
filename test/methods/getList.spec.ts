import dataProvider from "../../src";

describe("getList", () => {
    const apiUrl = "./test.db"

    it("correct response", async () => {
        const response = await dataProvider(apiUrl)
            .getList({resource: "posts" })

        expect(response.data[0]["id"]).toBe(1);
        expect(response.data[0]["title"]).toBe("Soluta et est est.");
        expect(response.total).toBe(6);
    })

    it("correct response with pagination", async () => {
        const response = await dataProvider(apiUrl)
            .getList({
                resource: "posts",
                pagination: {
                    current: 3,
                    pageSize: 2,
                }
            });

        expect(response.data[0]["id"]).toBe(5);
        expect(response.data[0]["title"]).toBe("Dolorem eum non quis officiis iusto.");
        expect(response.total).toBe(2);
    })

    it("correct sorting response", async () => {
        const response = await dataProvider(apiUrl)
            .getList({
                resource: "posts",
                sorters: [
                    {
                        field: "id",
                        order: "desc",
                    }
                ],
            });

        expect(response.data[0]["id"]).toBe(6);
        expect(response.data[0]["title"]).toBe("Dolorem unde et officiis.");
        expect(response.total).toBe(6);
    });

    it("correct filter response", async () => {
        const response = await dataProvider(apiUrl)
            .getList({
                resource: "posts",
                filters: [
                    {
                        field: "category_id",
                        operator: "eq",
                        value: ["2"],
                    },
                ],
            });

        expect(response.data[0]["category_id"]).toBe(2);
        expect(response.total).toBe(2);
    });

    it("correct filter and sort response", async () => {
        const response = await dataProvider(apiUrl)
            .getList({
                resource: "posts",
                filters: [
                    {
                        field: "category_id",
                        operator: "eq",
                        value: ["2"],
                    },
                ],
                sorters: [
                    {
                        field: "title",
                        order: "asc",
                    },
                ],
            });

        expect(response.data[0]["id"]).toBe(6);
        expect(response.total).toBe(2);
    });
});