import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface Option {
    label: string;
    value: any;
}

interface SearchableDropdownProps {
    options: Option[];
    value: any;
    onValueChange: (value: any) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    className?: string;
    multiple?: boolean;
    showChevron?: boolean;
    allowClear?: boolean;
}

export function SearchableDropdown({
    options = [],
    value,
    onValueChange,
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    emptyMessage = "No option found.",
    disabled = false,
    className,
    multiple = false,
    showChevron = false,
    allowClear = true,
}: SearchableDropdownProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = options.filter((option) =>
        String(option.label || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (optionValue: any) => {
        if (multiple) {
            const currentValues = Array.isArray(value) ? value : [];
            const isSelected = currentValues.includes(optionValue);
            let newValues;
            if (isSelected) {
                newValues = currentValues.filter((v: any) => v !== optionValue);
            } else {
                newValues = [...currentValues, optionValue];
            }
            onValueChange(newValues);
            inputRef.current?.focus();
        } else {
            onValueChange(optionValue);
            setOpen(false);
            setSearchQuery("");
        }
    };

    const handleRemove = (e: React.MouseEvent, optionValue: any) => {
        e.stopPropagation();
        if (multiple) {
            const currentValues = Array.isArray(value) ? value : [];
            const newValues = currentValues.filter((v: any) => v !== optionValue);
            onValueChange(newValues);
        } else {
            onValueChange("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            e.key === "Backspace" &&
            searchQuery === "" &&
            multiple &&
            Array.isArray(value) &&
            value.length > 0
        ) {
            // Remove last item
            const newValues = [...value];
            newValues.pop();
            onValueChange(newValues);
        }
    };

    // Logic to display selected items
    const selectedLabels = React.useMemo(() => {
        if (multiple) {
            return (Array.isArray(value) ? value : []).map((v: any) => {
                return options.find((o) => String(o.value) === String(v)) || { label: String(v), value: v };
            });
        } else {
            const found = options.find((o) => String(o.value) === String(value));
            return found ? [found] : [];
        }
    }, [value, multiple, options]);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setSearchQuery("");
        }
    };

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <div
                    className={cn(
                        "flex w-full items-center gap-1 rounded-2xl border border-slate-800 bg-white px-5 py-[0.4rem] text-[1rem] shadow-sm ring-offset-background cursor-text focus-within:border-accent-teal transition-all duration-300",
                        disabled && "cursor-not-allowed opacity-50",
                        multiple ? "flex-wrap" : "flex-nowrap overflow-hidden",
                        className
                    )}
                    onClick={(e) => {
                        if (!disabled) {
                            e.stopPropagation();
                            setOpen(true);
                            inputRef.current?.focus();
                        }
                    }}
                >
                    {multiple &&
                        selectedLabels.map((option: any) => (
                            <Badge
                                key={option.value}
                                variant="secondary"
                                className="mr-1 mb-0.5"
                            >
                                {option.label}
                                <button
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleRemove(e as any, option.value);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={(e) => handleRemove(e, option.value)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        ))}

                    <div className={cn("flex-1 relative overflow-hidden", multiple ? "min-w-[120px]" : "min-w-[50px]")}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={open ? searchQuery : (!multiple && selectedLabels.length > 0 ? selectedLabels[0].label : searchQuery)}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearchQuery(val);
                                if (!open) setOpen(true);
                                e.stopPropagation();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={!multiple && selectedLabels.length > 0 ? "" : placeholder}
                            disabled={disabled}
                            className="w-full bg-transparent outline-none placeholder:text-slate-600 text-black h-full min-h-[1.5rem]"
                        />
                    </div>
                    <div className="flex items-center flex-nowrap shrink-0 gap-1">
                        {!multiple && allowClear && value && !disabled && (
                            <button
                                type="button"
                                className="p-1 hover:bg-muted rounded-full transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onValueChange("");
                                    setSearchQuery("");
                                }}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                        {showChevron && <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 text-muted-foreground" />}
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <Command shouldFilter={false}>
                    <CommandList>
                        {filteredOptions.length === 0 ? (
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {filteredOptions.map((option) => {
                                    const isSelected = multiple
                                        ? Array.isArray(value) && value.some(v => String(v) === String(option.value))
                                        : String(value) === String(option.value);
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            onSelect={() => handleSelect(option.value)}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    isSelected ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {option.label}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
