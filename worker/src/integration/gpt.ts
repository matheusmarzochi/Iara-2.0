import { db } from '../database';
import { gptMessages } from '../database/schema/gpt';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const modelName = "gpt-4o"

type ChatCompletion = {
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

export const gpt = async (input: string, model_type: string, model_id: string): Promise<string> => {
    let response
    let data
    let attempt = 1

    for (attempt = 1; attempt <= 3; attempt++) {
        try {
            // Attempt to run the function and return the result if successful
            response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: modelName,
                    max_tokens: 300,
                    messages: [{
                        role: "user",
                        content: input
                    }]
                }),
            })

            if (response.status == 200) {
                data = await response.json() as ChatCompletion
                break
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(`OpenIA: Attempt ${attempt} failed: ${error.message}`);
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
