"use client"

import { useMessagesContext } from "@/contexts/messages";
import { cn } from "@/lib/utils";
import { FC, HTMLAttributes } from "react";
import MarkdownLite from "./MarkdownLite";
import { Message } from "@/lib/validators/message";
import Scrollable from "./Scrollable";

interface ChatMessagesProps extends HTMLAttributes<HTMLDivElement> { }

const ChatMessages: FC<ChatMessagesProps> = ({ className, ...props }) => {
    const { messages } = useMessagesContext();
    const inverseMessages = [...messages].reverse();

    const renderMessage = (message: Message) => {
        return (
            <div key={message.id}>
                <div className={cn('flex items-end', { 'justify-end': message.isUserMessage })}>
                    <div className={cn(`flex flex-col space-y-2 text-sm max-w-xs mx-2 my-2 rounded`, { 'bg-blue-600 text-white': message.isUserMessage, 'bg-gray-200 text-gray-900': !message.isUserMessage })}>
                        <div className="px-3 py-2 relative">
                            {message.isUserMessage && <span className="absolute w-2 h-2 bg-blue-600 top-0 -right-1 clip-pilygon-triangle rounded-[10%]"></span>}
                            <MarkdownLite text={message.text} className="overflow-x-hidden" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Scrollable {...props} scrollX='hidden' scrollY="auto" className={cn('flex flex-col-reverse gap-3 select-none scrollbar-thin active:cursor-pointer', className)}>
            <div className="flex flex-col-reverse flex-1 flex-grow">
                {inverseMessages.map(renderMessage)}
            </div>
        </Scrollable>
    )
}

export default ChatMessages;
