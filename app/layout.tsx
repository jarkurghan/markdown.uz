import { connection } from "next/server";
import { ThemeProvider } from "@/contexts/theme-context";
import { Tashrif } from "tashrif/react";
import "./globals.css";

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    await connection();
    const tashrifClientId = process.env.NEXT_PUBLIC_TASHRIF_CLIENT_ID;

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
