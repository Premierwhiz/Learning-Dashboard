
import './globals.css';

export const metadata = {
  title: 'Nexus OS Dashboard',
  description: 'AI Engineer Learning Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-slate-200 font-sans selection:bg-purple-500/30">
        {children}
      </body>
    </html>
  );
}
