import { ThemeProvider } from "@/contexts/theme-context";
import { Tashrif } from "tashrif/react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-gray-900 text-white">
                <ThemeProvider>
                    <Tashrif />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
