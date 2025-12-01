import React, { useEffect, useRef, useState } from "react";

export default function TypewriterTitle({ text = "", speed = 100, loop = false }) {
  const [textShown, setTextShown] = useState("");
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Reinicia cuando cambia el texto
    indexRef.current = 0;
    setTextShown("");

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!text || speed <= 0) return;

    intervalRef.current = setInterval(() => {
      const i = indexRef.current + 1; // incrementa para mostrar desde 1 hasta text.length
      setTextShown(text.slice(0, i));
      indexRef.current = i;
      if (i >= text.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        if (loop) {
          // pequeña pausa antes de reiniciar
          setTimeout(() => {
            indexRef.current = 0;
            setTextShown("");
            intervalRef.current = setInterval(() => {
              const j = indexRef.current + 1;
              setTextShown(text.slice(0, j));
              indexRef.current = j;
              if (j >= text.length) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
            }, speed);
          }, speed * 2);
        }
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, speed, loop]);

  return <span>{textShown}</span>;
}