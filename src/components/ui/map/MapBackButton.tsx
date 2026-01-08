import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { GlassButton } from '@/components/ui/button';

export function MapBackButton() {
  const router = useRouter();

  const handleBack = () => {
    startTransition(() => {
      router.push('/');
    });
  };

  return (
    <GlassButton
      className="absolute top-4 left-4 z-50"
      onClick={handleBack}
      title="返回相册"
    >
      <i className="i-mingcute-arrow-left-line text-base text-white" />
    </GlassButton>
  );
}
