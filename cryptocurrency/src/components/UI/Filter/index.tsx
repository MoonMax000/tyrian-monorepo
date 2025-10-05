import { FC } from "react";
import clsx from "clsx";
import Paper from "@/components/Paper";

type FilterOption = {
    label: string;
    value: string;
    profitability?: number;
};

type FilterProps = {
    variant?: "v1" | "v2" | "v3";
    direction?: "row" | "column";
    options: FilterOption[];
    active: string;
    onChange: (value: string) => void;
    className?: string;
};

const Filter: FC<FilterProps> = ({
    variant = "v1",
    direction = "row",
    options,
    active,
    onChange,
    className,
}) => {
    return (
        <Paper
            className={clsx(
                "p-2 rounded-2xl w-fit bg-transparent",
                direction === "row" ? "flex flex-row gap-2" : "flex flex-col gap-2",
                "min-w-[120px]",
                className
            )}
        >
            {options.map((opt) => {
                const isActive = opt.value === active;

                const baseClasses =
                    "cursor-pointer px-3 py-2 rounded flex items-center justify-between transition-all text-body-12";

                const variantStyles = {
                    v1: clsx(
                        "bg-moonlessNight",
                        isActive
                            ? "!bg-purple text-white"
                            : "text-webGray hover:bg-white hover:text-black"
                    ),
                    v2: clsx(
                        "text-webGray justify-start gap-2",
                        isActive
                            ? "bg-[#253044]"
                            : "bg-[#253044] hover:bg-white hover:text-black"
                    ),
                    v3: clsx(
                        "bg-moonlessNight",
                        isActive
                            ? "!bg-purple text-white"
                            : "text-webGray hover:bg-white hover:text-black"
                    ),
                };

                return (
                    <div
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={clsx(baseClasses, variantStyles[variant])}
                    >
                        {variant === "v2" && (
                            <span
                                className={clsx(
                                    "w-[8px] h-[8px] rounded-full border-2 border-blue",
                                    isActive ? "bg-blue" : "bg-transparent"
                                )}
                            />
                        )}

                        <span>{opt.label}</span>

                        {variant === "v1" && opt.profitability !== undefined && (
                            <span
                                className={clsx(
                                    "text-body-12 whitespace-nowrap ml-5",
                                    opt.profitability > 0
                                        ? isActive
                                            ? "text-white"
                                            : "text-green"
                                        : isActive
                                            ? "text-white"
                                            : "text-red"
                                )}
                            >
                                {opt.profitability?.toFixed(2)}% / year
                            </span>
                        )}
                    </div>
                );
            })}
        </Paper>
    );
};

export default Filter;
