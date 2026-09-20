"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { siGithub, siX, siDiscord } from "simple-icons";

export default function ContactSection() {
  return (
    <section className="py-24 md:py-32 px-6 relative overflow-hidden" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <div className="mb-12">
              <div className="inline-flex items-center text-muted-foreground font-mono text-sm mb-4">
                ../Contact/init.sh
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight mb-6 uppercase">
                Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Have questions about AntiSlop's AST purification, local privacy, or enterprise integration? We're here to help you clean up your codebase.
              </p>
            </div>

            <div className="space-y-8 mb-12 flex-1">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <MapPin className="w-5 h-5 text-terminal-green" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1 tracking-wide uppercase text-sm">Address</h4>
                  <p className="text-muted-foreground text-sm">123 Cyber Street, Sector 7G<br />Neo-SF, CA 94107</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Phone className="w-5 h-5 text-terminal-green" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1 tracking-wide uppercase text-sm">Phone</h4>
                  <p className="text-muted-foreground text-sm">+1 (555) 019-2837</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Mail className="w-5 h-5 text-terminal-green" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1 tracking-wide uppercase text-sm">E-mail</h4>
                  <p className="text-muted-foreground text-sm">hello@antislop.dev</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-terminal-green hover:border-terminal-green/50 transition-colors bg-white/[0.02] hover:bg-terminal-green/5">
                <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d={siX.path} />
                </svg>
                <span className="sr-only">X (Twitter)</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-terminal-green hover:border-terminal-green/50 transition-colors bg-white/[0.02] hover:bg-terminal-green/5">
                <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d={siGithub.path} />
                </svg>
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-terminal-green hover:border-terminal-green/50 transition-colors bg-white/[0.02] hover:bg-terminal-green/5">
                <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d={siDiscord.path} />
                </svg>
                <span className="sr-only">Discord</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-terminal-green/10 blur-[100px] rounded-full pointer-events-none opacity-50" />
            
            <div className="relative bg-[#0A0A0B]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12 shadow-2xl">
              <h3 className="text-2xl font-heading font-bold text-white mb-8 tracking-wide uppercase">
                Contact Form
              </h3>
              
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="relative group">
                  <input 
                    type="text" 
                    id="name"
                    required
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-transparent focus:outline-none focus:border-terminal-green transition-colors peer"
                    placeholder="Your name"
                  />
                  <label 
                    htmlFor="name" 
                    className="absolute left-0 top-3 text-sm text-muted-foreground transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-terminal-green peer-valid:-top-4 peer-valid:text-xs"
                  >
                    Your name
                  </label>
                </div>

                <div className="relative group">
                  <input 
                    type="tel" 
                    id="phone"
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-transparent focus:outline-none focus:border-terminal-green transition-colors peer"
                    placeholder="Your phone"
                  />
                  <label 
                    htmlFor="phone" 
                    className="absolute left-0 top-3 text-sm text-muted-foreground transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-terminal-green peer-[&:not(:placeholder-shown)]:-top-4 peer-[&:not(:placeholder-shown)]:text-xs"
                  >
                    Your phone
                  </label>
                </div>

                <div className="relative group">
                  <input 
                    type="email" 
                    id="email"
                    required
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-transparent focus:outline-none focus:border-terminal-green transition-colors peer"
                    placeholder="Your e-mail"
                  />
                  <label 
                    htmlFor="email" 
                    className="absolute left-0 top-3 text-sm text-muted-foreground transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-terminal-green peer-valid:-top-4 peer-valid:text-xs"
                  >
                    Your e-mail
                  </label>
                </div>

                <div className="relative group">
                  <textarea 
                    id="message"
                    required
                    rows={4}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-transparent focus:outline-none focus:border-terminal-green transition-colors peer resize-none"
                    placeholder="Message"
                  ></textarea>
                  <label 
                    htmlFor="message" 
                    className="absolute left-0 top-3 text-sm text-muted-foreground transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-terminal-green peer-valid:-top-4 peer-valid:text-xs"
                  >
                    Message
                  </label>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit"
                    className="group flex items-center gap-2 px-6 py-3 bg-[#121214] border border-white/10 hover:border-terminal-green/50 hover:bg-terminal-green/10 text-white text-sm font-medium tracking-wider uppercase transition-all duration-300 rounded-lg overflow-hidden relative"
                  >
                    <span className="relative z-10">Send Message</span>
                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 w-0 bg-terminal-green/10 transition-all duration-500 ease-out group-hover:w-full" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
