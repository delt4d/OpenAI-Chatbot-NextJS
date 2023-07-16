"use client"

import { FC, HTMLAttributes } from "react";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownLiteProps extends HTMLAttributes<HTMLDivElement> {
    text: string
}

const MarkdownLite: FC<MarkdownLiteProps> = ({ text, className, ...props }) => {
    return (
        <Markdown
            {...props}
            remarkPlugins={[remarkGfm]}
            components={{
                img({ className, ...props }) {
                    return <img {...props} className={cn('max-h-28 max-w-full', className)} />
                },
                a({ className, ...props }) {
                    return <a {...props} target='_blank' rel='noopener noreferrer' className={cn('text-blue-900 underline', className)}></a>
                }
            }}
            className={cn(className)}>
            {text}
        </Markdown>
    )
}


export default MarkdownLite;
