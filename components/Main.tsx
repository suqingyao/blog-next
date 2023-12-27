import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div className="h-full pt-[60px]">
        <main className="min-h-[calc(100%-60px)]">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Main;
