import dynamic from "next/dynamic";
import React from "react";

type Props = {
  animationPath: string;
};

// Dynamically import react-lottie to prevent SSR issues
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

const GreetingLottie = ({ animationPath }: Props) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    path: animationPath,
  };

  return (
    <div onClick={() => null}>
      {/* @ts-ignore */}
      <Lottie options={defaultOptions} />
    </div>
  );
};

export default GreetingLottie;
