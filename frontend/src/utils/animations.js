/**
 * Animation Utilities and Constants
 * Centralized animation configurations for consistent motion design
 * Following IBM Carbon Design System motion principles
 */

// Animation Durations (in milliseconds)
export const DURATION = {
  fast: 110,      // Micro-interactions
  moderate: 240,  // Standard transitions
  slow: 400,      // Complex animations
  slower: 700,    // Page transitions
};

// Easing Functions (IBM Carbon Design System)
export const EASING = {
  standard: 'cubic-bezier(0.2, 0, 0.38, 0.9)',      // Standard productive motion
  entrance: 'cubic-bezier(0, 0, 0.38, 0.9)',        // Entrance animations
  exit: 'cubic-bezier(0.2, 0, 1, 0.9)',             // Exit animations
  expressive: 'cubic-bezier(0.4, 0.14, 0.3, 1)',    // Expressive motion
};

// Framer Motion Variants for common animations
export const fadeInUp = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: DURATION.moderate / 1000,
      ease: [0.2, 0, 0.38, 0.9]
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: DURATION.fast / 1000,
      ease: [0.2, 0, 1, 0.9]
    }
  }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: DURATION.moderate / 1000,
      ease: [0.2, 0, 0.38, 0.9]
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: DURATION.fast / 1000,
      ease: [0.2, 0, 1, 0.9]
    }
  }
};

export const scaleIn = {
  initial: { 
    opacity: 0, 
    scale: 0.95 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: DURATION.moderate / 1000,
      ease: [0.2, 0, 0.38, 0.9]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: {
      duration: DURATION.fast / 1000,
      ease: [0.2, 0, 1, 0.9]
    }
  }
};

export const slideInRight = {
  initial: { 
    opacity: 0, 
    x: 50 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: DURATION.moderate / 1000,
      ease: [0.2, 0, 0.38, 0.9]
    }
  },
  exit: { 
    opacity: 0, 
    x: -50,
    transition: {
      duration: DURATION.fast / 1000,
      ease: [0.2, 0, 1, 0.9]
    }
  }
};

export const slideInLeft = {
  initial: { 
    opacity: 0, 
    x: -50 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: DURATION.moderate / 1000,
      ease: [0.2, 0, 0.38, 0.9]
    }
  },
  exit: { 
    opacity: 0, 
    x: 50,
    transition: {
      duration: DURATION.fast / 1000,
      ease: [0.2, 0, 1, 0.9]
    }
  }
};

// Stagger children animation
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Pulse animation for attention-grabbing elements
export const pulse = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// Loading skeleton shimmer effect
export const shimmer = {
  backgroundPosition: ['200% 0', '-200% 0'],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "linear"
  }
};

// Gauge animation (for trust score)
export const gaugeAnimation = (score) => ({
  initial: { 
    strokeDashoffset: 753.98 // Full circumference (2 * PI * 120)
  },
  animate: { 
    strokeDashoffset: 753.98 - (score / 100) * 753.98,
    transition: {
      duration: 1.5,
      ease: [0.4, 0.14, 0.3, 1] // Expressive easing
    }
  }
});

// Number counter animation
export const counterAnimation = (from, to, duration = 1500) => {
  return {
    from,
    to,
    duration,
    ease: [0.4, 0.14, 0.3, 1]
  };
};

// Spring animation config for interactive elements
export const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

// Hover animation for cards and buttons
export const hoverScale = {
  scale: 1.02,
  transition: {
    duration: DURATION.fast / 1000,
    ease: [0.2, 0, 0.38, 0.9]
  }
};

// Tap animation for buttons
export const tapScale = {
  scale: 0.98,
  transition: {
    duration: DURATION.fast / 1000,
    ease: [0.2, 0, 0.38, 0.9]
  }
};

/**
 * CSS Animation Classes
 * For use with className when Framer Motion is not needed
 */
export const CSS_ANIMATIONS = {
  fadeIn: 'animate-fade-in',
  fadeInUp: 'animate-fade-in-up',
  slideInRight: 'animate-slide-in-right',
  slideInLeft: 'animate-slide-in-left',
  scaleIn: 'animate-scale-in',
  pulse: 'animate-pulse',
  shimmer: 'animate-shimmer',
  spin: 'animate-spin',
};

/**
 * Helper function to create staggered animations
 */
export const createStaggeredAnimation = (itemCount, baseDelay = 0.1) => {
  return Array.from({ length: itemCount }, (_, i) => ({
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: i * baseDelay,
        duration: DURATION.moderate / 1000,
        ease: [0.2, 0, 0.38, 0.9]
      }
    }
  }));
};

/**
 * Helper function for loading skeleton animations
 */
export const createSkeletonAnimation = () => ({
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "linear"
  }
});

export default {
  DURATION,
  EASING,
  fadeInUp,
  fadeIn,
  scaleIn,
  slideInRight,
  slideInLeft,
  staggerContainer,
  pulse,
  shimmer,
  gaugeAnimation,
  counterAnimation,
  springConfig,
  hoverScale,
  tapScale,
  CSS_ANIMATIONS,
  createStaggeredAnimation,
  createSkeletonAnimation,
};

// Made with Bob
