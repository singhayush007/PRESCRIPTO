import React from "react";

const Avatar = ({ src, name, className = "h-9 w-9" }) =>
  src ? (
    <img
      className={`${className} flex-shrink-0 rounded-full bg-primary-100 object-cover object-top`}
      src={src}
      alt=""
    />
  ) : (
    <span
      className={`${className} flex flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600`}
    >
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );

export default Avatar;
