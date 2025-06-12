// components/Layout.tsx
import Header from '../components/Header/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="max-w-4xl p-4 mx-auto">{children}</main>
    </>
  );
}
