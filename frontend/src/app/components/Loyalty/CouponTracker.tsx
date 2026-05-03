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
        justifyContent: 'center', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mt: 2,
        px: 1
      }}>
        {circles.map((i) => {
          const isFilled = i < visits;
          const isTarget = i === targetVisits - 1;
          const isLastFilled = isFilled && i === visits - 1; // Highlight exactly the newest coupon
          
          return (
            <Box
              key={i}
              component={motion.div}
              initial={false}
              animate={{
                scale: isLastFilled ? [1, 1.8, 1.2, 1.1, 1] : (isFilled ? 1 : 1),
                rotate: isLastFilled ? [0, -15, 15, -10, 10, 0] : 0,
                backgroundColor: isFilled ? '#FFC107' : '#2A2A2A'
              }}
              transition={{ duration: isLastFilled ? 1 : 0.4, ease: "backOut" }}
              sx={{
                width: { xs: 42, sm: 48 },
                height: { xs: 42, sm: 48 },
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: isLastFilled ? '0 0 35px rgba(255, 193, 7, 0.9), 0 0 15px rgba(255, 193, 7, 1)' : (isFilled ? '0 0 15px rgba(255, 193, 7, 0.5)' : 'none'),
                border: isFilled ? 'none' : '2px dashed rgba(255,255,255,0.2)',
                zIndex: isLastFilled ? 10 : 1,
                position: 'relative'
              }}
            >
              {isTarget ? (
                <FastfoodIcon sx={{ color: isFilled ? '#1A1A1A' : 'rgba(255,255,255,0.3)', transform: isLastFilled ? 'scale(1.2)' : 'scale(1)' }} />
              ) : (
                <LocalActivityIcon sx={{ color: isFilled ? '#1A1A1A' : 'rgba(255,255,255,0.1)', transform: isLastFilled ? 'scale(1.2)' : 'scale(1)' }} />
              )}
            </Box>
          );
        })}
      </Box>

      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'primary.main', fontWeight: 'bold' }}>
        {visits >= targetVisits 
          ? '¡Ya podés retirar tu hamburguesa gratis!' 
          : `¡Te faltan solo ${Math.max(0, targetVisits - visits)} visitas para tu hamburguesa GRATIS!`}
      </Typography>
    </Box>
  );
}
