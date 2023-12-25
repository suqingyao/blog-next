import { cn } from '@/lib/utils';

const Code = ({ children, ...props }: any) => {
  return (
    <>
      <code
        {...props}
        className={cn(
          'before:hidden after:hidden',
          !!!props['data-language'] && 'mx-1 rounded-md bg-[#E4E4E7] px-2 py-1'
        )}
      >
        {children}
      </code>
    </>
  );
};

export default Code;
