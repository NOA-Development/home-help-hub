import { useEffect, useState } from 'react';
import { Search, Wrench, Zap, Droplets, Flower2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchingAnimation = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const icons = [Wrench, Zap, Droplets, Flower2];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="relative mb-8">
        {/* Outer pulse rings */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-24 h-24 rounded-full bg-primary/20"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute inset-0 w-24 h-24 rounded-full bg-primary/10"
        />
        
        {/* Center icon container */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-glow"
        >
          <motion.div
            animate={{
              y: [-5, 5, -5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Search className="w-10 h-10 text-primary-foreground" />
          </motion.div>
        </motion.div>
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-foreground mb-2"
      >
        Finding specialists{dots}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground text-center max-w-xs"
      >
        Searching for the best professionals near you
      </motion.p>

      {/* Floating service icons */}
      <div className="flex gap-4 mt-8">
        {icons.map((Icon, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { delay: 0.4 + index * 0.1 },
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              },
            }}
            className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center"
          >
            <Icon className="w-6 h-6 text-primary" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchingAnimation;
