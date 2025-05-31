export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  icon: Icon,
  iconPosition = "left",
  ...props
}) {
  const baseClasses =
    "font-medium rounded-lg transition-all duration-300 inline-flex items-center justify-center space-x-2"

  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    secondary: "bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <button className={classes} {...props}>
      {Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
      <span>{children}</span>
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
    </button>
  )
}
