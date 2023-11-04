"use client";
import { useRef, useEffect } from "react";
import styles from "./styles.module.css";

export const Modal = ({ children, hide }) => {
  const overlay = useRef(null);
  const wrapper = useRef(null);

  const onDismiss = hide ? hide : () => {
    overlay.current.remove();
  };

  const onClick = (e) => {
    if (e.target === overlay.current) {
      onDismiss();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") onDismiss();
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div ref={overlay} className={styles.overlay} onClick={onClick}>
      <div ref={wrapper} className={styles.wrapper}>
        {children}
      </div>
    </div>
  );
};
