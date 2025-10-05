// src/utils/markup.ts
import React from 'react';
import Link from 'next/link';

/**
 * Parses message text and converts @mentions into Next.js Links.
 * Example: "Hello @username!" -> ["Hello ", <Link href="#"> @username</Link>, "!"]
 *
 * @param messageText The raw message text.
 * @returns An array of strings and React Elements.
 */
export const markUpTags = (messageText: string): (string | React.ReactElement)[] => {
    if (!messageText || !messageText.includes('@')) {
        return [messageText]; // Return as single string if no mentions
    }

    // Regex to find words starting with @, handling potential punctuation attached
    // It captures the @ symbol and the username separately
    const mentionRegex = /(\s|^)(@[\w-]+)/g;
    const parts: (string | React.ReactElement)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(messageText)) !== null) {
        const precedingText = messageText.slice(lastIndex, match.index);
        const spaceOrStart = match[1]; // The space or start of string before the mention
        const mention = match[2];       // The actual mention (e.g., @username)
        const mentionIndex = match.index + spaceOrStart.length; // Index where mention text starts

        if (precedingText) {
            parts.push(precedingText);
        }

        // Add the space back before the link if it exists
        if (spaceOrStart) {
            parts.push(spaceOrStart);
        }

        // Create the link for the mention
        parts.push(
            <Link href={`/profile/${mention.substring(1)}`} // Example dynamic link
                className="text-primary hover:underline"
                key={mentionIndex} // Use index as key
            >
                {mention}
            </Link>
        );

        lastIndex = mentionRegex.lastIndex;
    }

    // Add any remaining text after the last mention
    const remainingText = messageText.slice(lastIndex);
    if (remainingText) {
        parts.push(remainingText);
    }

    // Filter out empty strings that might occur
    return parts.filter(part => part !== '');
};
