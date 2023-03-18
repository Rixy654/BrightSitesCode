const { shareholderReturns } = require("./index.js");

describe("shareholderReturns", () => {
  describe("stage 1", () => {
    test("returns correct data for 60m exit and all common shares", async () => {
      const data = await shareholderReturns(60000000, "./data/cap-table-stage-1.json");
      expect(data).toEqual({
        founders: 20000000,
        preferredA: 4000000,
        preferredB: 6000000,
        preferredC: 30000000
      });
    });
  });

  describe("stage 2", () => {
    test("returns correct data for 25m exit and 1× liquidation preference", async () => {
      const data = await shareholderReturns(25000000, "./data/cap-table-stage-2-and-3.json");
      expect(data).toEqual({
        founders: 2333333,
        preferredA: 1366667,
        preferredB: 2800000,
        preferredC: 18500000
      });
    });
  });

  describe("stage 3", () => {
    test("returns correct data for 35m exit and Preferred A capped", async () => {
      const data = await shareholderReturns(35000000, "./data/cap-table-stage-2-and-3.json");
      expect(data).toEqual({
        founders: 5750000,
        preferredA: 1800000,
        preferredB: 3825000,
        preferredC: 23625000
      });
    });
  });

  describe("stage 4", () => {
    test("returns correct data for 45m exit, Preferred A coverting to common shares and Preferred B capped", async () => {
      const data = await shareholderReturns(45000000, "./data/cap-table-stage-4.json");
      expect(data).toEqual({
        founders: 9555556,
        preferredA: 1911111,
        preferredB: 4200000,
        preferredC: 29333333
      });
    });
  });

  describe("errors", () => {
    test("throws error when every parameter is missing", async () => {
      await expect(shareholderReturns()).rejects.toThrow("Parameter missing, please check you've specified an exit value and cap table e.g. npm run init 60000000 ./data/cap-table-stage-1.json");
    });

    test("throws error when path parameter is missing", async () => {
      await expect(shareholderReturns(45000000)).rejects.toThrow("Parameter missing, please check you've specified an exit value and cap table e.g. npm run init 60000000 ./data/cap-table-stage-1.json");
    });
  });
});