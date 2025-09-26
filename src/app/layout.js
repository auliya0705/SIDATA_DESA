import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar.js";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // pilih variasi weight
});

export const metadata = {
  title: "SIDATA DESA",
  description: "Website Desa Banyubiru",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={poppins.className}>
        <Navbar/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
