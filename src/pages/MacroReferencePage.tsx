import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CodeBlock } from '../components/CodeBlock'
import { useCopy } from '../i18n/useCopy'
import { macroContent, macroPages, macroPath, type MacroPageId } from '../macro/content'
import '../styles/macro-reference.css'

export function MacroReferencePage({ pageId }: { pageId: MacroPageId }) {
  const { locale, href } = useCopy()
  const [query, setQuery] = useState('')
  const pages = macroContent(locale)
  const page = pages[pageId]
  const index = macroPages.indexOf(pageId)
  const search = query.trim().toLowerCase()
  const results = search ? macroPages.flatMap(id => pages[id].sections
    .filter(section => [section.title, ...section.paragraphs, ...(section.rows?.flat() ?? [])].join(' ').toLowerCase().includes(search))
    .map(section => ({ id, section }))) : []

  return (
    <div className="macro-docs">
      <aside className="macro-docs__rail">
        <Link className="macro-docs__brand" to={href('/macro')}>Macro <span>REFERENCE</span></Link>
        <label className="macro-docs__search">
          <span>{locale === 'ko' ? '문서 검색' : 'Search reference'}</span>
          <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="find, checkpoint, …" />
        </label>
        {search ? (
          <div className="macro-docs__results">
            <p role="status">{results.length} {locale === 'ko' ? '개 결과' : 'results'}</p>
            {results.map(({ id, section }) => <Link key={`${id}-${section.id}`} to={`${href(macroPath(id))}#${section.id}`} onClick={() => setQuery('')}><small>{pages[id].title}</small>{section.title}</Link>)}
            {!results.length && <p>{locale === 'ko' ? '다른 함수명이나 문법으로 검색하세요.' : 'Try another function or syntax term.'}</p>}
          </div>
        ) : (
          <nav aria-label={locale === 'ko' ? 'Macro 문서' : 'Macro documentation'}>
            <p className="macro-docs__label">MACRO LANGUAGE</p>
            {macroPages.map((id, i) => <NavLink end key={id} to={href(macroPath(id))}><span aria-hidden="true">0{i + 1}</span>{pages[id].title}</NavLink>)}
          </nav>
        )}
      </aside>

      <article className="macro-docs__article">
        <header className="macro-docs__heading">
          <p className="macro-docs__label">ARTEL / MACRO LANGUAGE</p>
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
              <table><thead><tr><th>{locale === 'ko' ? '문법 / 항목' : 'Syntax / item'}</th><th>{locale === 'ko' ? '설명 / 값' : 'Description / value'}</th></tr></thead><tbody>{section.rows.map(([name, value]) => <tr key={name}><th scope="row"><code>{name}</code></th><td>{value}</td></tr>)}</tbody></table>
            </div>}
            {section.code && <div className="macro-docs__example"><div className="macro-docs__code-label">MACRO <span>{locale === 'ko' ? '예제' : 'Example'}</span></div><CodeBlock code={section.code} /></div>}
          </section>
        ))}
        <nav className="macro-docs__pager" aria-label={locale === 'ko' ? '이전·다음 문서' : 'Previous and next pages'}>
          {index > 0 ? <Link to={href(macroPath(macroPages[index - 1]))}><small>← {locale === 'ko' ? '이전' : 'Previous'}</small>{pages[macroPages[index - 1]].title}</Link> : <span />}
          {index < macroPages.length - 1 && <Link to={href(macroPath(macroPages[index + 1]))}><small>{locale === 'ko' ? '다음' : 'Next'} →</small>{pages[macroPages[index + 1]].title}</Link>}
        </nav>
      </article>

      <aside className="macro-docs__toc">
        <p className="macro-docs__label">{locale === 'ko' ? '이 페이지에서' : 'ON THIS PAGE'}</p>
        <nav aria-label={locale === 'ko' ? '본문 목차' : 'Article contents'}>{page.sections.map(s => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}</nav>
      </aside>
    </div>
  )
}
