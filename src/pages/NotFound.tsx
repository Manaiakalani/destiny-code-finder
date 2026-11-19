import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';
import { useCodeScanner } from '@/hooks/useCodeScanner';

const NotFound = () => {
  const { codes, addManualCode } = useCodeScanner();
  const activeCount = codes.filter((code) => code.status === 'active').length;

  return (
    <div className="flex min-h-screen flex-col">
      <Header onAddCode={addManualCode} activeCount={activeCount} totalCount={codes.length} />
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="font-heading text-5xl font-bold text-foreground title-shadow">404</h1>
        <p className="mb-6 mt-4 text-xl text-muted-foreground">That page is not in the vault.</p>
        <Link to="/" className="text-accent underline decoration-accent/40 underline-offset-4 hover:text-accent/80">
          Return to the catalogue
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
};

export default NotFound;
