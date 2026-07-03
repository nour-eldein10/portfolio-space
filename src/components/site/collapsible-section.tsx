import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = true 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="mb-8">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between group mb-3 cursor-pointer"
      >
        <h2 className="text-[10px] font-semibold uppercase tracking-widest font-mono text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </h2>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
