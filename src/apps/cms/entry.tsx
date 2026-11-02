import { useEffect } from "react";
import { Router } from "@/lib/wouter";
import App from "./App";
import "./index.css";

const FONTS: string[] = ["https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"];

export default function Entry() {
  useEffect(() => {
    FONTS.forEach((href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      document.head.appendChild(l);
    });
  }, []);
  return <App />;
}
