import React from 'react'

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    className = '',
    ...props
}) => {

    const baseStyles = 'font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 font-text';
    const variantStyles = {
        primary: 'bg-primary text-secondary hover:bg-primary-dark focus:ring-primary',
        secondary: 'bg-neutral-light text-neutral-dark hover:bg-neutral focus:ring-neutral',
        danger: 'bg-error text-secondary hover:bg-error/90 focus:ring-error',
        success: 'bg-success text-secondary hover:bg-success/90 focus:ring-success',
        warning: 'bg-warning text-neutral-dark hover:bg-warning/90 focus:ring-warning',
    };

    const sizeStyles = {
        small: 'px-3 py-1 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
    };

    const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`;
    return (
        <button className={classes} disabled={disabled} {...props}>
            {children}
        </button>
    )
}

export default Button