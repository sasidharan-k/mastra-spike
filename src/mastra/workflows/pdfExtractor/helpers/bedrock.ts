import { generateObject } from 'ai';
//import { bedrock } from '@ai-sdk/amazon-bedrock';
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { z } from 'zod';

/**
 * Generates structured output using Claude 3.7 Sonnet on Amazon Bedrock.
 *
 * @param prompt - The prompt instructing the model what to generate.
 * @param schema - A Zod schema defining the desired structure of the output.
 * @param fileBuffer - (Optional) The file data as a Buffer.
 * @param fileMimeType - (Optional) The file's MIME type (e.g. "application/pdf").
 * @param additionalOptions - (Optional) Additional model parameters (e.g. temperature, top_p, max_tokens).
 * @returns The generated output conforming to the provided schema.
 */
export async function generateStructuredOutput<T>(
  prompt: string,
  schema: z.ZodSchema<T>,
  fileBuffer?: Buffer,
  fileMimeType?: string,
  additionalOptions?: Partial<{
    temperature: number;
    top_p: number;
    max_tokens: number;
  }>
): Promise<T> {
  try {
    

    const bedrock = createAmazonBedrock({
      region: 'us-west-2',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID
    });
    // Build the message content: always include the text prompt.
    const content: any = [{ type: 'text', text: prompt }];
    // If a file is provided, add it as a file block.
    if (fileBuffer && fileMimeType) {
      content.push({ type: 'file', data: fileBuffer, mimeType: fileMimeType });
    }
    const result = await generateObject<T>({
      model: bedrock('us.anthropic.claude-3-7-sonnet-20250219-v1:0'),
      schema,
      // Provide a messages array to include both text and file inputs.
      messages: [
        {
          role: 'user',
          content,
        }
      ],
      // Spread additional model parameters if provided.
      ...additionalOptions,
    });
    return result.object;
  } catch (error) {
    console.error('Error generating structured output:', error);
    throw error;
  }
}
