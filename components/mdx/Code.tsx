import { cn } from '@/lib/utils';

const Code = ({ ...props }: any) => {
  return (
    <>
      <code
        className={cn(
          'before:hidden after:hidden',
          !!!props['data-language'] &&
            'mx-1 rounded-sm bg-gray-300/20 px-2 py-1'
        )}
      >
        {props.children}
      </code>
    </>
  );
};

export default Code;
