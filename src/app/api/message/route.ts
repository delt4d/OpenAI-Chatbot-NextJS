import { chatbotPrompt } from '@/helpers/constants/chatbot-prompt';
import openai from '@/infra/openai';
import { ChatGPTMessage, OpenAIStreamPayload } from '@/lib/openai-stream';
import { MessageArraySchema } from '@/lib/validators/message';

export async function POST(req: Request) {
    const { messages: rawMessages } = await req.json();
    const messages = MessageArraySchema.parse(rawMessages);

    const outBoundMessages: ChatGPTMessage[] = messages.map((m) => {
        return {
            role: m.isUserMessage ? 'user' : 'system',
            content: m.text,
        };
    });

    outBoundMessages.unshift({
        role: 'system',
        content: chatbotPrompt,
    });

    const payload: OpenAIStreamPayload = {
        model: 'gpt-3.5-turbo', // 'gpt-4'
        messages: outBoundMessages,
        temperature: 0.4,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '0'),
        stream: true,
        n: 1,
    };

    const stream = await openai.stream(payload);

    return new Response(stream);
}
