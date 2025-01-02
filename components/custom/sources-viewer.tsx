'use client'

import { FileText } from 'lucide-react'
import React from 'react'
import Markdown from "react-markdown";

import { RetrievalDocument} from "@/ai/ragContext";
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"



export interface DocumentViewerProps {
    sources: RetrievalDocument[]
}

export function SourcesViewer({ sources }: DocumentViewerProps) {
    return (
      sources.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
            >
              <FileText />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto max-w-1/3 md:w-auto md:max-w-1/3 sm:w-[90vw] sm:max-w-[90vw]"
            side="right"
            align="start"
            sideOffset={5}
          >
            <h3 className="text-lg font-semibold mb-3 ">Sources</h3>
            <ScrollArea className="w-full h-[400px] max-h-[60vh] md:h-[400px] sm:h-[300px] rounded-md border border-slate-200 p-4">
              {sources.map(function (source) {
                return (
                  <div
                    key={source.metadata.rerank_score}
                    className="mb-4 last:mb-0 pb-4 last:pb-0 border-b last:border-b-0 border-slate-200"
                  >
                    <Markdown className="text-sm max-w-96 break-normal prose-xs">
                      {source.content}
                    </Markdown>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:text-blue-600 hover:underline mt-2 inline-block"
                      >
                        Go to Source
                      </a>
                    )}
                    {source.source && (<Markdown className="text-sm max-w-96 break-normal prose-xs">{'***' + 'from source: ' + source.source + '***'}</Markdown>)}
                  </div>
                );
              })}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      )
    );
}

