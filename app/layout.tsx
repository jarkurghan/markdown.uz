import { connection } from "next/server";
import { ThemeProvider } from "@/contexts/theme-context";
import { Tashrif } from "tashrif/react";
import "./globals.css";

// Layout must run at request time so Docker/Coolify runtime env is visible.
export const dynamic = "force-dynamic";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await connection();

    const tashrifClientId =
        process.env.TASHRIF_CLIENT_ID || process.env.NEXT_PUBLIC_TASHRIF_CLIENT_ID;

    console.log("tashrifClientId",tashrifClientId);

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
