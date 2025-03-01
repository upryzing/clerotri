import {readFile, writeFile} from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';

const silent = process.argv.includes('-silent');
function log(message) {
  if (!silent) {
    console.log(message);
  }
}

const prettyPrint = !process.argv.includes('-prod');

const dir = fileURLToPath(import.meta.url);
const currentDir = path.dirname(dir);
const parentDir = path.dirname(currentDir);

const rawData = await readFile(`${parentDir}/assets/data/licenses.json`, 'utf-8');
const data = rawData.toString();

log('[LICENSELISTPROCESSOR] Cleaning up licenses list...');

// Parse the JSON stream
const jsonObjects = data
  .split('\n')
  .filter((line) => line.trim()) // Remove empty lines
  .map((line) => JSON.parse(line)); // Parse each JSON object

// Find the final "table" object containing the license data
const tableData = jsonObjects.find((obj) => obj.type === 'table')?.data;

if (!tableData) {
  console.error('No license data found in the output.');
  process.exit(1);
}

const newArray = [];

// Process the license data
tableData.body.forEach((row) => {
  const [name, version, license, url, vendorUrl, vendorName] = row;

  // Clean up the package name (remove workspace prefix if present)
  const cleanedName = name.replace('@workspace:.', '');

  // Create a new package info object
  const packageInfo = {
    name: cleanedName,
    version,
    license,
    url: url || vendorUrl || '',
    vendorName: vendorName || '',
  };

  newArray.push(packageInfo);
});

const newData = JSON.stringify(newArray, null, prettyPrint ? 2 : 0);

log(newData);

await writeFile(`${parentDir}/assets/data/licenses.json`, newData);