import { type ChatCompletion } from '../prompt'

const OLLAMA_URL = 'http://iara-ollama:11434/api/chat'
const MODEL_NAME = 'llama3.2'

export const ollama = async (input: string): Promise<ChatCompletion> => {
    const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: MODEL_NAME,
            messages: [{
                role: "user",
                content: input
            }],
            stream: false
        }),
    })

    const data = await response.json()

    const chatCompletion: ChatCompletion = {
        id: "generated-id",
        object: "chat.completion",
        created: new Date(data.created_at).getTime() / 1000,
        model: data.model,
        choices: [{
            index: 0,
            message: {
                role: data.message.role,
                content: data.message.content,
            },
            logprobs: null,
            finish_reason: data.done_reason,
        }],
        usage: {
            prompt_tokens: data.prompt_eval_count,
            completion_tokens: data.eval_count,
            total_tokens: data.prompt_eval_count + data.eval_count
        },
        system_fingerprint: "fingerprint-placeholder"
    };

    return chatCompletion
}
