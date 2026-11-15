"use client";

import { useState } from "react";
import { m, useReducedMotion } from "framer-motion";

const SERVICES_OPTIONS = [
  "Ceramic Coating (1, 3 or 5-Year Protection)",
  "Paint Protection Film (PPF - Garware / TPU)",
  "Compounding & Swirl Mark Polishing",
  "Deep Interior Spa & Steam Sanitization",
  "Premium Foam Wash & Exterior Care",
  "Holy Wash (Pre-Outstation Ritual)",
  "Full Car Complete Detailing Package",
  "Custom / Need Consultation",
];

export function BookingSection() {
  const reduce = useReducedMotion();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    carModel: "",
    service: SERVICES_OPTIONS[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your full name.";
    }
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }
    if (!formData.carModel.trim()) {
      newErrors.carModel = "Please enter your car model (e.g. Creta, Thar, BMW).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Format WhatsApp Message
    const msg = [
      `*New Service Booking Request - The Detailing Monk*`,
      ``,
      `👤 *Name:* ${formData.name.trim()}`,
      `📞 *Phone:* ${formData.phone.trim()}`,
      `🚗 *Car Model:* ${formData.carModel.trim()}`,
      `✨ *Service Required:* ${formData.service}`,
      ``,
      `Please let me know available slots & estimated quotation.`,
    ].join("\n");

    const waHref = `https://wa.me/918826966825?text=${encodeURIComponent(msg)}`;
    window.open(waHref, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <section id="booking-section" className="scroll-mt-24 py-20 sm:py-24 lg:py-28 bg-background relative overflow-hidden" aria-labelledby="booking-heading">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-120 w-120 rounded-full bg-deep-burgundy/8 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-96 w-96 rounded-full bg-cosmic-latte/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Left Info Column */}
          <m.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-deep-burgundy/25 bg-deep-burgundy/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-deep-burgundy">
              Quick & Easy Slot Booking
            </span>
            <h2 id="booking-heading" className="mt-3 font-display text-4xl font-medium leading-[1.08] text-foreground sm:text-5xl lg:text-[3.2rem]">
              Book Your Detailing Slot
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              Experience the ritual of automotive care. Fill this short form to instantly connect with our studio on WhatsApp with your exact car details.
            </p>

            {/* Quick studio highlights */}
            <ul className="mt-8 space-y-3.5 text-sm text-foreground/80">
              <li className="flex items-center gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-deep-burgundy text-white">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                <span><strong>Sector 11, Rohini Studio:</strong> Dedicated dust-free bays</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-deep-burgundy text-white">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                <span><strong>Tue – Sun (10 AM to 8 PM):</strong> Monday off</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-deep-burgundy text-white">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                <span><strong>Instant WhatsApp Confirmation:</strong> Quick quotation & advice</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-border/70 flex items-center gap-4">
              <a
                href="https://wa.me/918826966825"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#128c7e] hover:underline"
              >
                <WhatsAppIcon /> Or chat directly: +91 88269 66825
              </a>
            </div>
          </m.div>

          {/* Right Form Card */}
          <m.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl border border-border/80 bg-surface p-7 shadow-xl shadow-deep-burgundy/5 sm:p-9"
          >
            {submitted ? (
              <div className="py-8 text-center" role="status">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-600">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">Enquiry Sent to WhatsApp!</h3>
                <p className="mt-2 text-sm text-muted">
                  Your WhatsApp message with your car model and service details has been prefilled. Simply hit send on WhatsApp to confirm your slot!
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex rounded-full border border-border px-5 py-2 text-xs font-semibold text-foreground hover:bg-surface-muted"
                >
                  Book Another Service
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h3 className="font-display text-2xl font-semibold text-foreground">
                  Quick Appointment Request
                </h3>
                <p className="mt-1 text-xs text-muted">Simple 4-step details for prompt quotation.</p>

                <div className="mt-6 space-y-4">
                  {/* Field 1: Name */}
                  <div>
                    <label htmlFor="booking-name" className="block text-xs font-semibold text-foreground/80 mb-1.5">
                      1. Full Name *
                    </label>
                    <input
                      id="booking-name"
                      name="name"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-deep-burgundy focus:ring-2 focus:ring-deep-burgundy/15 ${
                        errors.name ? "border-red-500" : "border-border"
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>

                  {/* Field 2: Phone */}
                  <div>
                    <label htmlFor="booking-phone" className="block text-xs font-semibold text-foreground/80 mb-1.5">
                      2. Phone Number *
                    </label>
                    <input
                      id="booking-phone"
                      name="phone"
                      type="tel"
                      placeholder="e.g. 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-deep-burgundy focus:ring-2 focus:ring-deep-burgundy/15 ${
                        errors.phone ? "border-red-500" : "border-border"
                      }`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>

                  {/* Field 3: Car Model */}
                  <div>
                    <label htmlFor="booking-car" className="block text-xs font-semibold text-foreground/80 mb-1.5">
                      3. Car Model & Year *
                    </label>
                    <input
                      id="booking-car"
                      name="carModel"
                      type="text"
                      placeholder="e.g. Hyundai Creta 2023, Thar, BMW 3 Series"
                      value={formData.carModel}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-deep-burgundy focus:ring-2 focus:ring-deep-burgundy/15 ${
                        errors.carModel ? "border-red-500" : "border-border"
                      }`}
                    />
                    {errors.carModel && <p className="mt-1 text-xs text-red-500">{errors.carModel}</p>}
                  </div>

                  {/* Field 4: Service Required */}
                  <div>
                    <label htmlFor="booking-service" className="block text-xs font-semibold text-foreground/80 mb-1.5">
                      4. Service Required *
                    </label>
                    <div className="relative">
                      <select
                        id="booking-service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm text-foreground outline-none transition-colors focus:border-deep-burgundy focus:ring-2 focus:ring-deep-burgundy/15"
                      >
                        {SERVICES_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mt-7">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#128c7e] py-3.5 text-sm font-semibold text-white shadow-md shadow-[#128c7e]/30 transition-all hover:bg-[#0d6e63] hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <WhatsAppIcon />
                    Book Slot via WhatsApp
                  </button>
                  <p className="mt-2.5 text-center text-[11px] text-muted">
                    No payment required now · Direct connection with Sector 11 studio
                  </p>
                </div>
              </form>
            )}
          </m.div>
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}
