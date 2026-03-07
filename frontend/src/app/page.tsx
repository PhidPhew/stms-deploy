"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-800 overflow-hidden">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-semibold tracking-tight text-indigo-700"
          >
            Database Systems Project
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-sm"
          >
            <Link
              href="/login?role=student"
              className="px-3 py-1.5 rounded-md bg-slate-800 text-white hover:bg-slate-700 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-3 py-1.5 rounded-md bg-slate-800 text-white hover:bg-slate-700 transition"
            >
              Register
            </Link>
            <Link
              href="/login?role=admin"
              className="px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
            >
              Admin
            </Link>
          </motion.div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-100 to-white">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-24 left-20 text-8xl opacity-15"
          >
            🏀
          </motion.div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/3 right-20 text-8xl opacity-15"
          >
            ⚽
          </motion.div>

          <motion.div
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute top-29 left-1/2 text-8xl opacity-15"
          >
            🏸
          </motion.div>

          <motion.div
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute bottom-3 left-1/2 text-8xl opacity-15"
          >
            🏀
          </motion.div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="
  text-4xl md:text-5xl font-bold mb-6 pb-2 leading-[1.25]
  bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500
  bg-clip-text text-transparent
"
          >
            Sports Team Management System
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-3xl text-lg text-slate-600"
          >
            A web-based application demonstrating the integration of relational
            and non-relational databases for effective sports team and training
            management.
          </motion.p>
        </div>
      </section>

      {/* PROJECT OVERVIEW */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-10 shadow-lg"
        >
          <h3 className="text-2xl font-semibold mb-4 text-indigo-700">
            Project Overview
          </h3>
          <p className="text-slate-600 leading-relaxed">
            The Sports Team Management System (STMS) centralizes student, coach,
            course, training, and financial data into a single platform. The
            system is designed to improve data consistency, traceability, and
            overall operational efficiency for sports organizations.
          </p>
        </motion.div>
      </section>

      {/* TEAM */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-semibold mb-12 text-center text-indigo-700"
        >
          Project Team
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Chawankorn Khamtue", id: "6710503895", emoji: "📊" },
            { name: "Naravin Vechpanich", id: "6710504450", emoji: "🎨" },
            { name: "Achiraya Charoenpanvorakul", id: "6710503844", emoji: "⚙️" },
          ].map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                {m.emoji}
              </motion.div>

              <h4 className="font-semibold text-slate-800">
                {m.name}
              </h4>

              <p className="text-sm text-slate-500 mt-1">
                Student ID: {m.id}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-slate-500">
          © 2026 Sports Team Management System — Database Systems Project
        </div>
      </footer>
    </main>
  )
}