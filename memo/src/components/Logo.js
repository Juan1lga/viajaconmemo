import React, { useState } from "react";

const Logo = ({ size = "md", showText = false, imgClass = "" }) => {
  const defaultLogo = "/memo-logo.jfif?v=2";
  const backupLogo = "/logo192.png";
  const [src, setSrc] = useState(defaultLogo);
  const cls = `brand-logo ${size}`;
  return (
    <div className={cls} aria-label="Viaja con Memo logo">
      <div className="logo-wrapper">
        <img src={src} alt="Viaja con Memo" className={`site-logo ${imgClass}`} onError={() => { if (src !== backupLogo) setSrc(backupLogo); }} />
      </div>
      {showText && <span className="brand-text">Viaja con Memo</span>}
    </div>
  );
};

export default Logo;