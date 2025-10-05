export const getAudioDuration = async (url: string): Promise<number> => {
  const audio = new Audio(url);

  return new Promise((resolve) => {
    audio.addEventListener('loadedmetadata', () => {
      const durationSeconds = audio.duration;
      resolve(durationSeconds);
    });

    audio.addEventListener('error', () => {
      resolve(0);
    });

    audio.src = url;
    audio.load();
  });
};
