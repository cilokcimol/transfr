import './globals.css';

export const metadata = {
  title: 'transfr | Send Crypto via Email',
  description: 'Send testnet ETH to anyone using just their email address. No wallet needed to receive.',
  icons: {
    icon: [
      { url: '/logo2.png', type: 'image/png' },
    ],
    shortcut: '/logo2.png',
    apple: '/logo2.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo2.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
