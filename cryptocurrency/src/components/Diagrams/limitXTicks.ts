export const limitXTicks = <T>(data: T[], maxTicks: number, key: keyof T): T[] => {
    if (data.length <= maxTicks) return data;

    const step = Math.ceil(data.length / maxTicks);
    return data.filter((_, i) => i % step === 0);
};