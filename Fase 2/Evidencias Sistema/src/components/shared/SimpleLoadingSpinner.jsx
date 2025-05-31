export function SimpleLoadingSpinner({ size = "md", color = "emerald" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const colorClasses = {
    emerald: "border-emerald-500",
    teal: "border-teal-500",
    blue: "border-blue-500",
    gray: "border-gray-500",
  }

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-200`}></div>
        <div
          className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-4 ${colorClasses[color]} border-t-transparent animate-spin`}
        ></div>
      </div>
    </div>
  )
}