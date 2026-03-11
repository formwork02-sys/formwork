import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="font-black mb-16 leading-[0.9] flex flex-col items-center">
          <span className="text-[41px] md:text-[61px] lg:text-[81px]">formwork:</span>
          <span className="text-[41px] md:text-[61px] lg:text-[81px]">Building the Core Identity.</span>
        </h1>
        <p className="text-lg md:text-xl text-black/60 font-medium max-w-2xl mx-auto">
          브랜드의 뼈대를 설계하는 BI/BX 디자이너, formwork입니다.
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-20 animate-bounce"
      >
        <div className="w-px h-12 bg-black"></div>
      </motion.div>
    </section>
  );
}
