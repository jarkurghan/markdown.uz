"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

import Editor from "./editor";
import { Edit3, Eye } from "lucide-react";
import Preview from "./preview";

const INITIAL_MARKDOWN = `# Markdown muharriri

Realtime onlayn Markdown muharririga xush kelibsiz.

> 📱 Moslashuvchan dizayn
> 🌙 Kunduzgi va tungi rejim
> ✨ Real vaqt rejimidagi ko‘rib chiqish
> 💾 Avtomatik saqlash funksiyasi
> 🎨 Formatlash vositalari

## Boshlash

Markdown matningizni tahrir oynasiga yozishni boshlang. Natija real vaqt rejimida yangilanadi!

**Maroqli yozish!** 🚀

---
[GitHub sahifasiga o‘tish](https://github.com/jarkurghan/markdown)

`;

const EditorContent: React.FC = () => {
    const [markdown, setMarkdown] = useState(INITIAL_MARKDOWN);
    const [splitRatio, setSplitRatio] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
    const editorRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem("markedit-content");
        if (saved) setMarkdown(saved);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem("markedit-content", markdown);
        }, 500);
        return () => clearTimeout(timer);
    }, [markdown]);

    const insertMarkdown = useCallback(
        (before: string, after: string = "") => {
            const editor = editorRef.current;
            if (!editor) return;

            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const selectedText = markdown.substring(start, end);
            const newText = before + selectedText + after;
            const newMarkdown = markdown.substring(0, start) + newText + markdown.substring(end);
            setMarkdown(newMarkdown);

            setTimeout(() => {
                editor.focus();
                editor.setSelectionRange(start + before.length, start + before.length + selectedText.length);
            }, 0);
        },
        [markdown]
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case "b":
                        e.preventDefault();
                        insertMarkdown("**", "**");
                        break;
                    case "i":
                        e.preventDefault();
                        insertMarkdown("*", "*");
                        break;
                    case "k":
                        e.preventDefault();
                        insertMarkdown("[", "](url)");
                        break;
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [insertMarkdown]);

    const downloadMarkdown = () => {
        const blob = new Blob([markdown], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "document.md";
        a.click();
        URL.revokeObjectURL(url);
    };

    const uploadFile = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".md,.txt";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target?.result as string;
                    setMarkdown(content);
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    React.useEffect(() => {
        (window as any).editorActions = {
            insertMarkdown,
            downloadMarkdown,
            uploadFile,
        };
    }, [insertMarkdown]);

    return (
        <div className={`flex flex-col h-full border-t bor-col-1`}>
            <div className={`md:hidden flex border-b shrink-0 bg-color-1 bor-col-1`}>
                <button
                    onClick={() => setActiveTab("editor")}
                    className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium transition-all duration-200 ${
                        activeTab === "editor" ? "bg-color-5 special-2" : "text-gray-2 text-gray-10"
                    }`}
                >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Tahrir
                </button>
                <button
                    onClick={() => setActiveTab("preview")}
                    className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium transition-all duration-200 ${
                        activeTab === "preview" ? "bg-color-5 special-2" : "text-gray-2 text-gray-10"
                    }`}
                >
                    <Eye className="w-4 h-4 mr-2" /> Ko‘rinish
                </button>
            </div>
            <div className="md:hidden flex-1 min-h-0 overflow-hidden">
                <div className="h-full">
                    {activeTab === "editor" ? <Editor ref={editorRef} value={markdown} onChange={setMarkdown} /> : <Preview markdown={markdown} />}
                </div>
            </div>
            <div className="hidden md:flex flex-1 min-h-0">
                <div className="flex-1 flex min-w-0" style={{ flexBasis: `${splitRatio}%` }}>
                    <Editor ref={editorRef} value={markdown} onChange={setMarkdown} />
                </div>
                {/* Resize handle */}
                <div
                    className={`w-1 bg-linear-to-b from-blue-500 to-purple-500 cursor-col-resize hover:w-2 transition-all duration-200 shrink-0 ${
                        isResizing ? "w-2" : ""
                    }`}
                    onMouseDown={(e) => {
                        setIsResizing(true);
                        const startX = e.clientX;
                        const startRatio = splitRatio;
                        const handleMouseMove = (e: MouseEvent) => {
                            const diff = e.clientX - startX;
                            const containerWidth = window.innerWidth;
                            const newRatio = Math.max(20, Math.min(80, startRatio + (diff / containerWidth) * 100));
                            setSplitRatio(newRatio);
                        };
                        const handleMouseUp = () => {
                            setIsResizing(false);
                            document.removeEventListener("mousemove", handleMouseMove);
                            document.removeEventListener("mouseup", handleMouseUp);
                        };
                        document.addEventListener("mousemove", handleMouseMove);
                        document.addEventListener("mouseup", handleMouseUp);
                    }}
                />
                <div className="flex-1 min-w-0" style={{ flexBasis: `${100 - splitRatio}%` }}>
                    <Preview markdown={markdown} />
                </div>
            </div>
        </div>
    );
};

export default EditorContent;
