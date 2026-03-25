import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CouponTrackerProps {
  visits: number;
  targetVisits: number;
}

export default function CouponTracker({ visits, targetVisits }: CouponTrackerProps) {
  const circles = Array.from({ length: targetVisits }, (_, i) => i);

  useEffect(() => {
    if (visits === targetVisits) {
      // Trigger confetti explosion
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFC107', '#FF9800', '#ffffff', '#1A1A1A']
      });
    }
  }, [visits, targetVisits]);

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
        Tu Progreso
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-start', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mt: 2,
        px: 1
      }}>
        {circles.map((i) => {
          const isFilled = i < visits;
          const isTarget = i === targetVisits - 1;
          
          return (
            <Box
              key={i}
              component={motion.div}
              initial={false}
              animate={{
                scale: isFilled ? [1, 1.2, 1] : 1,
                backgroundColor: isFilled ? '#FFC107' : '#2A2A2A' // Using the new primary yellow
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              sx={{
                width: { xs: 42, sm: 48 },
                height: { xs: 42, sm: 48 },
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: isFilled ? '0 0 15px rgba(255, 193, 7, 0.5)' : 'none',
                border: isFilled ? 'none' : '2px dashed rgba(255,255,255,0.2)'
              }}
            >
              {isTarget ? (
                <FastfoodIcon sx={{ color: isFilled ? '#1A1A1A' : 'rgba(255,255,255,0.3)' }} />
              ) : (
                <LocalActivityIcon sx={{ color: isFilled ? '#1A1A1A' : 'rgba(255,255,255,0.1)' }} />
              )}
            </Box>
          );
        })}
      </Box>

      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'primary.main', fontWeight: 'bold' }}>
        {visits >= targetVisits 
          ? '¡Ya podés retirar tu hamburguesa gratis!' 
          : `¡Te faltan solo ${Math.max(0, targetVisits - visits)} visitas para tu burger GRATIS!`}
      </Typography>
    </Box>
  );
}
