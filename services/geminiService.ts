
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function convertCsvToJson(csvData: string): Promise<string> {
  const prompt = `
    Task: Convert the provided CSV data from a social media report into a valid JSON array of objects.

    Instructions:
    - The first row of the CSV contains the headers. Use these headers as the keys for the JSON objects.
    - Each subsequent row in the CSV should be converted into a distinct JSON object within the array.
    - Analyze the values in each column and automatically infer the correct data type (e.g., convert "123" to the number 123, "true" to the boolean true, etc.). Do not leave numbers or booleans as strings in the JSON output.
    - The final output must be a single, valid JSON array of objects. Do not wrap it in Markdown code blocks or any other explanatory text.

    Here is the CSV data:
    ---
    ${csvData}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while calling the Gemini API.");
  }
}
