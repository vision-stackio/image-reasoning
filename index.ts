import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * Analyze an image from a specific folder
 */
async function analyzeImageFromFolder(
  folderPath: string,
  fileName: string,
  question: string = "Describe this image in detail."
) {
  const imagePath = path.join(folderPath, fileName);

  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image not found: ${imagePath}`);
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");

  const ext = path.extname(fileName).toLowerCase();
  let mimeType = "image/jpeg";

  if (ext === ".png") mimeType = "image/png";
  else if (ext === ".webp") mimeType = "image/webp";
  else if (ext === ".gif") mimeType = "image/gif";

  const dataUrl = `data:${mimeType};base64,${base64Image}`;

  console.log(`Sending image: ${fileName}...`);

  const response = await client.chat.completions.create({
    model: "openrouter/free", // Auto picks free vision model
    // model: "google/gemma-4-31b-it:free", // alternative
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: question,
          },
          {
            type: "image_url",
            image_url: {
              url: dataUrl,
            },
          },
        ],
      },
    ],
    max_tokens: 1024,
  });

  return response.choices[0].message.content;
}

async function main() {
  try {
    const FOLDER_PATH = "./images";
    const IMAGE_NAME = "photo.png"; 
    const QUESTION = "What is in this image? Describe it in detail.";

    const result = await analyzeImageFromFolder(
      FOLDER_PATH,
      IMAGE_NAME,
      QUESTION
    );

    console.log("\n===== AI Response =====");
    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();