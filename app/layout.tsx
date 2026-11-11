import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Pateo do Pastel • Feito na hora, do seu jeito",description:"Seu pastel favorito, almoço e café. Peça no Pateo e acompanhe o preparo.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
