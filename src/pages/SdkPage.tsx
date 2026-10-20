import { CodeBlock } from '../components/CodeBlock'
import { RailSection } from '../components/RailSection'
import { useCopy } from '../i18n/useCopy'
import addPackageMenu from '../assets/sdk-guide/step1-add-package-from-git-url.png'
import gitUrlInput from '../assets/sdk-guide/step1-git-url-input.png'
import signInScreen from '../assets/sdk-guide/step2-sdk-sign-in-screen.png'
import browserSignIn from '../assets/sdk-guide/step3-browser-sign-in.png'
import projectPicker from '../assets/sdk-guide/step4-sdk-project-picker.png'
import instanceConnected from '../assets/sdk-guide/step4-instance-connected.png'

interface Shot {
  src: string
  width: number
  height: number
  // 브라우저에서 2배율로 찍은 스크린샷은 2다. 화면에는 파일 폭을 이 값으로 나눈 폭까지만 그려서,
  // 480px 게임 화면이 단 폭에 맞춰 늘어나 흐려지지 않게 한다.
  scale?: number
  // 세로로 긴 스크린샷은 단 전체 폭으로 늘리지 않고 폭을 제한한다.
  narrow?: boolean
}

// 단계 순서대로 스크린샷을 둔다. alt 문구는 messages의 shotAlts에서 같은 순서로 가져온다.
const SHOTS_BY_STEP: Shot[][] = [
  [
    { src: addPackageMenu, width: 820, height: 498 },
    { src: gitUrlInput, width: 1090, height: 518 },
  ],
  [{ src: signInScreen, width: 480, height: 420 }],
  [{ src: browserSignIn, width: 840, height: 1264, scale: 2, narrow: true }],
  [
    { src: projectPicker, width: 480, height: 420 },
    { src: instanceConnected, width: 1004, height: 454, scale: 2 },
  ],
]

export function SdkPage() {
  const { t } = useCopy()

  return (
    <>
      <section className="hero">
        <span className="crop crop--tl" aria-hidden="true" />
        <span className="crop crop--tr" aria-hidden="true" />
        <div className="shell hero__inner hero__inner--page">
          <div className="hero__copy hero__copy--narrow">
            <p className="page-hero__kicker">INSTALL</p>
            <h1 className="hero__title page-hero__title">{t.sdk.title}</h1>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="shell section__full">
          {/* 설치부터 로그인, 프로젝트 선택까지 네 단계를 스크린샷과 함께 보여 준다.
              직접 운영하는 서버에 연결하는 방법은 대부분의 사람에게 필요 없어 아래에서 접어 둔다. */}
          <ol className="install">
            {t.sdk.steps.map((step, index) => (
              <li key={step.title}>
                <div className="install__num" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="install__body">
                  <h2 className="install__title">{step.title}</h2>
                  <p className="step__body">{step.body}</p>
                  {step.code ? <CodeBlock code={step.code} /> : null}
                  {(SHOTS_BY_STEP[index] ?? []).map((shot, shotIndex) => (
                    <img
                      key={shot.src}
                      className={shot.narrow ? 'install__shot install__shot--narrow' : 'install__shot'}
                      src={shot.src}
                      alt={step.shotAlts[shotIndex] ?? ''}
                      width={shot.width}
                      height={shot.height}
                      loading="lazy"
                      style={{ maxWidth: shot.width / (shot.scale ?? 1) }}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <RailSection num="HELP" title={t.sdk.helpTitle}>
        <ul className="marks marks--tight">
          {t.sdk.help.map((item) => (
            <li key={item}>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <a className="btn btn--ghost" href="mailto:contact@artel.dev">
          {t.sdk.contactCta}
        </a>

        <details className="advanced">
          <summary>{t.sdk.advancedTitle}</summary>
          <p className="advanced__note">{t.sdk.advancedNote}</p>
          {t.sdk.advanced.map((item) => (
            <div className="advanced__item" key={item.label}>
              <h3 className="advanced__label">{item.label}</h3>
              <CodeBlock code={item.code} />
            </div>
          ))}
        </details>
      </RailSection>
    </>
  )
}
