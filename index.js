import { readFile } from 'fs/promises';

async function loadData(jsonPath) {
  const dataPath = new URL(jsonPath, import.meta.url);
  const jsonData = await readFile(dataPath, 'utf-8');
  return JSON.parse(jsonData);
}

function calculateShareholderReturn(totalReturn, ownership, totalShares) {
  return Math.round((totalReturn / 100) * (ownership / totalShares * 100));
}

/**
 * Returns object containing share info based off exit distribution and cap table
 * To run function npm run init {amount} {amended json file to relevant cap info}
 * e.g. npm run init 60000000, "./data/cap-table-stage-1.json"
 * 
 * @param {number} exitValue The exit distribution
 * @param {string} jsonPath Path to json object contraining cap table info and convertions
 * @returns {object} shares info
 */

async function shareholderReturns(exitValue = 0, jsonPath = "") {

  if (exitValue !== 0 && jsonPath !== "") {
    const data = await loadData(jsonPath);
    const shareholders = {};

    let totalReturn = Math.max(exitValue - (data.liquidationPreferences ? data.totalInvestment : 0), 0);

    if (data.liquidationPreferences) {
      Object.entries(data.shareClass).forEach(([stakeholder, ownership]) => {
        let shareholderReturn = calculateShareholderReturn(totalReturn, ownership.numOfShares, data.totalShares);

        if (shareholderReturn > ownership.invested && !ownership.common) {
          shareholderReturn = ownership.invested * 2;
          shareholders[stakeholder] = shareholderReturn;
          data.totalShares -= ownership.numOfShares;
          totalReturn -= ownership.invested;
        }
      });
    }

    Object.entries(data.shareClass).forEach(([stakeholder, ownership]) => {
      if (!shareholders.hasOwnProperty(stakeholder)) {
        let shareholderReturn = calculateShareholderReturn(totalReturn, ownership.numOfShares, data.totalShares);
        if (!ownership.common) {
          shareholderReturn += ownership.invested;
        }

        shareholders[stakeholder] = shareholderReturn;
      }
    });
    return shareholders;
  } {
    throw new Error("Parameter missing, please check you've specified an exit value and cap table e.g. npm run init 60000000 ./data/cap-table-stage-1.json");
  }

}

export { shareholderReturns };
