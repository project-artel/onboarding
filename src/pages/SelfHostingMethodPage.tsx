import { Link } from 'react-router-dom'
import { SelfHostingBlocks } from '../components/SelfHostingBlocks'
import {
  selfHostingHubPath,
  selfHostingMethodPath,
  type SelfHostingMethodId,
} from '../i18n/selfHostingRoutes'
import { useCopy } from '../i18n/useCopy'

export function SelfHostingMethodPage({ method }: { method: SelfHostingMethodId }) {
  const { t, href } = useCopy()
  const page = t.selfHosting
  const content = page.methods[method]
  const otherCards = page.chooser.cards.filter((card) => card.id !== method)

  return (
    <>
      <section className="hero">
        <span className="crop crop--tl" aria-hidden="true" />
        <span className="crop crop--tr" aria-hidden="true" />
        <div className="shell hero__inner hero__inner--page">
          <div className="hero__copy hero__copy--narrow">
            <Link className="selfhost__back" to={href(selfHostingHubPath)}>
              {page.method.back}
            </Link>
            <h1 className="hero__title page-hero__title">{content.title}</h1>
            <p className="hero__lead">{content.chooseWhen}</p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="shell section__full">
          <ol className="install">
            {content.steps.map((step, index) => (
              <li key={step.title}>
                <div className="install__num" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="install__body">
                  <h2 className="install__title">{step.title}</h2>
                  <SelfHostingBlocks blocks={step.blocks} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="shell section__full">
          <h2 className="install__title">{page.method.othersTitle}</h2>
          <ul className="method-cards">
            {otherCards.map((card) => (
              <li key={card.id}>
                <Link className="method-card" to={href(selfHostingMethodPath(card.id))}>
                  <span className="method-card__name">{card.name}</span>
                  <span className="method-card__audience">{card.audience}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
