"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export type RequestSelectOption = {
  value: string;
  label: string;
};

type RequestSelectProps = {
  name: string;
  options: RequestSelectOption[];
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  describedBy?: string;
};

export default function RequestSelect({
  name,
  options,
  placeholder = "Select an option",
  defaultValue = "",
  required = false,
  describedBy,
}: RequestSelectProps) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (!open) return;

    function place() {
      const trigger = buttonRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const menuHeight = Math.min(options.length * 44 + 12, 260);
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < menuHeight && rect.top > spaceBelow;

      setMenuStyle({
        position: "fixed",
        left: rect.left,
        width: rect.width,
        top: openUp ? undefined : rect.bottom + 6,
        bottom: openUp ? window.innerHeight - rect.top + 6 : undefined,
        zIndex: 130,
      });
    }

    place();

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown, true);

    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open, options.length]);

  return (
    <div className="request-select" ref={rootRef}>
      <input type="hidden" name={name} value={value} required={required} />
      <button
        ref={buttonRef}
        type="button"
        className={`request-select__trigger${value ? "" : " is-placeholder"}${open ? " is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-describedby={describedBy}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected?.label ?? placeholder}</span>
        <ChevronDown className="request-select__chevron" aria-hidden />
      </button>

      {open
        ? createPortal(
            <ul
              ref={menuRef}
              id={listId}
              className="request-select__menu"
              style={menuStyle}
              role="listbox"
              aria-label={placeholder}
            >
              {options.map((option) => {
                const isActive = option.value === value;
                return (
                  <li key={option.value} role="none">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      className={`request-select__option${isActive ? " is-active" : ""}`}
                      onClick={() => {
                        setValue(option.value);
                        setOpen(false);
                      }}
                    >
                      <span>{option.label}</span>
                      {isActive ? <Check className="h-4 w-4" aria-hidden /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}
