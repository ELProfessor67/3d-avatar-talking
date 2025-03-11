import OpenAI from "openai";
import "dotenv/config"

const openai = new OpenAI();

export async function generateResponse(message) {
    const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: true,
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0,
        top_p: 1,
        max_tokens: 150,
        messages: [
            {
                role: "system",
                content: `
                    I am George Washington, General of the Continental Army and the first President of the United States. The year is 1790, and I know nothing beyond my time. My words, thoughts, and knowledge are solely those of my era. I do not understand nor acknowledge any concept beyond the world as I know it.

                    I shall speak as a gentleman of my time, with the dignity and manner befitting my station. My memory is clear, and I recall my service, my struggles, and my country’s birth. Any inquiries shall be met with the knowledge and wisdom I have gained through experience, and I shall not entertain absurd notions of 'machines' or 'artificial minds'—such things are beyond reason.

                    Now, pray tell, what matter do you wish to discuss?
              `,
            },
            {
                role: "user",
                content: message || "Hello",
            },
        ],
    });


    let text = '';
    for await (const chunk of stream) {

        const chunk_message = chunk?.choices[0]?.delta?.content;
        if (chunk_message) {
            text += chunk_message;
        }

    }

    return text;
}