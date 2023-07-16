import { OpenAIStreamPayload } from '@/lib/openai-stream';
import { ParsedEvent, ReconnectInterval, createParser } from 'eventsource-parser';

const openAiConfiguration = {
    baseUrl: process.env.OPENAI_URL,
    apiKey: process.env.OPENAI_API_KEY,
};

async function stream(payload: OpenAIStreamPayload) {
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();

    let counter = 0;

    const res = await fetch(`${openAiConfiguration.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiConfiguration.apiKey}`,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        console.log({
            error: res.statusText,
            status: res.status,
            message: await res.text(),
        });
    }

    const readableStream = new ReadableStream({
        async start(controller) {
            const parser = createParser(onParse);

            for await (const chunk of res.body as any) {
                parser.feed(textDecoder.decode(chunk));
            }

            function onParse(ev: ParsedEvent | ReconnectInterval) {
                if (ev.type === 'event') {
                    const data = ev.data;

                    if (data === '[DONE]') {
                        controller.close();
                        return;
                    }

                    try {
                        const json = JSON.parse(data);
                        const text = json.choices[0].delta?.content || '';

                        if (counter < 2 && (text.match(/\n/) || [].length)) {
                            return;
                        }

                        const queue = textEncoder.encode(text);
                        controller.enqueue(queue);

                        ++counter;
                    } catch (error) {
                        controller.error(error);
                    }
                }
            }
        },
    });

    return readableStream;
}

export default {
    stream,
};
