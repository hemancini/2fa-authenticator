import { useEffect, useState } from "react";

interface CounterProps {
  period?: number;
}

/**
 * @deprecated since version 1.3.0
 */
export default function useCounter(props?: CounterProps) {
  const period = props?.period || 30;
  const initSecond = new Date().getSeconds();
  const initCount = initSecond % period;
  const initDiscount = period - (initSecond % period);
  const initProgress = 100 - (initCount * 100) / period;

  const [count, setCount] = useState<number>(initCount);
  const [discount, setDiscount] = useState<number>(initDiscount);
  const [progress, setProgress] = useState<number>(initProgress);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
      setDiscount((prevDiscount) => prevDiscount - 1);
      setProgress((prevProgress) => (count > 0 ? prevProgress - 1 * (100 / period) : 100));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (discount === 0) {
      setCount(initCount);
      setDiscount(initDiscount);
      setProgress(initProgress);
    }
  }, [discount]);

  return { count, discount, progress };
}
