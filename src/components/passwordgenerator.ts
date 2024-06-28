import Papa from "papaparse";
import { sample, random } from "lodash";
import cuteCsvPath from "../assets/wordlist.csv?url";
import dirtyCsvPath from "../assets/dirtywordlist.csv?url";

const specialCharacters = "!@#$%^&*()_+[]{}|;:,.<>?";
const friendlyCharacters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const fetchAndParseFile = async (cute: boolean): Promise<string[]> => {
  let csvUrl = "";

  if (cute) {
    csvUrl = cuteCsvPath;
  } else {
    csvUrl = dirtyCsvPath;
  }

  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    // Check if the response is of type CSV
    const contentType = response.headers.get("Content-Type");
    if (!contentType || !contentType.includes("text/csv")) {
      throw new Error("Unexpected content type: Expected CSV");
    }
    const csvText = await response.text();
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        complete: (result: Papa.ParseResult<string[]>) => {
          const words = result.data.flat();
          resolve(words);
        },
      });
    });
  } catch (error) {
    console.error("Error fetching or parsing the file:", error);
    return [];
  }
};

export async function generatePassword(
  passwordLength: number,
  cute: boolean,
  friendly: boolean,
  randomizeCase: boolean = true
) {
  const wordList = await fetchAndParseFile(cute);
  if (wordList.length === 0) return "";

  console.log(friendly);
  if (friendly) {
    return generateFriendlyPassword(passwordLength, wordList, randomizeCase);
  }

  let password = "";
  const maxAttempts = 100; // Define a maximum number of attempts
  let attempts = 0;

  while (password.length < passwordLength - 2 && attempts < maxAttempts) {
    let word = sample(wordList);
    if (word && randomizeCase) {
      word = randomizeWordCase(word);
    }
    attempts++;
    console.log(password, password.length);
    if (word && password.length + word.length <= passwordLength - 2) {
      password += word;
    }
  }

  if (password.length < passwordLength - 2) {
    password = insertSpecialCharacters(
      password,
      passwordLength - password.length
    );
    console.warn(
      "Failed to generate a friendly password of the desired length"
    );
    return password;
  }

  password = insertSpecialCharacters(password, 2);
  return password;
}

const generateFriendlyPassword = async (
  passwordLength: number,
  wordList: string[],
  randomizeCase: boolean = true
) => {
  let password = "";
  const maxAttempts = 100; // Define a maximum number of attempts
  let attempts = 0;

  while (password.length < passwordLength && attempts < maxAttempts) {
    let word = sample(wordList);
    if (word && randomizeCase) {
      word = randomizeWordCase(word);
    }
    attempts++;
    console.log(password, password.length);
    if (word && password.length + word.length <= passwordLength) {
      password += word;
    }
  }

  if (password.length < passwordLength) {
    password = insertFriendlyCharacters(
      password,
      passwordLength - password.length
    );
    console.warn(
      "Failed to generate a friendly password of the desired length"
    );
    return password;
  }

  return password;
};

// Helper function to randomly transform characters to upper or lower case
function randomizeWordCase(word: string): string {
  return word
    .split("")
    .map((char) =>
      Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()
    )
    .join("");
}

const insertSpecialCharacters = (str: string, count: number): string => {
  for (let i = 0; i < count; i++) {
    const index = random(0, str.length);
    const char = sample(specialCharacters) as string;
    str = str.slice(0, index) + char + str.slice(index);
  }
  return str;
};

const insertFriendlyCharacters = (str: string, count: number): string => {
  for (let i = 0; i < count; i++) {
    const index = random(0, str.length);
    const char = sample(friendlyCharacters) as string;
    str = str.slice(0, index) + char + str.slice(index);
  }
  return str;
};
