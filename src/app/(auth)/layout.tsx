import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Portal Login',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
