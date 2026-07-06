import { navItems, siteConfig, socialLinks } from "@/data/site";

export default function Footer() {
  return (
    <footer id="footer-socials" className="relative z-10 border-t border-white/10 px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:flex-wrap md:items-center md:justify-between lg:flex-nowrap">
        <div>
          <a href="#home" className="text-lg font-bold text-white">
            {siteConfig.name}
          </a>
          <p className="mt-2 text-sm text-white/54">
            Built with Next.js, Tailwind CSS & Framer Motion
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/58 md:flex-1 md:justify-center" aria-label="Footer navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 flex-wrap items-center gap-2 overflow-visible sm:gap-3">
          {socialLinks.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="group relative grid h-10 w-10 place-items-center overflow-visible rounded-full border border-white/10 bg-ink/40 text-white/62 transition hover:border-cyan/50 hover:text-white"
                aria-label={item.label}
              >
                <span className="pointer-events-none absolute inset-1 rounded-full bg-cyan/18 opacity-0 blur-[9px] transition duration-300 group-hover:opacity-100" aria-hidden="true" />
                <Icon className="relative z-10" size={17} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl text-sm text-white/42">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}