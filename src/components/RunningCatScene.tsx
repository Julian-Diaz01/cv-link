import { useState, useEffect, Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Model } from './Model.tsx'

export default function RunningCatScene() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [facingRight, setFacingRight] = useState(true)
  const [targetRotation, setTargetRotation] = useState(Math.PI / 2)
  const [currentRotation, setCurrentRotation] = useState(Math.PI / 2)
  const [screenWidth, setScreenWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const previousPositionRef = useRef<number>(0)
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentRotationRef = useRef<number>(Math.PI / 2)
  const isTurningRef = useRef<boolean>(false)
  const isDark = true

  // Track screen width for responsive design
  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth)
    }

    updateScreenWidth()
    window.addEventListener('resize', updateScreenWidth)
    return () => window.removeEventListener('resize', updateScreenWidth)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Check if the scene is fully visible
      const isFullyVisible = rect.top >= 0 && rect.bottom <= windowHeight

      if (isFullyVisible) {
        // Calculate progress based on how far we've scrolled past the point where scene became fully visible
        const scrolledPastFullView =
          window.scrollY -
          (containerRef.current.offsetTop - windowHeight + rect.height)
        const scrollRange = windowHeight // Use viewport height as the scroll range for animation
        const progress = Math.max(
          0,
          Math.min(1, scrolledPastFullView / scrollRange),
        )

        setScrollProgress(progress)
      } else if (rect.top > windowHeight) {
        // Scene hasn't entered view yet
        setScrollProgress(0)
      } else if (rect.bottom < 0) {
        // Scene has scrolled past
        setScrollProgress(1)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Call once on mount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Calculate horizontal position based on scroll progress (full screen width)
  // Cat moves across the visible viewport from left to right
  // Viewport width in 3D space depends on camera distance and FOV
  const baseViewportWidth = 25 // Approximate viewport width at camera distance
  const viewportWidth =
    screenWidth < 640
      ? baseViewportWidth * 1.2
      : screenWidth < 1024
        ? baseViewportWidth * 1.1
        : baseViewportWidth

  const startX = -viewportWidth // Start at leftmost edge
  const endX = viewportWidth * 2 // End at rightmost edge
  const horizontalPosition = startX + scrollProgress * (endX - startX)

  // Initialize previous position ref when viewport changes
  useEffect(() => {
    previousPositionRef.current = startX
  }, [startX])

  // Check if position has changed to determine if cat should be running or idle
  useEffect(() => {
    const positionChanged =
      Math.abs(horizontalPosition - previousPositionRef.current) > 0.01

    if (positionChanged) {
      // Position is changing - cat should run
      setIsMoving(true)

      // Determine direction of movement
      const movingRight = horizontalPosition > previousPositionRef.current
      const directionChanged = movingRight !== facingRight

      if (directionChanged && !isTurningRef.current) {
        // Only allow turn if not currently turning AND cat is moving
        // Set target rotation to face the correct direction
        const newRotation = movingRight ? Math.PI / 2 : -Math.PI / 2

        isTurningRef.current = true
        setTargetRotation(newRotation)
        setFacingRight(movingRight)
      }

      previousPositionRef.current = horizontalPosition

      // Clear existing timeout
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current)
      }

      // Set timeout to switch to idle after position stops changing
      moveTimeoutRef.current = setTimeout(() => {
        // Helper function to check if rotation is at a stable facing angle
        const isAtStableFacingAngle = (rotation: number) => {
          // Normalize rotation to -π to π range
          const normalized =
            ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
          const adjusted =
            normalized > Math.PI ? normalized - Math.PI * 2 : normalized

          // Check if facing right (π/2) or left (-π/2) within a small tolerance
          const facingRight = Math.abs(adjusted - Math.PI / 2) < 0.1
          const facingLeft = Math.abs(adjusted + Math.PI / 2) < 0.1

          return facingRight || facingLeft
        }

        // Only go idle if turn is complete AND at stable angle
        if (
          !isTurningRef.current &&
          isAtStableFacingAngle(currentRotationRef.current)
        ) {
          setIsMoving(false)
        } else {
          // Re-check after a short delay to allow turn to finish
          const idleCheckInterval = setInterval(() => {
            if (
              !isTurningRef.current &&
              isAtStableFacingAngle(currentRotationRef.current)
            ) {
              setIsMoving(false)
              clearInterval(idleCheckInterval)
            }
          }, 50)

          // Failsafe: force idle after 3 seconds (increased from 2)
          setTimeout(() => {
            clearInterval(idleCheckInterval)
            if (isMoving) {
              setIsMoving(false)
              isTurningRef.current = false
            }
          }, 3000)
        }
      }, 150)
    }

    return () => {
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current)
      }
    }
  }, [horizontalPosition, facingRight, isMoving])

  // Smooth rotation transition with natural easing
  useEffect(() => {
    // Only animate rotation when moving, lock rotation when idle
    if (!isMoving && !isTurningRef.current) {
      // Snap rotation to proper facing angle when idle
      const normalized =
        ((targetRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
      const adjusted =
        normalized > Math.PI ? normalized - Math.PI * 2 : normalized

      // Snap to closest proper angle (π/2 for right, -π/2 for left)
      const snappedRotation = adjusted > 0 ? Math.PI / 2 : -Math.PI / 2

      setCurrentRotation(snappedRotation)
      currentRotationRef.current = snappedRotation
      return
    }

    const rotationSpeed = 0.12 // Slightly slower for more natural feel

    const animateRotation = () => {
      setCurrentRotation((current) => {
        const diff = targetRotation - current
        if (Math.abs(diff) < 0.01) {
          // Turn is complete - allow new turns
          if (isTurningRef.current) {
            isTurningRef.current = false
          }

          // Normalize rotation to keep it within a reasonable range
          const normalized =
            ((targetRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
          const finalRotation =
            normalized > Math.PI ? normalized - Math.PI * 2 : normalized
          currentRotationRef.current = finalRotation
          return finalRotation
        }
        const newRotation = current + diff * rotationSpeed
        currentRotationRef.current = newRotation
        return newRotation
      })
    }

    const interval = setInterval(animateRotation, 16) // ~60fps
    return () => clearInterval(interval)
  }, [targetRotation, isMoving])

  const modelRotation: [number, number, number] = [0, currentRotation, 0]
  const modelPath = isMoving ? '/cat_run.glb' : '/cat_idle.glb'

  // Fixed camera position (doesn't follow the cat)
  const cameraX = 0
  const cameraY = 2
  const cameraZ = 12

  // Adjust FOV based on screen width for better responsiveness
  const fov = screenWidth < 640 ? 70 : screenWidth < 1024 ? 65 : 60

  return (
    <div
      ref={containerRef}
      className="w-full h-[200px] sm:h-[250px] md:h-[300px] relative rounded-lg overflow-hidden"
    >
      <Canvas
        key="running-cat-scene"
        gl={{ preserveDrawingBuffer: true }}
        dpr={[1, 2]}
        eventSource={containerRef.current || undefined}
        eventPrefix="offset"
        camera={{ position: [cameraX, cameraY, cameraZ], fov: fov }}
        frameloop="always"
      >
        <ambientLight intensity={0} />
        <directionalLight position={[10, 10, 5]} intensity={0} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        <group
          position={[horizontalPosition, 1, 0]}
          scale={0.1}
          key="running-cat-group"
        >
          <Suspense fallback={null}>
            <Model
              key={`running-cat-model-${modelPath}`}
              modelPath={modelPath}
              particleColor="#00ffff"
              meshColor="#F3F3F3"
              meshOpacity={0.05}
              particleSize={0.2}
              sampleRate={1}
              animated={isDark ? true : false}
              showMesh={true}
              rotation={modelRotation}
              autoRotate={false}
              interactive={false}
              use3DGradient={true}
              gradientColors={
                isDark
                  ? [
                      { color: '#FF9101', position: [1, 1, 1] },
                      { color: '#00F7FF', position: [0, 0, 1] },
                    ]
                  : [
                      { color: '#FF4800', position: [1, 0, 0] },
                      { color: '#003BDD', position: [0, 0, 1] },
                    ]
              }
              gradientBlendPower={2.0}
              playAnimation={true}
              animationIndex={0}
            />
          </Suspense>
        </group>
      </Canvas>
    </div>
  )
}
