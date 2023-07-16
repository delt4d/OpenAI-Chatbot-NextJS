import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { FC, HTMLAttributes, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Message } from "@/lib/validators/message";
import { v4 as uuid } from "uuid";
import { useMessagesContext } from "@/contexts/messages";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> { }

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
    const [inputText, setInputText] = useState<string>("");
    const { messages, addMessage, removeMessage, updateMessage, setIsMessageUpdating, isMessageUpdating } = useMessagesContext();

    const textareaRef = useRef<null | HTMLTextAreaElement>(null);

    const { mutate: sendMessage, isLoading } = useMutation({
        async mutationFn(message: Message) {
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ messages: [message] })
            });

            return response.body;
        },
        async onMutate(message) {
            addMessage(message);
        },
        async onSuccess(stream) {
            if (!stream) throw new Error('No stream found');

            setInputText("");

            const id = uuid();
            const responseMessage: Message = {
                id,
                isUserMessage: false,
                text: ''
            };

            addMessage(responseMessage);
            setIsMessageUpdating(true);

            const streamReader = stream.getReader();
            const textDecoder = new TextDecoder();

            let done = false;

            while (!done) {
                const { value, done: doneReading } = await streamReader.read();
                done = doneReading;
                const chunkValue = textDecoder.decode(value);
                updateMessage(id, (previousValue) => previousValue + chunkValue);
            }

            setIsMessageUpdating(false);
            setTimeout(() => textareaRef.current?.focus(), 10);
        }
    });

    return (<div {...props} className={cn('border-t border-zinc-300', className)}>
        <div className="relative mt-4 flex-1 overflow-hidden rounded-lg">
            <TextareaAutosize
                ref={textareaRef}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();

                        const message = {
                            id: uuid(),
                            isUserMessage: true,
                            text: inputText,
                        }

                        sendMessage(message)
                    }
                }}
                disabled={isLoading || isMessageUpdating}
                rows={2}
                maxRows={6}
                autoFocus
                placeholder="Write a message..."
                className="
                    peer
                    disabled:opacity-50
                    pr-14
                    block
                    w-full
                    bg-zing-100
                    py-1.5
                  bg-gray-100
                  text-gray-900
                    focus:ring-0
                    text-sm 
                    sm:leading-6" />
        </div>
    </div>)
}

export default ChatInput;
