const delayRun = (callback: () => void, ms: number = 200): void => {
  const timer = setTimeout(() => {
    callback();
    clearTimeout(timer);
  }, ms);
};

export default delayRun;
