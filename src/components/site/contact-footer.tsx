import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { profileQuery } from "@/lib/cms";
import { submitContact } from "@/lib/contact.functions";
import { Loader2 } from "lucide-react";

export function ContactFooter() {
  const { data: profile } = useQuery(profileQuery);
  const ref = useRef<HTMLElement>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [productType, setProductType] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = useServerFn(submitContact);

  const mut = useMutation({
    mutationFn: () =>
      submit({
        data: {
          name,
          email,
          phone: phone || undefined,
          budget: budget || undefined,
          productType: productType || undefined,
          message,
        },
      }),
    onSuccess: () => {
      setName("");
      setEmail("");
      setPhone("");
      setBudget("");
      setProductType("");
      setMessage("");
      setSubmitted(true);
    },
    onError: (e: any) => {
      alert(e?.message ?? "Failed to send. Please try again.");
    },
  });

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const letters = ref.current!.querySelectorAll<HTMLElement>("[data-letter]");
      gsap.set(letters, { yPercent: 110, opacity: 0 });
      gsap.to(letters, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        stagger: 0.04,
        scrollTrigger: undefined,
      });
    }, ref);

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            gsap.fromTo(
              ref.current!.querySelectorAll("[data-letter]"),
              { yPercent: 110, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 1.1,
                ease: "expo.out",
                stagger: 0.04,
              },
            );
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => {
      obs.disconnect();
      ctx.revert();
    };
  }, []);

  const big = "LET'S MAKE";

  const inputCls =
    "w-full bg-transparent border-b hairline py-2 px-2 focus:border-[color:var(--neon)] outline-none text-sm transition-colors placeholder:text-muted-foreground/60";

  return (
    <footer id="contact" ref={ref} className="relative overflow-hidden pt-14 pb-6 bg-background">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60"
        style={
          {
            background:
              "radial-gradient(70% 50% at 30% 100%, color-mix(in oklab, var(--amber) 22%, transparent), transparent 70%), radial-gradient(60% 50% at 80% 0%, color-mix(in oklab, var(--neon) 15%, transparent), transparent 70%)",
          } as React.CSSProperties
        }
      />

      <div className="mx-auto max-w-6xl px-6">
        <p className="font-mono text-[5px] tracking-[0.25em] uppercase text-muted-foreground">
          <span className="text-[color:var(--neon)]">●</span> Booking Q1 2026
        </p>

        <h3 className="mt-8 font-display font-medium leading-[0.7] tracking-[-0.04em] text-[clamp(3rem,13vw,11rem)]">
          <span className="block overflow-hidden">
            {big.split("").map((c, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span data-letter className="inline-block">
                  {c === " " ? "\u00A0" : c}
                </span>
              </span>
            ))}
          </span>
          <span className="block overflow-visible">
            <span
              data-letter
              className="inline-flex font-serif-italic text-[color:var(--amber)] text-[105px] tracking-wider"
            >
              something impactful
            </span>
          </span>
        </h3>

        <div className="mt-16 grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ── FORM ── */}
          {submitted ? (
            <div className="rounded-3xl hairline p-8 sm:p-12 bg-surface/40 backdrop-blur-sm flex flex-col items-center justify-center text-center gap-5">
              <div className="h-16 w-16 rounded-full bg-[color:var(--neon)]/10 text-[color:var(--neon)] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h4 className="font-display text-2xl tracking-tight">Brief sent!</h4>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Thanks for reaching out — I'll review your brief and get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 rounded-full hairline px-5 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-[color:var(--neon)] transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (name && email && message) mut.mutate();
              }}
              className="rounded-3xl hairline p-6 sm:p-8 bg-surface/40 backdrop-blur-sm flex flex-col gap-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                    Name *
                  </span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                    placeholder="Your name"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                    Email *
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                    placeholder="you@domain.com"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                    Phone (Optional)
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputCls}
                    placeholder="+1 (555) 000-0000"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                    Budget
                  </span>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-transparent border-b hairline py-2 px-2 focus:border-[color:var(--neon)] outline-none text-sm text-foreground/70 appearance-none transition-colors"
                  >
                    <option value="" disabled>
                      Select a range
                    </option>
                    <option value="<1k">&lt; $1,000</option>
                    <option value="1k-5k">$1,000 - $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k+">$10,000+</option>
                  </select>
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Product Type
                </span>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full bg-transparent border-b hairline py-2 px-2 focus:border-[color:var(--neon)] outline-none text-sm text-foreground/70 appearance-none transition-colors"
                >
                  <option value="">Select a type…</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Web App">Web App</option>
                  <option value="UI/UX Design">UI / UX Design</option>
                  <option value="Automation">Automation</option>
                  <option value="Branding">Branding</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Message *
                </span>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${inputCls} resize-none`}
                  placeholder="Tell me about your vision..."
                />
              </label>

              {mut.isError && (
                <p className="text-xs text-destructive">
                  {(mut.error as any)?.message ?? "Something went wrong. Please try again."}
                </p>
              )}

              <button
                type="submit"
                disabled={mut.isPending}
                className="mt-2 self-start group inline-flex items-center gap-3 rounded-full bg-foreground text-background pl-5 pr-2 py-2 text-sm font-medium hover:bg-[color:var(--amber)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {mut.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send brief
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground group-hover:rotate-45 transition-transform">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="flex flex-col justify-between gap-10">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Email
                </p>
                <a
                  href={`mailto:${profile.email}`}
                  className="mt-2 block font-display text-xl tracking-tight hover:text-[color:var(--neon)] transition-colors"
                >
                  {profile.email}
                </a>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Based
                </p>
                <p className="mt-2 font-display text-xl tracking-tight">{profile.location}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "WhatsApp", url: "+201016082821" },
                { name: "Email", url: `mailto:${profile.email}` },
                { name: "LinkedIn", url: "https://linkedin.com/in/noureldein1" },
                { name: "GitHub", url: "https://github.com/nour-eldein10" },
                { name: "Behance", url: "https://behance.net/noureldein" },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full hairline px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-[color:var(--neon)] transition-colors"
                >
                  {s.name} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
          <br />
          <span>flutter,automation ?Just call me ! I will grant your wish! </span>
          <span> Nour Eldein © All Rights Reserved -2026 </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--neon)] animate-pulse" />
            Apps that inspire,Code that empowers ✨
          </span>
          <br />
        </div>
        <br />
      </div>
    </footer>
  );
}
