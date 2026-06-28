import { useEffect, useState } from "react";
import splashImg from "@/assets/splash.webp";
import { motion, AnimatePresence } from "motion/react";

export function Splash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("splash_played")) {
      setShow(false);
    }
  }, []);

  useEffect(() => {
    if (!show) {
      document.body.style.overflow = "auto";
      return;
    }
    // Lock scroll
    document.body.style.overflow = "hidden";
  }, [show]);

  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      handleHide();
    }, 1200); // 1.2s duration to prevent seeing it loop

    return () => clearTimeout(timer);
  }, [show]);

  const handleHide = () => {
    setShow(false);
    sessionStorage.setItem("splash_played", "true");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-background flex items-center justify-center"
        >
          {/* Inline script to prevent flash on refresh */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (sessionStorage.getItem('splash_played')) {
                  document.getElementById('splash-screen').style.display = 'none';
                }
              `,
            }}
          />
          <img src={splashImg} alt="Intro Splash" className="w-full h-full object-cover" />
          {/* Fallback button if user wants to skip */}
          <button
            onClick={handleHide}
            className="absolute bottom-10 px-6 py-2 rounded-full bg-surface-2/60 hover:bg-surface-2 text-foreground backdrop-blur-md transition-colors hairline text-sm"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
