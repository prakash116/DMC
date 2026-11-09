"use client";

import { useId, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { db } from "@/lib/db";
import { EASE, splitService } from "@/components/services/motion";

const { form } = db.contact;
const { contact } = db.site;
const tiers = db.services.tiers.items;

type Values = Record<string, string>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Values) {
  const e: Values = {};
  for (const f of form.fields) {
    const val = (v[f.name] ?? "").trim();
    if (f.required && !val) e[f.name] = `Please enter your ${f.label.toLowerCase()}.`;
    else if (f.type === "email" && val && !EMAIL.test(val)) e[f.name] = "That email doesn’t look right.";
    else if (f.type === "tel" && val && val.replace(/\D/g, "").length < 10) e[f.name] = "Enter a 10-digit phone number.";
  }
  return e;
}

/* No backend: the enquiry is composed into a WhatsApp message (email as a fallback) */
function compose(v: Values) {
  return [
    `Hi, I'd like an estimated quotation.`,
    v.service ? `Service: ${v.service}` : "",
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    v.phone ? `Phone: ${v.phone}` : "",
    "",
    v.message,
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n");
}

export function Enquiry() {
  const reduce = useReducedMotion();
  const [values, setValues] = useState<Values>({ service: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);
  const errors = validate(values);
  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(Object.fromEntries(form.fields.map((f) => [f.name, true])));
    if (Object.keys(errors).length) {
      const first = form.fields.find((f) => errors[f.name]);
      if (first) document.getElementById(`f-${first.name}`)?.focus();
      return;
    }
    window.open(`${contact.whatsappHref}?text=${encodeURIComponent(compose(values))}`, "_blank", "noopener");
    setSent(true);
  };

  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(form.heading)}&body=${encodeURIComponent(compose(values))}`;

  return (
    <section id="contact-form" className="scroll-mt-28 pb-20 sm:pb-24 lg:pb-28" aria-labelledby="form-heading">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        {/* form card */}
        <m.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative overflow-hidden rounded-3xl bg-[#2b1d1f] p-6 text-mocha-cream shadow-[0_40px_80px_-40px_rgba(114,47,55,0.7)] sm:p-10"
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-deep-burgundy/50 blur-3xl" />
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <m.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className="relative flex min-h-110 flex-col items-center justify-center text-center" role="status">
                <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden="true">
                  <m.circle cx="44" cy="44" r="40" fill="none" stroke="#e9a970" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: EASE }} />
                  <m.path d="M28 45l11 11 21-23" fill="none" stroke="#e9a970" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6, ease: EASE }} />
                </svg>
                <h3 className="mt-6 font-display text-3xl font-semibold">Your enquiry is ready on WhatsApp</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-mocha-cream/75">
                  Just press send in WhatsApp and our team will get back to you shortly. WhatsApp didn’t open?{" "}
                  <a href={mailto} className="font-semibold text-[#e9a970] underline-offset-4 hover:underline">Send it by email</a>.
                </p>
                <button type="button" onClick={() => setSent(false)} className="mt-8 rounded-full border border-mocha-cream/30 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-mocha-cream/10">
                  Edit enquiry
                </button>
              </m.div>
            ) : (
              <m.form key="form" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                <h2 id="form-heading" className="font-display text-3xl font-semibold sm:text-4xl">{form.heading}</h2>
                <p className="mt-2 text-sm text-mocha-cream/65">Fields marked * are required.</p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {form.fields.map((f) => (
                    <Field
                      key={f.name}
                      field={f}
                      value={values[f.name] ?? ""}
                      error={touched[f.name] ? errors[f.name] : undefined}
                      onChange={(v) => set(f.name, v)}
                      onBlur={() => setTouched((t) => ({ ...t, [f.name]: true }))}
                      wide={f.type === "textarea"}
                    />
                  ))}
                  {/* optional service picker, built from the services list */}
                  <label className="relative block sm:col-start-2 sm:row-start-2">
                    <span className="mb-2 block text-xs font-semibold tracking-wide text-mocha-cream/70">Service (optional)</span>
                    <select
                      value={values.service}
                      onChange={(e) => set("service", e.target.value)}
                      className="w-full appearance-none rounded-xl border border-mocha-cream/15 bg-white/5 px-4 py-3.5 pr-10 text-sm text-mocha-cream outline-none transition-colors focus:border-[#e9a970] focus:bg-white/8"
                    >
                      <option value="" className="text-[#2b1d1f]">Not sure yet</option>
                      {tiers.map((t) => (
                        <optgroup key={t.id} label={t.title} className="text-[#2b1d1f]">
                          {t.services.map((s) => {
                            const n = splitService(s).name;
                            return (
                              <option key={s} value={n}>
                                {n}
                              </option>
                            );
                          })}
                        </optgroup>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute bottom-4 right-4 text-mocha-cream/60" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </label>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <m.button
                    type="submit"
                    whileHover={reduce ? undefined : { y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-mocha-cream px-7 py-3.5 text-sm font-semibold text-[#2b1d1f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9a970]"
                  >
                    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full skew-x-[-18deg] bg-linear-to-r from-transparent via-white/80 to-transparent transition-transform duration-700 group-hover:translate-x-[420%]" />
                    {form.submitLabel}
                    <svg className="transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </m.button>
                  <p className="text-xs text-mocha-cream/55">Opens WhatsApp with your details filled in.</p>
                </div>
              </m.form>
            )}
          </AnimatePresence>
        </m.div>

        {/* map */}
        <m.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0 : 0.12 }}
          className="group relative min-h-100 overflow-hidden rounded-3xl border border-border bg-surface-muted shadow-[0_30px_60px_-36px_rgba(114,47,55,0.5)] lg:min-h-0"
        >
          <iframe
            src={contact.address.mapEmbed}
            title="The Detailing Monk on Google Maps"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 [filter:sepia(0.25)_saturate(0.85)] transition-[filter] duration-700 group-hover:[filter:none]"
          />
          {/* address chip over the map */}
          <div className="glass-strong absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-3">
              <span className="relative mt-1 flex h-3 w-3 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
              </span>
              <p className="text-sm leading-snug text-foreground">
                <span className="block font-semibold">{db.site.name}</span>
                {contact.address.line1}, {contact.address.line2}
              </p>
            </div>
            <a
              href={contact.directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Get directions
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
        </m.div>
      </div>
    </section>
  );
}

type FieldDef = (typeof form.fields)[number];

/* floating-label input; label lifts on focus / when filled, error slides in under it */
function Field({ field: f, value, error, onChange, onBlur, wide }: { field: FieldDef; value: string; error?: string; onChange: (v: string) => void; onBlur: () => void; wide: boolean }) {
  const hint = useId();
  const common = {
    id: `f-${f.name}`,
    name: f.name,
    value,
    placeholder: " ",
    required: f.required,
    "aria-invalid": !!error,
    "aria-describedby": error ? hint : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    onBlur,
    className: `peer w-full rounded-xl border bg-white/5 px-4 pb-2.5 pt-6 text-sm text-mocha-cream outline-none transition-colors focus:bg-white/8 ${
      error ? "border-[#ff8a8a]/70" : "border-mocha-cream/15 focus:border-[#e9a970]"
    }`,
  };
  return (
    <div className={`relative ${wide ? "sm:col-span-2" : ""}`}>
      {f.type === "textarea" ? (
        <textarea {...common} rows={5} maxLength={1000} className={`${common.className} resize-none`} />
      ) : (
        <input {...common} type={f.type} autoComplete={f.type === "email" ? "email" : f.type === "tel" ? "tel" : "name"} inputMode={f.type === "tel" ? "tel" : undefined} />
      )}
      <label
        htmlFor={`f-${f.name}`}
        className="pointer-events-none absolute left-4 top-4 origin-left text-sm text-mocha-cream/55 transition-all duration-200 peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-[#e9a970] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold"
      >
        {f.label}
        {f.required && " *"}
      </label>
      {f.type === "textarea" && <span className="pointer-events-none absolute bottom-3 right-4 text-[11px] text-mocha-cream/40">{value.length}/1000</span>}
      <AnimatePresence>
        {error && (
          <m.p id={hint} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-1.5 text-xs font-medium text-[#ff9c9c]">
            {error}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  );
}
