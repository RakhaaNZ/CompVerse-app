import { motion } from "framer-motion";

export default function BTN({ children }) {
  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
      style={{
        ...box,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "15px",
      }}
    >
      {children}
    </motion.div>
  );
}

const box = {
  width: 150,
  height: 40,
  backgroundColor: "#1C2F91",
  borderRadius: 15,
};
