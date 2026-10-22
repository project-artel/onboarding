import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CodeBlock } from '../components/CodeBlock'
import { useCopy } from '../i18n/useCopy'
import { documentation } from '../docs/content'
import '../styles/macro-reference.css'

export function DeveloperDocsPage({ path }: { path: string }) {
  const { locale, href } = useCopy()
  const [query, setQuery] = useState('')
  const [navigationOpen, setNavigationOpen] = useState(false)
  const pages = documentation(locale)
  const index = pages.findIndex(page => page.path === path)
  const page = pages[index]
  const groups = [...new Set(pages.map(page => page.group))]
  const search = query.trim().toLowerCase()
  const results = search ? pages.flatMap(page => page.sections
    .filter(section => [page.title, section.title, ...section.paragraphs, section.code ?? '', ...(section.rows?.flat() ?? [])].join(' ').toLowerCase().includes(search))
    .map(section => ({ page, section }))) : []

  return (
    <div className="macro-docs">
      <aside className="macro-docs__rail">
        <Link className="macro-docs__brand" to={href('/docs')}>ARTEL <span>DEVELOPER DOCS</span></Link>
        <label className="macro-docs__search">
          <span>{locale === 'ko' ? '문서 검색' : 'Search documentation'}</span>
          <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="CLI, API key, Macro, …" />
        </label>
        {search ? (
          <div className="macro-docs__results">
            <p role="status">{results.length} {locale === 'ko' ? '개 결과' : 'results'}</p>
            {results.map(({ page, section }) => <Link key={`${page.path}-${section.id}`} to={`${href(page.path)}#${section.id}`} onClick={() => setQuery('')}><small>{page.title}</small>{section.title}</Link>)}
            {!results.length && <p>{locale === 'ko' ? '다른 설정명이나 명령으로 검색하세요.' : 'Try another setting or command.'}</p>}
          </div>
        ) : (
          <div className="docs-navigation" data-expanded={navigationOpen}>
          <button className="docs-navigation__toggle" type="button" aria-expanded={navigationOpen} aria-controls="docs-navigation" onClick={() => setNavigationOpen(!navigationOpen)}>{locale === 'ko' ? '문서 목차' : 'Documentation menu'} <span aria-hidden="true">{navigationOpen ? '−' : '+'}</span></button>
          <nav id="docs-navigation" aria-label={locale === 'ko' ? '개발자 문서' : 'Developer documentation'}>
            {groups.map(group => <div className="docs-nav-group" key={group}>
              <p className="macro-docs__label">{group}</p>
              {pages.filter(page => page.group === group).map(page => <NavLink end key={page.path} to={href(page.path)} onClick={() => setNavigationOpen(false)}>{page.title}</NavLink>)}
            </div>)}
          </nav>
          </div>
        )}
      </aside>

      <article className="macro-docs__article">
        <header className="macro-docs__heading">
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </header>
        <nav className="macro-docs__mobile-toc" aria-label={locale === 'ko' ? '이 페이지의 목차' : 'On this page'}>
          {page.sections.map(s => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}
        </nav>
        {page.sections.map(section => (
          <section className="macro-docs__section" id={section.id} key={section.id}>
            <h2><a href={`#${section.id}`}>{section.title}<span aria-hidden="true"> #</span></a></h2>
            {section.paragraphs.map(p => <p key={p}>{p}</p>)}
            {section.rows && <div className="macro-docs__table" tabIndex={0} role="region" aria-label={section.title}>
              <table><thead><tr><th>{locale === 'ko' ? '항목' : 'Item'}</th><th>{locale === 'ko' ? '설명' : 'Description'}</th></tr></thead><tbody>{section.rows.map(([name, value]) => <tr key={name}><th scope="row"><code>{name}</code></th><td>{value}</td></tr>)}</tbody></table>
            </div>}
            {section.code && <div className="macro-docs__example"><div className="macro-docs__code-label">{section.language ?? 'Macro'} <span>{locale === 'ko' ? '예제' : 'Example'}</span></div><CodeBlock code={section.code} /></div>}
            {section.links && <ul className="docs-links">{section.links.map(link => <li key={link.to}>{link.to.startsWith('/') && !link.to.endsWith('.md')
              ? <Link to={href(link.to)}>{link.label}<span aria-hidden="true"> →</span></Link>
              : <a href={link.to}>{link.label}<span aria-hidden="true"> ↗</span></a>}</li>)}</ul>}
          </section>
        ))}
        <nav className="macro-docs__pager" aria-label={locale === 'ko' ? '이전·다음 문서' : 'Previous and next pages'}>
          {index > 0 ? <Link to={href(pages[index - 1].path)}><small>← {locale === 'ko' ? '이전' : 'Previous'}</small>{pages[index - 1].title}</Link> : <span />}
          {index < pages.length - 1 && <Link to={href(pages[index + 1].path)}><small>{locale === 'ko' ? '다음' : 'Next'} →</small>{pages[index + 1].title}</Link>}
        </nav>
      </article>

      <aside className="macro-docs__toc">
        <p className="macro-docs__label">{locale === 'ko' ? '이 페이지에서' : 'ON THIS PAGE'}</p>
        <nav aria-label={locale === 'ko' ? '본문 목차' : 'Article contents'}>{page.sections.map(s => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}</nav>
      </aside>
    </div>
  )
}
