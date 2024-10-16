import { type ChatCompletion } from '../prompt'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const MODEL_NAME = "gpt-4o"

export const gpt = async (input: string): Promise<ChatCompletion> => {
    const response = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: MODEL_NAME,
            messages: [{
                role: "user",
                content: input
            }]
        }),
    })

    const data = await response.json() as ChatCompletion
    return data
}
