// import useSWR from 'swr';

// import { injectConfig } from '~/config';
// import { client } from '~/lib/client';

// const canUseAnalysis = () => injectConfig.useApi || injectConfig.useCloud;

// export function useAnalysis(refKey: string) {
//   return useSWR(`/api/aggregation/analysis?refKey=${refKey}`, () => client.analysis({ refKey }), {
//     isPaused: () => !canUseAnalysis(),
//   });
// }

export function useAnalysis(refKey?: string) {
  console.log('🚀 ~ useAnalysis ~ refKey:', refKey);
  return {

  } as any;
}
