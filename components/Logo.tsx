import Image from "next/image";

type LogoProps = {
  className?: string;
  priority?: boolean;
  size?: "header" | "hero" | "footer";
};

const configs = {
  header: {
    icon: "h-10 w-auto sm:h-11 lg:h-12",
    title: "text-xl sm:text-2xl",
    subtitle: "text-[0.65rem] sm:text-xs",
    gap: "gap-3",
  },
  hero: {
    icon: "h-14 w-auto sm:h-16 lg:h-20",
    title: "text-3xl sm:text-4xl lg:text-5xl",
    subtitle: "text-sm sm:text-base",
    gap: "gap-4",
  },
  footer: {
    icon: "h-9 w-auto sm:h-10",
    title: "text-lg sm:text-xl",
    subtitle: "text-[0.65rem]",
    gap: "gap-2.5",
  },
} as const;

export function Logo({
  className = "",
  priority = false,
  size = "header",
}: LogoProps) {
  const cfg = configs[size];

  return (
    <span
      className={`inline-flex items-center ${cfg.gap} ${className}`}
      role="img"
      aria-label="Nexora Systems"
    >
      <Image
        src="/images/logo-icon.png"
        alt=""
        width={240}
        height={176}
        className={`object-contain ${cfg.icon}`}
        priority={priority}
        aria-hidden
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-bold tracking-tight text-on-surface ${cfg.title}`}
        >
          Nexora
        </span>
        <span
          className={`mt-1 font-medium uppercase tracking-[0.22em] text-secondary ${cfg.subtitle}`}
        >
          Systems
        </span>
      </span>
    </span>
  );
}
