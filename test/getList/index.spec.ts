// import axios from "axios";

// import JsonServer from "../../src/index";
import dataProvider from "../../src/index";
// import "./index.mock";

// axios.defaults.adapter = require("axios/lib/adapters/http");

describe("getList", () => {
    const apiUrl = "./test.db"

    it("correct response", async () => {
        const response = await dataProvider(apiUrl)
            .getList({resource: "posts"});

        expect(response.data[0]["id"]).toBe(1);
        expect(response.data[0]["title"]).toBe("Soluta et est est.");
        expect(response.total).toBe(6);
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

    // TODO: fix this test
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

    // TODO: fix this test
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
                        field: "id",
                        order: "asc",
                    },
                ],
            });

        expect(response.data[0]["id"]).toBe(44);
        expect(response.total).toBe(17);
    });
});

// describe("getList", () => {
//     it("correct response", async () => {
//         const response = await JsonServer(
//             "https://api.fake-rest.refine.dev",
//             axios,
//         ).getList({ resource: "posts" });
//
//         expect(response.data[0]["id"]).toBe(1);
//         expect(response.data[0]["title"]).toBe(
//             "Mollitia ipsam nisi in porro velit asperiores et quaerat dolorem.",
//         );
//         expect(response.total).toBe(1000);
//     });
//
//     it("correct sorting response", async () => {
//         const response = await JsonServer(
//             "https://api.fake-rest.refine.dev",
//             axios,
//         ).getList({
//             resource: "posts",
//             sorters: [
//                 {
//                     field: "id",
//                     order: "asc",
//                 },
//             ],
//         });
//
//         expect(response.data[0]["id"]).toBe(1);
//         expect(response.data[0]["title"]).toBe(
//             "Mollitia ipsam nisi in porro velit asperiores et quaerat dolorem.",
//         );
//         expect(response.total).toBe(1000);
//     });
//
//     it("correct filter response", async () => {
//         const response = await JsonServer(
//             "https://api.fake-rest.refine.dev",
//             axios,
//         ).getList({
//             resource: "posts",
//             filters: [
//                 {
//                     field: "category.id",
//                     operator: "eq",
//                     value: ["1"],
//                 },
//             ],
//         });
//
//         expect(response.data[0]["category"]["id"]).toBe(1);
//         expect(response.total).toBe(17);
//     });
//
//     it("correct filter and sort response", async () => {
//         const response = await JsonServer(
//             "https://api.fake-rest.refine.dev",
//             axios,
//         ).getList({
//             resource: "posts",
//             filters: [
//                 {
//                     field: "category.id",
//                     operator: "eq",
//                     value: ["1"],
//                 },
//             ],
//             sorters: [
//                 {
//                     field: "id",
//                     order: "asc",
//                 },
//             ],
//         });
//
//         expect(response.data[0]["id"]).toBe(44);
//         expect(response.total).toBe(17);
//     });
// });
