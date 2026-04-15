import { Box, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Dynamically import ultra-lightweight thumbnails to eliminate GPU spikes
const rawImages = import.meta.glob('../app/assets/thumbnails/*.jpg', { 
  eager: true, 
  query: '?url', 
  import: 'default' 
});
const imageList = Object.values(rawImages) as string[];
const curatedImages = imageList.slice(0, 10);

const Column = ({ images, speed, reverse = false }: { images: string[], speed: number, reverse?: boolean }) => {
  return (
    <Box
      component={motion.div}
      animate={{
        y: reverse ? [0, -1000] : [-1000, 0],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear",
      }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        willChange: 'transform', // Signal the GPU that this will move
      }}
    >
      {[...images, ...images].map((src, i) => (
        <Box
          key={i}
          sx={{
            width: '100%',
            height: 'auto',
            aspectRatio: i % 2 === 0 ? '4/5' : '1/1',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <img
            src={src}
            alt="Burger background"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block', // Prevents extra whitespace
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default function HeroBackground() {
  const [columns, setColumns] = useState<string[][]>([]);

  useEffect(() => {
    // Distribute images into 3 columns
    const shuffled = [...curatedImages].sort(() => Math.random() - 0.5);
    const cols: string[][] = [[], [], []];
    
    shuffled.forEach((img, i) => {
      cols[i % 3].push(img);
    });
    
    setColumns(cols);
  }, []);

  if (columns.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        backgroundColor: '#0A0A0A',
      }}
    >
      {/* The Carousel Container - 3 cols on desktop, 2 on mobile */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 2,
          p: 2,
          width: '105%',
          left: '-2.5%',
          position: 'absolute',
          top: '-10%',
        }}
      >
        <Column images={columns[0]} speed={120} />
        <Column images={columns[1]} speed={150} reverse />
        <Column images={columns[2]} speed={135} />
      </Box>

      {/* Simplified, Single Dark Overlay with Glassmorphism Blur */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(to bottom, 
            ${alpha('#0A0A0A', 0.9)} 0%, 
            ${alpha('#0A0A0A', 0.8)} 50%, 
            ${alpha('#0A0A0A', 0.95)} 100%
          )`,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1,
        }}
      />
      
      {/* Subtle Depth Mask */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at center, transparent 30%, #0A0A0A 95%)',
          zIndex: 2,
        }}
      />
    </Box>
  );
}
