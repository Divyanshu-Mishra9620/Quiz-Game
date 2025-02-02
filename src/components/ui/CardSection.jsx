import React from "react";

const CardSection = ({ children, className = "", style = {} }) => {
  return (
    <section
      className={`w-full max-w-[90%] sm:max-w-lg bg-[#16213e] p-6 sm:p-8 rounded-lg shadow-lg text-center border border-[#00bcd4] overflow-hidden ${className}`}
      style={style}
    >
      {children}
    </section>
  );
};

export default CardSection;
