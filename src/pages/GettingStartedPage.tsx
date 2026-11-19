import { useState } from 'react'
import { useCopy } from '../i18n/useCopy'
import { gettingStartedCopy } from '../i18n/gettingStarted'
import { VideoArt } from './landing/videoArt'
import { posterOf, videoCategories, videos, youtubeEmbedUrl, type Video } from './landing/videos'
import '../styles/getting-started.css'

function VideoPlayer({ video }: { video: Video }) {
  const { locale, t } = useCopy()
  const [playing, setPlaying] = useState(false)
  const { source } = video
  const title = video.title[locale]
  const poster = posterOf(video)

  return (
    <div className="getting-started__player">
      {playing && source?.kind === 'youtube' ? (
        <iframe src={youtubeEmbedUrl(source.id)} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      ) : playing && source?.kind === 'file' ? (
        <video src={source.src} poster={source.poster} controls autoPlay playsInline aria-label={title} />
      ) : (
        <>
          {poster ? <img src={poster} alt="" /> : <VideoArt kind={video.art} />}
          {source ? (
            <button type="button" className="btn btn--primary getting-started__play" onClick={() => setPlaying(true)} aria-label={t.videos.play.replace('{title}', title)}>
              <span aria-hidden="true">▶</span> {gettingStartedCopy[locale].play}
            </button>
          ) : <p className="getting-started__soon">{t.videos.preparingMessage}</p>}
        </>
      )}
    </div>
  )
}

export function GettingStartedPage() {
  const { locale, t } = useCopy()
  const [selected, setSelected] = useState(videos[0].key)
  const video = videos.find(item => item.key === selected) ?? videos[0]
  const copy = gettingStartedCopy[locale]

  return (
    <section className="section getting-started">
      <div className="shell">
        <h1 className="hero__title page-hero__title">{copy.title}</h1>
        <div className="getting-started__layout">
          <div className="getting-started__detail">
            <VideoPlayer key={video.key} video={video} />
            <div className="getting-started__meta" aria-live="polite" aria-atomic="true">
              <p className="getting-started__category">{videoCategories[video.category][locale]}{video.duration ? ` · ${video.duration}` : ''}</p>
              <h2>{video.title[locale]}</h2>
              <p>{video.summary[locale]}</p>
            </div>
          </div>
          <nav aria-label={t.videos.title} className="getting-started__list">
            <ol>
              {videos.map((item, index) => (
                <li key={item.key}>
                  <button type="button" aria-current={item.key === video.key ? 'true' : undefined} onClick={() => setSelected(item.key)}>
                    <span className="getting-started__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="getting-started__label">{item.title[locale]}</span>
                      <span className="getting-started__category">{videoCategories[item.category][locale]}{!item.source ? ` · ${t.videos.preparing}` : ''}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  )
}
