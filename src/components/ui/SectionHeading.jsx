import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, sub, center = true }) {
  return (
    <Reveal className={`${center ? 'text-center' : ''} mb-10 md:mb-14`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="mt-3 font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-brand-800">
        {title}
      </h2>
      {sub && (
        <p className={`mt-4 text-muted-ink max-w-2xl text-[0.95rem] leading-relaxed ${center ? 'mx-auto' : ''}`}>
          {sub}
        </p>
      )}
    </Reveal>
  )
}
