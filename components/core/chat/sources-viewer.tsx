'use client'

import { FileText } from 'lucide-react'
import React from 'react'
import Markdown from "react-markdown";

import { RetrievalDocument } from "@/ai/ragContext";
import { useIsMobile } from '@/components/shared/hooks/use-mobile';
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
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
  const isMobile = useIsMobile();

  if (sources.length === 0) {
    return null;
  }

  // The content to display in both popover and drawer
  const SourcesContent = () => (
    <ScrollArea className="w-full h-[400px] max-h-[60vh] md:h-[400px] sm:h-[300px] rounded-md border border-slate-200 p-4">
      {sources.map(function (source) {
        return (
          <div
            key={source.metadata.rerank_score}
            className="mb-4 last:mb-0 pb-4 last:pb-0 border-b last:border-b-0 border-slate-200"
          >
            {source.source && source.username && (
              <Markdown className="text-sm max-w-96 break-normal prose-xs">
                {'***' + source.source + ', from: ' + source.username + '***'}
              </Markdown>
            )}
            <Markdown className="text-sm max-w-96 break-normal prose-xs">
              {source.content}
            </Markdown>
            {source.link && (
              <a
                href={source.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:text-blue-600 hover:underline mt-2 inline-block"
              >
                Go to Source
              </a>
            )}
            {source.timestamp !== undefined && source.timestamp !== 0 && (
              <Markdown className="text-sm max-w-96 break-normal prose-xs">
                {'Date and time: ' + new Date(source.timestamp).toLocaleString()}
              </Markdown>
            )}
          </div>
        );
      })}
    </ScrollArea>
  );

  // The trigger button for both popover and drawer
  const TriggerButton = (
    <Button
      variant="outline"
      className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
    >
      <FileText />
    </Button>
  );

  // Use Drawer for mobile and Popover for desktop
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          {TriggerButton}
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md px-4">
            <DrawerHeader>
              <DrawerTitle>Sources</DrawerTitle>
            </DrawerHeader>
            <SourcesContent />
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop view with Popover
  return (
    <Popover>
      <PopoverTrigger asChild>
        {TriggerButton}
      </PopoverTrigger>
      <PopoverContent
        className="w-auto max-w-1/3 md:w-auto md:max-w-1/3"
        side="right"
        align="start"
        sideOffset={5}
      >
        <h3 className="text-lg font-semibold mb-3">Sources</h3>
        <SourcesContent />
      </PopoverContent>
    </Popover>
  );
}
