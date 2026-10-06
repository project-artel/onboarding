import { Link } from 'react-router-dom'
import { RailSection } from '../components/RailSection'
import { SelfHostingBlocks } from '../components/SelfHostingBlocks'
import { selfHostingMethodPath } from '../i18n/selfHostingRoutes'
import { useCopy } from '../i18n/useCopy'

const repositoryUrl = 'https://github.com/project-artel/artel'

export function SelfHostingPage() {
  const { t, href } = useCopy()
  const page = t.selfHosting

  return (
    <>
      <section className="hero">
        <span className="crop crop--tl" aria-hidden="true" />
        <span className="crop crop--tr" aria-hidden="true" />
        <div className="shell hero__inner hero__inner--page">
          <div className="hero__copy hero__copy--narrow">
            <p className="page-hero__kicker">SELF-HOST</p>
            <h1 className="hero__title page-hero__title">{page.title}</h1>
            <p className="hero__lead">{page.lead}</p>
          </div>
        </div>
      </section>

      <RailSection alt num="01" title={page.overview.title}>
        <ul className="marks marks--tight">
          {page.overview.items.map((item) => (
            <li key={item}>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </RailSection>

      <RailSection num="02" title={page.chooser.title}>
        <ul className="method-cards">
          {page.chooser.cards.map((card) => (
            <li key={card.id}>
              <Link className="method-card" to={href(selfHostingMethodPath(card.id))}>
                <span className="method-card__name">{card.name}</span>
                <span className="method-card__audience">{card.audience}</span>
                <span className="method-card__cta">{card.cta} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </RailSection>

      {page.afterInstall.map((section, index) => (
        <RailSection
          alt={index % 2 === 0}
          key={section.title}
          num={String(index + 3).padStart(2, '0')}
          title={section.title}
        >
          <SelfHostingBlocks blocks={section.blocks} />
        </RailSection>
      ))}

      <section className="section">
        <div className="shell section__full selfhost__links">
          <a
            className="btn btn--ghost"
            href={`${repositoryUrl}/blob/main/deploy/README.md`}
            rel="noreferrer noopener"
            target="_blank"
          >
            {page.deployReadmeLabel}
          </a>
          <a
            className="btn btn--ghost"
            href={`${repositoryUrl}/blob/main/LICENSE`}
            rel="noreferrer noopener"
            target="_blank"
          >
            {page.licenseLabel}
          </a>
        </div>
      </section>
    </>
  )
}
