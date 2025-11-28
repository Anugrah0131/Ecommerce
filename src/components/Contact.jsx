import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";
import { motion } from "framer-motion";

// Contact.jsx
// A responsive, accessible contact component styled with Tailwind CSS.
// - Uses framer-motion for subtle animations
// - Includes inline client-side validation
// - Ready to hook up to an API endpoint (/api/contact) or third-party service

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  function validate(values) {
    const e = {};
    if (!values.name.trim()) e.name = "Name is required";
    if (!values.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = "Enter a valid email";
    if (!values.subject.trim()) e.subject = "Subject is required";
    if (!values.message.trim()) e.message = "Message is required";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setStatus("sending");
    try {
      // Example: POST to /api/contact. Replace with your backend or service.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send");

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 3500);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3500);
    }
  }

  function handleChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left: Contact card + info */}
        <motion.aside
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-white/60 to-slate-50/60 p-8 rounded-2xl shadow-lg border border-gray-100"
        >
          <h2 className="text-3xl font-extrabold mb-3">Get in touch</h2>
          <p className="text-slate-600 mb-6">Have a project, question or just want to say hi? Drop a message — I usually reply within 24–48 hours.</p>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-slate-100/60">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium">hello@yourdomain.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-slate-100/60">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-slate-100/60">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Location</p>
                <p className="font-medium">Bengaluru, India</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Follow</h3>
            <div className="flex gap-3">
              <a href="#" className="text-sm underline">Twitter</a>
              <a href="#" className="text-sm underline">LinkedIn</a>
              <a href="#" className="text-sm underline">Instagram</a>
            </div>
          </div>
        </motion.aside>

        {/* Right: Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-slate-700 mb-1">Your name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition disabled:opacity-50 ${errors.name ? "border-rose-400" : "border-gray-200"}`}
                placeholder="Anugrah"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && <span id="name-error" className="text-rose-600 text-xs mt-1">{errors.name}</span>}
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-slate-700 mb-1">Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition disabled:opacity-50 ${errors.email ? "border-rose-400" : "border-gray-200"}`}
                placeholder="you@company.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && <span id="email-error" className="text-rose-600 text-xs mt-1">{errors.email}</span>}
            </label>
          </div>

          <label className="flex flex-col mt-4">
            <span className="text-sm font-medium text-slate-700 mb-1">Subject</span>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className={`w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition disabled:opacity-50 ${errors.subject ? "border-rose-400" : "border-gray-200"}`}
              placeholder="Project enquiry, collaboration, feedback..."
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "subject-error" : undefined}
            />
            {errors.subject && <span id="subject-error" className="text-rose-600 text-xs mt-1">{errors.subject}</span>}
          </label>

          <label className="flex flex-col mt-4">
            <span className="text-sm font-medium text-slate-700 mb-1">Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={6}
              className={`w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition disabled:opacity-50 ${errors.message ? "border-rose-400" : "border-gray-200"}`}
              placeholder="Tell me about your idea, timeline and budget..."
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && <span id="message-error" className="text-rose-600 text-xs mt-1">{errors.message}</span>}
          </label>

          <div className="mt-6 flex items-center justify-between gap-4">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-3 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              disabled={status === "sending"}
            >
              {status === "success" ? (
                <>
                  <Check size={16} /> Sent
                </>
              ) : (
                <>
                  <Send size={16} /> {status === "sending" ? "Sending..." : "Send message"}
                </>
              )}
            </motion.button>

            <div className="text-sm text-slate-500">Or email me at <span className="font-medium">hello@yourdomain.com</span></div>
          </div>

          {/* small helper text */}
          <div className="mt-4 text-xs text-slate-400">We’ll never share your details. This form is protected by reCAPTCHA (if you add it server-side).</div>
        </motion.form>
      </div>
    </section>
  );
}
