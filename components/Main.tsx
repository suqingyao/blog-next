import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div className="h-full pt-[var(--header-height)]">
        <main className="min-h-[calc(100%-var(--header-height))]">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Main;
