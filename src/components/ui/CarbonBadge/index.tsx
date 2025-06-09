import React from 'react'
import { motion } from 'framer-motion'

interface CarbonBadgeProps {
  savings: number // kg de CO2 ahorrados
  totalEmissions?: number // kg de CO2 total
  vehicleType?: 'electric' | 'hybrid' | 'diesel' | 'gas'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

const vehicleIcons = {
  electric: '⚡',
  hybrid: '🔋',
  diesel: '⛽',
  gas: '⛽'
}

const vehicleColors = {
  electric: 'text-green-600 bg-green-50 border-green-200',
  hybrid: 'text-blue-600 bg-blue-50 border-blue-200',
  diesel: 'text-gray-600 bg-gray-50 border-gray-200',
  gas: 'text-orange-600 bg-orange-50 border-orange-200'
}

export const CarbonBadge: React.FC<CarbonBadgeProps> = ({
  savings,
  totalEmissions,
  vehicleType = 'electric',
  size = 'md',
  animated = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  }

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  }

  const reductionPercentage = totalEmissions ? (savings / totalEmissions) * 100 : 0

  const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  }

  const BadgeContent = () => (
    <div className={`
      inline-flex items-center gap-2 rounded-full border 
      ${vehicleColors[vehicleType]} 
      ${sizeClasses[size]} 
      ${className}
      font-medium shadow-sm
    `}>
      <span className={iconSizes[size]}>
        {vehicleIcons[vehicleType]}
      </span>
      
      <div className="flex items-center gap-1">
        <span className="font-bold text-green-600">
          -{savings.toFixed(1)}
        </span>
        <span className="text-gray-600 text-xs">
          kg CO₂
        </span>
      </div>

      {reductionPercentage > 0 && (
        <div className="flex items-center gap-1 ml-1 px-2 py-0.5 bg-green-100 rounded-full">
          <span className="text-xs font-semibold text-green-700">
            -{reductionPercentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  )

  if (animated) {
    return (
      <motion.div
        variants={badgeVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        <BadgeContent />
      </motion.div>
    )
  }

  return <BadgeContent />
}

export default CarbonBadge 