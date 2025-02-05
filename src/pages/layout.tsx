import "./globals.css";

export const metadata = {
  title: "Seu Garçom",
  description: "Frontend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='bg-dark-background-default text-zinc-50 font-inter'>
        {children}
      </body>
    </html>
  );
}
