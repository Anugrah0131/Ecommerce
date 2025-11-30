import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

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
    <div className="w-full min-h-screen bg-[#fafaff] text-gray-800 font-inter">
      {/* gradient blobs for home.jsx consistency */}
      <div className="absolute -left-24 -top-20 w-80 h-80 bg-pink-300/30 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute -right-24 bottom-20 w-96 h-96 bg-purple-300/25 blur-[150px] rounded-full pointer-events-none" />

      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-14"
        >
          Contact <span className="text-purple-600">Us</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT CARD */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-10"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Get in touch</h2>
            <p className="text-gray-600 mb-8">
              Have any questions or need support? Reach out — we respond within 24 hours.
            </p>

            <div className="space-y-6">
              {[
                { icon: Mail, title: "Email", value: "hello@yourdomain.com" },
                { icon: Phone, title: "Phone", value: "+91 98765 43210" },
                { icon: MapPin, title: "Location", value: "Bengaluru, India" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 shadow-sm border border-white/60">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.title}</p>
                      <p className="font-medium text-gray-800">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Follow</h3>
              <div className="flex gap-4">
                {["Twitter", "LinkedIn", "Instagram"].map((s, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-sm font-medium text-purple-600 hover:underline"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* RIGHT FORM */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 p-10"
            noValidate
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* NAME */}
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">Your name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`rounded-xl border p-3 text-sm focus:ring-2 focus:ring-purple-300 ${
                    errors.name ? "border-rose-400" : "border-gray-200"
                  }`}
                  placeholder="Anugrah"
                />
                {errors.name && <span className="text-rose-600 text-xs mt-1">{errors.name}</span>}
              </label>

              {/* EMAIL */}
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`rounded-xl border p-3 text-sm focus:ring-2 focus:ring-purple-300 ${
                    errors.email ? "border-rose-400" : "border-gray-200"
                  }`}
                  placeholder="you@company.com"
                />
                {errors.email && <span className="text-rose-600 text-xs mt-1">{errors.email}</span>}
              </label>
            </div>

            {/* SUBJECT */}
            <label className="flex flex-col mt-5">
              <span className="text-sm font-medium text-gray-700 mb-1">Subject</span>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className={`rounded-xl border p-3 text-sm focus:ring-2 focus:ring-purple-300 ${
                  errors.subject ? "border-rose-400" : "border-gray-200"
                }`}
                placeholder="How can we help?"
              />
              {errors.subject && (
                <span className="text-rose-600 text-xs mt-1">{errors.subject}</span>
              )}
            </label>

            {/* MESSAGE */}
            <label className="flex flex-col mt-5">
              <span className="text-sm font-medium text-gray-700 mb-1">Message</span>
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                className={`rounded-xl border p-3 text-sm focus:ring-2 focus:ring-purple-300 ${
                  errors.message ? "border-rose-400" : "border-gray-200"
                }`}
                placeholder="Write your message..."
              ></textarea>
              {errors.message && (
                <span className="text-rose-600 text-xs mt-1">{errors.message}</span>
              )}
            </label>

            {/* BUTTON */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={status === "sending"}
              className="mt-8 w-full py-3 rounded-full text-white font-semibold shadow-md bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-95 transition"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </motion.button>

            {/* STATUS */}
            {status === "success" && (
              <p className="text-green-600 text-sm mt-3">Message sent successfully!</p>
            )}
            {status === "error" && (
              <p className="text-rose-600 text-sm mt-3">Failed to send. Try again.</p>
            )}
          </motion.form>
        </div>
      </section>
    </div>
  );
}
