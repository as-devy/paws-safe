"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type SelectFieldProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  defaultValue?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  value?: string;
  "aria-describedby"?: string;
  "aria-label"?: string;
};

export function SelectField({
  children,
  className,
  contentClassName,
  id,
  placeholder,
  "aria-describedby": ariaDescribedby,
  "aria-label": ariaLabel,
  ...rootProps
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const keepPageScrollable = () => {
      if (
        document.body.style.getPropertyValue("overflow-y") !== "auto" ||
        document.body.style.getPropertyPriority("overflow-y") !== "important"
      ) {
        document.body.style.setProperty("overflow-y", "auto", "important");
      }
      if (
        document.body.style.getPropertyValue("padding-right") !== "0px" ||
        document.body.style.getPropertyPriority("padding-right") !== "important"
      ) {
        document.body.style.setProperty("padding-right", "0", "important");
      }
    };

    if (!open) return;

    keepPageScrollable();
    const observer = new MutationObserver(keepPageScrollable);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      observer.disconnect();
      document.body.style.removeProperty("overflow-y");
      document.body.style.removeProperty("padding-right");
    };
  }, [open]);

  return (
    <Select.Root open={open} onOpenChange={setOpen} {...rootProps}>
      <Select.Trigger
        id={id}
        aria-describedby={ariaDescribedby}
        aria-label={ariaLabel}
        className={joinClasses("site-select__trigger", className)}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="site-select__icon">
          <ChevronDown aria-hidden />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className={joinClasses("site-select__content", contentClassName)}
        >
          <Select.ScrollUpButton className="site-select__scroll-button">
            <ChevronUp aria-hidden />
          </Select.ScrollUpButton>
          <Select.Viewport className="site-select__viewport">
            {children}
          </Select.Viewport>
          <Select.ScrollDownButton className="site-select__scroll-button">
            <ChevronDown aria-hidden />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export function SelectItem({
  children,
  value,
  disabled,
}: {
  children: ReactNode;
  value: string;
  disabled?: boolean;
}) {
  return (
    <Select.Item disabled={disabled} value={value} className="site-select__item">
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="site-select__item-indicator">
        <Check aria-hidden />
      </Select.ItemIndicator>
    </Select.Item>
  );
}
