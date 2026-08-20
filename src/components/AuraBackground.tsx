export default function AuraBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 aura-grid" />
      <div className="absolute inset-0 aura-glow" />
      <div className="absolute inset-0 aura-points" />
    </div>
  )
}
