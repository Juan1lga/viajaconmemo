import React, { useEffect, useRef, useState } from "react";

const TypewriterTitle = ({ text = "", speed = 150 }) => {
  const [shown, setShown] = useState("");
  const idxRef = useRef(0);

  useEffect(() => {
    setShown("");
    idxRef.current = 0;
    const interval = setInterval(() => {
      if (idxRef.current >= text.length) {
        clearInterval(interval);
        return;
      }
      setShown((prev) => prev + text.charAt(idxRef.current));
      idxRef.current += 1;
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className="typewriter">
      <span className="typewriter-text">{shown}</span>
      <span className="typewriter-caret" aria-hidden="true"></span>
    </span>
  );
};

export default TypewriterTitle;