import React, { useState } from "react";

const Logo = ({ size = "md", showText = false, imgClass = "" }) => {
    const publicLogo = process.env.REACT_APP_LOGO_URL || '/memo-logo.jpg';
  const [src, setSrc] = useState(publicLogo);
  const cls = `brand-logo ${size}`;
  return (
    <div className={cls} aria-label="Viaja con Memo logo">
      <div className="logo-wrapper">
        <img src={src} alt="Viaja con Memo" className={`site-logo ${imgClass}`} onError={() => setSrc(publicLogo)} />
      </div>
      {showText && <span className="brand-text">Viaja con Memo</span>}
    </div>
  );
};

export default Logo;