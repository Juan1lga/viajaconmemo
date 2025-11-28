import React, { useState } from "react";

const Logo = ({ size = "md", showText = false, imgClass = "" }) => {
    const defaultLogo = "/memo-logo.jfif";
    const backupLogo = "/logo192.png";
    const publicLogo = process.env.REACT_APP_LOGO_URL || defaultLogo;
  const [src, setSrc] = useState(publicLogo);
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