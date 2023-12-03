import {dataProvider} from "../../src";

describe("deleteOne", () => {
    const apiUrl = "./test/test.db"

    it("correct response", () => {
        const response = dataProvider(apiUrl)
            .deleteOne({ resource: "posts", id: "1" });

        const { data } = response;

        expect(data).toEqual(null);
    });
});
