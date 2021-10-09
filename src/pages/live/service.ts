import { useCallback } from 'react';
import { Service } from 'slox';
import type { TLiveBaseDataState } from './interface';
import { LiveChecker } from '@components/common';

@Service()
export class LiveService extends LiveChecker.Service {
  public comprehensiveDataTrendAnalysis(id: number) {
    return this.useGet<TLiveBaseDataState[]>({
      url: `/live/monitor/${id}/count`,
      default: [],
    });
  }

  public dimensionDetailedDataAnalysis(id: number) {
    const [invoke, ...params] = this.useGet({
      url: `/live/monitor/${id}/timeline`,
      default: [] as { time: string, cnt: number }[],
    });
    const get = useCallback((type: number) => {
      invoke({
        params: {
          type: type + ''
        }
      })
    }, [invoke]);
    return [get, ...params] as const;
  }

  public heat(id: number) {
    return this.useGet<{ name: string, value: number, avatar: string }[]>({
      url: `/live/monitor/${id}/contribute`,
      default: []
    });
  }
}