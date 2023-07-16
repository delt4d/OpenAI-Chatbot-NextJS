"use client"

import { MessagesProvider } from "@/contexts/messages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";

interface ProvidersProps {
    children: ReactNode
}

const Providers: FC<ProvidersProps> = (props) => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <MessagesProvider>
                {props.children}
            </MessagesProvider>
        </QueryClientProvider>
    )
}

export default Providers;
