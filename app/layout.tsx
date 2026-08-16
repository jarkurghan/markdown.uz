import { ThemeProvider } from "@/contexts/theme-context";
import { Tashrif } from "tashrif/react";
import "./globals.css";


console.log(process.env.NEXT_PUBLIC_TASHRIF_CLIENT_ID);

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-gray-900 text-white">
                <ThemeProvider>
                    <Tashrif clientId={process.env.NEXT_PUBLIC_TASHRIF_CLIENT_ID} />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
