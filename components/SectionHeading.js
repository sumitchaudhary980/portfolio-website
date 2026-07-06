export default function SectionHeading({ eyebrow, title, children, align = "left", id }) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-cyan">{eyebrow}</p>
      <h2 id={id} className="text-balance text-4xl font-bold leading-tight text-white md:text-6xl">
        {title}
      </h2>
      {children ? <p className="mt-5 text-pretty text-base leading-8 text-white/62 md:text-lg">{children}</p> : null}
    </div>
  );
}
