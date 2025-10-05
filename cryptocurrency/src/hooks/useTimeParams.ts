import { AveragePeriod, TimePeriod } from '@/types';
import { useMemo } from 'react';

export const useTimeParams = (period: AveragePeriod) => {
    return useMemo(() => {
        const now = new Date();
        const timeEnd = now.toISOString().split('.')[0] + '.000Z';
        let timeStart: string;
        let interval: TimePeriod = '5m';
        let limit = 80;

        switch (period) {
            case '1d':
                timeStart = new Date(now.setDate(now.getDate() - 1)).toISOString().split('.')[0] + '.000Z';
                interval = '15m';
                limit = 80;
                break;
            case '1m':
                timeStart = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('.')[0] + '.000Z';
                interval = '6h';
                limit = 100;
                break;
            case '3m':
                timeStart = new Date(now.setMonth(now.getMonth() - 3)).toISOString().split('.')[0] + '.000Z';
                interval = '24h';
                limit = 90;
                break;
            case '1y':
                timeStart = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('.')[0] + '.000Z';
                interval = '1d';
                limit = 365;
                break;
            default:
                timeStart = new Date(now.setDate(now.getDate() - 1)).toISOString().split('.')[0] + '.000Z';
                interval = '15m';
                limit = 80;
        }

        return { timeStart, timeEnd, interval, limit };
    }, [period]);
};