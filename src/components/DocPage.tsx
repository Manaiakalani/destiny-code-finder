import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function DocTitle({ title, lede, meta }: { title: string; lede: string; meta?: string }) {
  return (
    <header>
      <h1 className="font-heading text-4xl font-bold text-balance text-foreground title-shadow md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{lede}</p>
      {meta ? <p className="mt-2 text-sm text-muted-foreground">{meta}</p> : null}
    </header>
  );
}

export function DocSections({ children }: { children: ReactNode }) {
  return <div className="mt-12 space-y-10">{children}</div>;
}

export function DocSection({ children }: { children: ReactNode }) {
  return <section className="border-t border-border/40 pt-8">{children}</section>;
}

export function DocHeading({ icon: Icon, tone = 'text-accent', children }: { icon?: LucideIcon; tone?: string; children: ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-3 font-heading text-xl font-bold text-balance md:text-2xl">
      {Icon ? <Icon className={`h-5 w-5 shrink-0 ${tone}`} aria-hidden="true" /> : null}
      {children}
    </h2>
  );
}

export function DocProse({ children }: { children: ReactNode }) {
  return <div className="space-y-4 text-muted-foreground">{children}</div>;
}

export function DocBullets({ children }: { children: ReactNode }) {
  return <ul className="space-y-2">{children}</ul>;
}

export function DocBullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-strand" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

export function DocRows({ children }: { children: ReactNode }) {
  return <ul className="divide-y divide-border/40 border-y border-border/40">{children}</ul>;
}

export function DocClose({ children }: { children: ReactNode }) {
  return (
    <p className="border-t border-border/40 pt-8 text-center text-sm italic text-muted-foreground">
      {children}
    </p>
  );
}
