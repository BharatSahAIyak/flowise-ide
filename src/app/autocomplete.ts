/// will do filtering based on context).
import { Completion } from "@codemirror/autocomplete";

export const completions = [
  { label: "panic", type: "keyword" },
  { label: "park", type: "constant", info: "Test completion" },
  { label: "password", type: "variable" },
];

// Define the structure of our tables object
interface Tables {
  [tableName: string]: string[];
}

// Function to parse CREATE TABLE statements
function parseTables(createTableStatements: string): Tables {
  const tables: Tables = {};
  const tableRegex = /CREATE TABLE (\w+) \(([\s\S]*?)\);/gi;
  const columnRegex = /(\w+)\s+\w+/g;

  let match;
  while ((match = tableRegex.exec(createTableStatements)) !== null) {
    const tableName = match[1].toLowerCase();
    const columns: string[] = [];
    let columnMatch;
    while ((columnMatch = columnRegex.exec(match[2])) !== null) {
      columns.push(columnMatch[1].toLowerCase());
    }
    tables[tableName] = columns;
  }

  return tables;
}

// Example CREATE TABLE statements
const createTableStatements = `
  CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100)
  );
  
  CREATE TABLE posts (
    id INT PRIMARY KEY,
    user_id INT,
    title VARCHAR(200),
    content TEXT
  );
  `;

// Parse the CREATE TABLE statements
const tables = parseTables(createTableStatements);

// Function to get completions
function getCompletions(tables: Tables): Completion[] {
  const completions: Completion[] = [];

  // Add table names
  for (const tableName of Object.keys(tables)) {
    completions.push({ label: tableName, type: "type" });
  }

  // Add column names
  for (const [tableName, columns] of Object.entries(tables)) {
    for (const column of columns) {
      completions.push({
        label: column,
        type: "variable",
        info: `Column in ${tableName}`,
      });
    }
  }

  return completions;
}

// Get all completions
const allCompletions = getCompletions(tables);

export const myCompletions = (context: any) => {
  let before = context.matchBefore(/\w+$/);
  if (!before) return null;

  return {
    from: before.from,
    options: allCompletions,
    validFor: /^\w*$/,
  };
};
