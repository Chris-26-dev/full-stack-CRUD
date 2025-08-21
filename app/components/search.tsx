

import React, { ReactNode, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import {
  Search,
  Book,
  Layers,
  Grid3x3,
  BarChart3,
  Palette,
  Heart,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NavigationItem {
  id: string;
  label: string;
  node?: ReactNode;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

interface DocsSearchDialogProps {
  trigger?: React.ReactNode;
  sections?: NavigationSection[];
  noItemFoundText?: string;
  // onItemClick?: (item: NavigationItem) => void;
  placeholder?: string;
  className?: string;
  footerOptions?: {
    isVisible?: boolean;
    footerNode?: ReactNode;
    className?: string;
  };
}

const defaultSections: NavigationSection[] = [
  {
    title: "All Docs",
    items: [
      {
        id: "docs",
        label: "Docs",
        node: (
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-accent hover:text-accent-foreground rounded-md transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30">
              <Book className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Docs</div>
              <div className="text-xs text-muted-foreground">
                Documentation and guides
              </div>
            </div>
          </button>
        ),
      },
      {
        id: "components",
        label: "Components",
        node: (
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-accent hover:text-accent-foreground rounded-md transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-green-100 dark:bg-green-900/30">
              <Layers className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Components</div>
              <div className="text-xs text-muted-foreground">
                Reusable UI components
              </div>
            </div>
          </button>
        ),
      },
      {
        id: "blocks",
        label: "Blocks",
        node: (
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-accent hover:text-accent-foreground rounded-md transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-purple-100 dark:bg-purple-900/30">
              <Grid3x3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Blocks</div>
              <div className="text-xs text-muted-foreground">
                Pre-built page sections
              </div>
            </div>
          </button>
        ),
      },
      {
        id: "charts",
        label: "Charts",
        node: (
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-accent hover:text-accent-foreground rounded-md transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-orange-100 dark:bg-orange-900/30">
              <BarChart3 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Charts</div>
              <div className="text-xs text-muted-foreground">
                Data visualization components
              </div>
            </div>
          </button>
        ),
      },
      {
        id: "themes",
        label: "Themes",
        node: (
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-accent hover:text-accent-foreground rounded-md transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-pink-100 dark:bg-pink-900/30">
              <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Themes</div>
              <div className="text-xs text-muted-foreground">
                Styling and appearance
              </div>
            </div>
          </button>
        ),
      },
      {
        id: "colors",
        label: "Colors",
        node: (
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-accent hover:text-accent-foreground rounded-md transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-indigo-100 dark:bg-indigo-900/30">
              <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Colors</div>
              <div className="text-xs text-muted-foreground">
                Color palette and tokens
              </div>
            </div>
          </button>
        ),
      },
    ],
  },
  {
    title: "Get Started",
    items: [
      {
        id: "introduction",
        label: "Introduction",
        node: (
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-accent hover:text-accent-foreground rounded-md transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
              <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Introduction</div>
              <div className="text-xs text-muted-foreground">
                Getting started guide
              </div>
            </div>
          </button>
        ),
      },
    ],
  },
];

export default function DocsSearchDialog({
  trigger,
  sections = defaultSections,
  placeholder = "Search documentation...",
  className = "",
  noItemFoundText,
  footerOptions,
}: DocsSearchDialogProps) {
  const [open, setOpen] = useState(false); // Fixed: Changed from true to false
  const [searchQuery, setSearchQuery] = useState("");
  const {
    className: footerClassName = "",
    footerNode,
    isVisible: isFooterVisible = true,
  } = footerOptions || {};

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  const defaultTrigger = (
    <Button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-background border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
      <Search className="w-4 h-4" />
      <span>Search documentation...</span>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );

  const defaultFooterNode = (
    <div className="px-3 pt-1">
      <div className="w-full flex items-center gap-3 text-[12px] px-2 py-2 text-left cursor-pointer">
        <Button variant={"outline"} className="text-[11px] size-8">
          Esc
        </Button>
        <span>Go back</span>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent
        className={`w-1/2 max-lg:w-full h-[480px] p-0 overflow-hidden gap-0 ${className}`}
      >
        <VisuallyHidden>
          <DialogTitle>Search Documentation</DialogTitle>
        </VisuallyHidden>
        <div className="border-b border-border h-16 bg-neutral-100 dark:bg-neutral-800 p-2">
          <div className="flex items-center px-3 py-3">
            <Search className="w-4 h-4 text-muted-foreground mr-3" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              autoFocus
            />
          </div>
        </div>

        <div className="h-[330px]  pt-5  overflow-y-auto border-none p-2">
          {filteredSections.length > 0 ? (
            <>
              {filteredSections.map((section) => (
                <div key={section.title}>
                  <div className="px-3">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                  <div className="px-1 pt-1 pb-2 flex flex-col w-full space-y-1">
                    {section.items.map((item) => (
                      <div onClick={() => setOpen(false)} key={item.id}>
                        {item.node}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="px-3 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {noItemFoundText || "No results found."}
              </p>
            </div>
          )}
        </div>
        {/* footer */}
        {isFooterVisible && (
          <div
            className={`border-t bg-neutral-100 dark:bg-neutral-800 border-border ${footerClassName}`}
          >
            {footerNode ? <>{footerNode}</> : <>{defaultFooterNode}</>}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


