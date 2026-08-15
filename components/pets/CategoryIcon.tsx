import { Bird, Cat, Dog, Fish, PawPrint, Rabbit } from "lucide-react";

const ICONS = {
  all: PawPrint,
  dog: Dog,
  cat: Cat,
  rabbit: Rabbit,
  bird: Bird,
  fish: Fish,
  other: PawPrint,
} as const;

type CategoryIconProps = {
  category: string;
  className?: string;
};

export default function CategoryIcon({
  category,
  className = "h-4 w-4",
}: CategoryIconProps) {
  const Icon =
    ICONS[category as keyof typeof ICONS] ?? PawPrint;

  return <Icon className={className} strokeWidth={2.15} aria-hidden />;
}
