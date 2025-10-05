import React from 'react'
import { cn } from '@/utilts/cn'
import { useContextMenu } from './ContextMenu'

interface ContextMenuItemProps {
    children: React.ReactNode
    onClick?: (e: React.MouseEvent) => void
    icon?: React.ReactNode
    className?: string
    disabled?: boolean
    danger?: boolean
    closeOnClick?: boolean
}

export const ContextMenuItem = ({
    children,
    onClick,
    icon,
    className,
    disabled = false,
    danger = false,
    closeOnClick = true
}: ContextMenuItemProps) => {
    const { closeMenu } = useContextMenu()

    const handleClick = (e: React.MouseEvent) => {
        if (disabled) return
        onClick?.(e)
        if (closeOnClick) {
            closeMenu()
        }
    }

    return (
        <div
            className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-xs font-bold cursor-pointer transition-colors',
                'hover:bg-gray-700',
                {
                    'opacity-50 cursor-not-allowed': disabled,
                    'text-[#EF454A] hover:bg-[#EF454A10]': danger && !disabled,
                    'text-gray-300': !danger && !disabled
                },
                className
            )}
            onClick={handleClick}
        >
            {icon && <span className="w-4 h-4">{icon}</span>}
            {children}
        </div>
    )
}

export const ContextMenuSeparator = ({ className }: { className?: string }) => {
    return (
        <div className={cn('h-px bg-[#23252D] my-1', className)} />
    )
} 