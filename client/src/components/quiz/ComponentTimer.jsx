import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function ComponentTimer({ timeout, onTimeOut }) {
  const [remainingTime, setRemainingTime] = useState(timeout);

  useEffect(() => {
    const timer = setTimeout(onTimeOut, timeout);
    return () => {
      clearInterval(timer);
    };
  }, [timeout, onTimeOut]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => prev - 100);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <progress id="question-time" max={timeout} value={remainingTime} />;
}
