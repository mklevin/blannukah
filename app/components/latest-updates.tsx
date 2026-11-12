
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Author } from "@/app/lib/types/author";

type Message = {
  text: string;
  author?: Author;
};

export default function LatestUpdates({
  messages,
}: {
  messages: Message[];
}) {
  const [index, setIndex] = useState(0);

  if (!messages.length) return null;

  return (
    <div>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {messages.map((message, i) => (
            <div
              key={i}
              className="w-full shrink-0"
              aria-hidden={i !== index}
            >

              {message.author && (
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={message.author.image}
                    alt={message.author.name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover grayscale"
                  />

                  <div className="min-w-0">
                    <p className="author text-sm font-semibold">
                      {message.author.name}
                    </p>
                    <p className="job text-xs text-gray-500">
                      {message.author.jobTitle}
                    </p>
                  </div>
                </div>
              )}

              
              <p>{message.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          onClick={() => setIndex((i) => i - 1)}
          disabled={index === 0}
          aria-label="Previous update"
          className="latest-updates-button"
        >
          <ChevronLeft
            size={16}
            className={index === 0 ? "text-gray-300" : "text-gray-700"}
          />
        </button>

        <button
          onClick={() => setIndex((i) => i + 1)}
          disabled={index === messages.length - 1}
          aria-label="Next update"
          className="latest-updates-button"
        >
          <ChevronRight
            size={16}
            className={
              index === messages.length - 1
                ? "text-gray-300"
                : "text-gray-700"
            }
          />
        </button>
      </div>
    </div>
  );
}
