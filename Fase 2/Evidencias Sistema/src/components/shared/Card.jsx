export default function Card({ children, className = "", variant = "default", hover = true, ...props }) {
  const baseClasses = "bg-white rounded-xl border border-gray-100"

  const variants = {
    default: "shadow-sm",
    elevated: "shadow-lg",
    interactive: hover ? "shadow-sm hover:shadow-md transition-shadow cursor-pointer" : "shadow-sm",
  }

  const classes = `${baseClasses} ${variants[variant]} ${className}`

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}