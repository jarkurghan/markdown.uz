import { ThemeProvider } from "@/contexts/theme-context";
import { Tashrif } from "tashrif/react";
import "./globals.css";

/** Runtime env — bracket access so Next does not inline empty at build. */
const tashrifClientId =
    process.env["TASHRIF_CLIENT_ID"] || process.env["NEXT_PUBLIC_TASHRIF_CLIENT_ID"];

console.log("tashrifClientId",tashrifClientId);

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-gray-900 text-white">
                <ThemeProvider>
                    <Tashrif clientId={tashrifClientId} />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
