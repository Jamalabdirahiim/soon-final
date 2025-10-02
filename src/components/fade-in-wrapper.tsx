"use client";

import { Fade } from "react-awesome-reveal";

export default function FadeInWrapper({ children }: { children: React.ReactNode }) {
  return <Fade triggerOnce direction="up" cascade damping={0.1}>{children}</Fade>;
}
