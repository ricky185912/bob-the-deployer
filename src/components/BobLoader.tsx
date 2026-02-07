"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Package, Hash, CheckCircle2 } from "lucide-react";

interface BobLoaderProps {
  status?: "uploading" | "hashing" | "storing" | "ready";
  progress?: number;
}

export default function BobLoader({ 
  status = "uploading", 
  progress = 0 
}: BobLoaderProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "hashing": 
        return { icon: Hash, color: "text-orange-400", text: "🔐 Hashing ZIP...", progress: 40 };
      case "storing": 
        return { icon: CheckCircle2, color: "text-emerald-400", text: "💾 Storing...", progress: 80 };
      case "ready": 
        return { icon: CheckCircle2, color: "text-emerald-400", text: "✅ Deployment Ready!", progress: 100 };
      default: 
        return { icon: Package, color: "text-orange-400", text: "📤 Uploading...", progress: 20 };
    }
  };

  const { icon: StatusIcon, color, text, progress: statusProgress } = getStatusConfig();

  return (
    <motion.div 
      className="w-full max-w-md p-8 rounded-3xl bg-zinc-950/50 border border-zinc-800/50 backdrop-blur-xl glow shadow-2xl"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Animated Badger - SMOOTH Framer Motion */}
      <motion.div 
        className="relative w-32 h-32 mx-auto mb-8"
        animate={{ 
          rotate: [0, -2, 2, -1, 0],
          scale: [1, 1.02, 1, 1.01, 1]
        }}
        transition={{ 
          rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Badger Head */}
        <motion.div 
          className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-3xl shadow-2xl border-4 border-orange-500/20"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Glowing Eyes - Blinking */}
          <AnimatePresence>
            <motion.div 
              className="absolute top-8 left-6 w-3 h-3 bg-white rounded-full shadow-lg"
              key="left-eye"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
            <motion.div 
              className="absolute top-8 right-6 w-3 h-3 bg-white rounded-full shadow-lg"
              key="right-eye"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.3 }}
            />
          </AnimatePresence>

          {/* Shiny Nose */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full shadow-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Pointy Ears */}
          <motion.div 
            className="absolute top-1 left-3 w-8 h-8 bg-gradient-to-r from-orange-500/90 to-yellow-500/80 rounded-tl-3xl -rotate-12 shadow-xl"
            animate={{ rotate: [-12, -15, -12] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-1 right-3 w-8 h-8 bg-gradient-to-l from-orange-500/90 to-yellow-500/80 rounded-tr-3xl rotate-12 shadow-xl"
            animate={{ rotate: [12, 15, 12] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          />
        </motion.div>

        {/* Running Legs - SMOOTH */}
        <motion.div 
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-0.5"
          animate={{ 
            x: [-2, 2, -2, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            x: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 0.8, repeat: Infinity }
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-zinc-600 rounded-sm shadow-md border border-zinc-400"
              animate={{ 
                y: [0, -4, 0],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ 
                y: { duration: 0.4, repeat: Infinity, delay: i * 0.1 },
                rotate: { duration: 0.4, repeat: Infinity, delay: i * 0.1 }
              }}
            />
          ))}
        </motion.div>

        {/* Wagging Tail */}
        <motion.div 
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-14 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-l-3xl shadow-2xl border-r-4 border-orange-400/50"
          animate={{ 
            rotate: [-10, 10, -10],
            scaleY: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
            scaleY: { duration: 0.6, repeat: Infinity }
          }}
        />
      </motion.div>

      {/* Status + Progress */}
      <motion.div 
        className="text-center space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className={`w-12 h-12 mx-auto p-2 rounded-2xl bg-white/10 backdrop-blur-sm ${color} shadow-2xl`}
        >
          <StatusIcon className="w-8 h-8" />
        </motion.div>
        
        <motion.p 
          className={`text-xl font-bold tracking-tight ${color}`}
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
        
        {status !== "ready" && (
          <motion.div 
            className="w-full bg-zinc-900/50 rounded-2xl h-4 overflow-hidden border border-zinc-700/50"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 rounded-2xl shadow-lg"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: statusProgress / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
