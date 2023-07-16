import { Message } from "@/lib/validators/message";
import { useContext, createContext, ReactNode, useState } from "react";
import { v4 as uuid } from "uuid";

interface MessagesContextProps {
    messages: Message[],
    addMessage(message: Message): void;
    removeMessage(id: string): void;
    updateMessage(id: string, updateFn: (previousText: string) => string): void;
    isMessageUpdating: boolean,
    setIsMessageUpdating(isUpdating: boolean): void;
}

const MessagesContext = createContext<MessagesContextProps>({
    messages: [],
    isMessageUpdating: false,
    updateMessage() { },
    setIsMessageUpdating() { },
    addMessage() { },
    removeMessage() { }
});

interface MessagesProviderProps {
    children: ReactNode
}

export function MessagesProvider({ children }: MessagesProviderProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: uuid(),
            text: 'Hello, how can I help you?',
            isUserMessage: false
        }
    ]);
    const [isMessageUpdating, setIsMessageUpdating] = useState<boolean>(false);

    const addMessage = (message: Message) => {
        setMessages(prev => [...prev, message]);
    }

    const removeMessage = (id: string) => {
        setMessages(prev => prev.filter(m => m.id !== id));
    }

    const updateMessage = (id: string, updateFn: (previousText: string) => string) => {
        setMessages(prev =>
            prev.map(m =>
                m.id === id ? { ...m, text: updateFn(m.text) } : m
            ));
    }

    return <MessagesContext.Provider value={{
        messages,
        addMessage,
        removeMessage,
        updateMessage,
        isMessageUpdating,
        setIsMessageUpdating
    }}>{children}</MessagesContext.Provider>
}

export const useMessagesContext = () => useContext(MessagesContext);
