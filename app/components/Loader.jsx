import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { walk } from "../assets/assets";

export default function Loader({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          <div className="w-40">
            <Lottie animationData={walk} loop autoplay />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
