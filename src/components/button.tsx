import clsx from "clsx"
import React from "react"
import "./css/button.css"

type TButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode
  variant?: "outline" | "default"
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "none"
  icon?: string
  iconPosition?: "left" | "right"
  isLoading?: boolean
  loadingText?: string
  size?: "sm" | "md" | "lg"
}

const Button = ({
  children,
  variant = "default",
  color = "primary",
  icon,
  iconPosition = "left",
  isLoading = false,
  loadingText = "Loading...",
  disabled = false,
  className,
  size = "md",
  ...rest
}: TButtonProps) => {
  const colorClass = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-black",
    success: "bg-success text-white",
    danger: "bg-danger text-white",
    warning: "bg-warning text-dark",
    none: "text-dark",
  }

  const buttonClasses = clsx(
    "btn",
    variant === "outline"
      ? `btn-outline border-${color} text-${color}`
      : colorClass[color],
    isLoading && "cursor-not-allowed active",
    disabled && "cursor-not-allowed bg-muted-background text-black opacity-50",
    `btn-${size}`,
    className
  )

  return (
    <button
      className={buttonClasses}
      disabled={isLoading || disabled}
      {...rest}
    >
      {isLoading && <span className="spinner"></span>}
      {icon && iconPosition === "left" && (
        <img
          src={icon}
          width={"15px"}
          height={"15px"}
          alt={`btn-${icon}`}
          className="icon-left"
        />
      )}
      {isLoading ? loadingText : children && children}
      {icon && iconPosition === "right" && (
        <img src={icon} alt={`btn-${icon}`} className="icon-left" />
      )}
    </button>
  )
}

export default Button
