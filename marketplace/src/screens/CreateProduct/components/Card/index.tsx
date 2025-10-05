"use client"
import React, { useState } from "react";
import Switch from "./Switch";

type CardProps = {
    children?: React.ReactNode;
    className?: string;
    title: string;
    disableBorders?: boolean;
    hasOutline?: boolean;
    hasSwitch?: boolean;
};

export default function Card({ children, className = "", title, hasSwitch = false, hasOutline = false, disableBorders = false }: CardProps) {
    const [isActive, setIsActive] = useState(true);

    return (
        <div className={`custom-bg-blur ${disableBorders ? '' : 'p-4 rounded-2xl border border-regaliaPurple'} ${className}`}>
            <div className={`flex justify-between ${children ? 'mb-4' : ''} ${hasOutline ? 'border-b pb-4 border-regaliaPurple' : ''}`}>
                <span className="text-primary text-[19px] font-semibold leading-[26px]">{title}</span>
                {hasSwitch && <Switch checked={isActive} onChange={setIsActive} />}
            </div>

            <div>
                {children}
            </div>
        </div>
    );
}