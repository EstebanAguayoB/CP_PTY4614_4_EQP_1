export default function DecorativeBackground({ variant = "default" }) {
  const variants = {
    default: {
      circles: [
        "absolute -top-40 -left-40 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-blob",
        "absolute top-1/2 -right-40 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-3000",
        "absolute bottom-20 left-1/3 w-64 h-64 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-5000",
      ],
      pattern: "bg-grid-pattern opacity-8",
      elements: [
        "absolute top-24 left-24 w-6 h-6 bg-teal-200 rounded-full opacity-25 animate-float",
        "absolute bottom-32 right-24 w-8 h-8 bg-emerald-200 rounded-lg rotate-45 opacity-20 animate-float-delayed",
        "absolute top-1/3 left-1/4 w-4 h-4 bg-cyan-200 rotate-12 opacity-25 animate-pulse",
      ],
    },
    dashboard: {
      circles: [
        "absolute -top-60 -right-60 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob",
        "absolute top-1/3 -left-60 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000",
        "absolute bottom-0 right-1/3 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-blob animation-delay-4000",
      ],
      pattern: "bg-dot-pattern opacity-10",
      elements: [
        "absolute top-32 right-32 w-8 h-8 bg-emerald-200 rounded-lg rotate-45 opacity-20 animate-float",
        "absolute bottom-40 left-32 w-6 h-6 bg-teal-200 rounded-full opacity-25 animate-float-delayed",
        "absolute top-2/3 right-1/4 w-4 h-4 bg-cyan-200 rotate-12 opacity-20 animate-pulse",
      ],
    },
    login: {
      circles: [
        "absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob",
        "absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000",
        "absolute top-40 left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000",
      ],
      pattern: "bg-dot-pattern opacity-20",
      elements: [
        "absolute top-20 right-20 w-16 h-16 bg-emerald-300 rounded-lg rotate-45 opacity-30 animate-float",
        "absolute bottom-32 left-20 w-12 h-12 bg-teal-300 rounded-full opacity-40 animate-float-delayed",
        "absolute top-1/2 right-1/4 w-8 h-8 bg-cyan-300 rotate-12 opacity-30 animate-pulse",
      ],
    },
  }

  const config = variants[variant] || variants.default

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Círculos decorativos */}
      {config.circles.map((className, index) => (
        <div key={`circle-${index}`} className={className}></div>
      ))}

      {/* Patrón de fondo */}
      <div className={`absolute inset-0 ${config.pattern}`}></div>

      {/* Elementos geométricos */}
      {config.elements.map((className, index) => (
        <div key={`element-${index}`} className={className}></div>
      ))}
    </div>
  )
}
