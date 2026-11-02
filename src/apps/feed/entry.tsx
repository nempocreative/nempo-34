import { useEffect } from "react";
import { Router } from "@/lib/wouter";
import App from "./App";
import "./index.css";

const FONTS: string[] = [];

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
  return <Router base="/nempo-feed"><App /></Router>;
}
