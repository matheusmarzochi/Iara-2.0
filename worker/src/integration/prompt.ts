import { db } from '../../../app/src/database';
import { gptMessages } from '../../../app/src/database/schema/gpt';

import { ollama } from './providers/ollama'
import { gpt } from './providers/gpt'

const isOpenAI = process.env.LLM_PROVIDER === "openai"

export type ChatCompletion = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: string;
            content: string;
        };
        logprobs: null | any;
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    system_fingerprint: string;
}

export const promptRequest = async (input: string, model_type: string, model_id: string): Promise<string> => {
    let data: ChatCompletion | undefined
    let attempt = 1

    for (attempt = 1; attempt <= 3; attempt++) {
        try {
            data = isOpenAI
                ? await gpt(input)
                : await ollama(input)

        } catch (error) {
            if (error instanceof TypeError) {
                console.error(`${isOpenAI ? "OpenAI" : "Ollama" }: Attempt ${attempt} failed: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    if (!data) {
        return ""
    }

    await db.insert(gptMessages).values({
        completion_tokens: data.usage.completion_tokens,
        model_id,
        model_name: data.model,
        model_type,
        output: data.choices[0].message.content,
        prompt_tokens: data.usage.prompt_tokens,
        prompt: input,
        total_tokens: data.usage.total_tokens,
    })

    return data.choices[0].message.content
}

export const stringToJson = (text: string): { hasJson: boolean, object: any } => {
    // Check if the input is a string
    if (typeof text !== 'string') {
        throw new Error('Input must be a string.');
    }

    const scapedString = text.replace(/\n/g, ' ');

    // Regular expression to find JSON objects and arrays
    const jsonRegex = /(\{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*\})|(\[(?:[^\[\]]|\[(?:[^\[\]]|\[[^\[\]]*\])*\])*\])/g;
    let match;
    let hasJson = false;
    let object = null;

    // Find and try to parse JSON
    while ((match = jsonRegex.exec(scapedString)) !== null) {
        try {
            object = JSON.parse(match[0]);
            hasJson = true;
            break; // break on the first successful parse
        } catch (e) {
            // Ignore parsing errors and continue
        }
    }

    return { hasJson, object };
}
