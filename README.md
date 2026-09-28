# 🚀 SprintCraft: 1인 메이커를 위한 올인원 크리에이티브 허브
## (Full-Stack Micro-Productivity Studio & Project Report)

> 아이디어 발상부터 KPT 회고, SNS 콘텐츠 생성, 소셜 감성 분석, 브랜딩 허브, 스토리보드, 사운드 랩, 초집중 스프린트까지 8가지 핵심 모듈을 단일 SPA에 집약하고 브라우저 영구 상태 보존(LocalStorage)과 Vercel CI/CD를 결합한 풀스택 생산성 스튜디오입니다.

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-14.2-000000?style=flat-square&logo=next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white"/>
  <img src="https://img.shields.io/badge/Recharts-2.12-22c55e?style=flat-square"/>
  <img src="https://img.shields.io/badge/Vercel-Production-000000?style=flat-square&logo=vercel&logoColor=white"/>
</p>

---

## 📌 1. 프로젝트 개요 및 서비스 소개

* **프로젝트명**: SprintCraft (올인원 크리에이티브 & 생산성 스튜디오)
* **개발 기간**: 2026.09.24 ~ 2026.09.28
* **개발자 / 작성자**: 정형경 (`love4xox`)
* **저장소**: [https://github.com/love4xox/sprintcraft](https://github.com/love4xox/sprintcraft)
* **배포 URL**: [https://sprintcraft.vercel.app](https://sprintcraft.vercel.app) *(또는 실제 발급된 Vercel URL)*
* **서비스 소개 (무엇을 해결하는가?)**:
  * **문제 정의**: 1인 메이커 및 크리에이터는 회고, 카드뉴스 제작, 감성 모니터링, 프로필 빌더, 영상 기획, 오디오 프롬프트 생성, 집중 작업 관리 등 다양한 작업을 수행하기 위해 수많은 개별 툴을 오가며 작업 흐름이 분절되고 데이터가 유실되는 비효율을 겪습니다.
  * **해결 방안**:
    1. **단일 SPA 통합 허브**: 8개 핵심 생산성 모듈을 단일 뷰포트에서 지연 없이 즉각 전환 가능한 반응형 탭 구조로 통합.
    2. **클라이언트 사이드 영구화**: 백엔드 DB 통신 오버헤드 없이 `LocalStorage`를 활용해 8개 모듈의 입력 상태를 브라우저에 안전하게 자동 저장/복원.
    3. **인터랙티브 렌더링 & 에셋 익스포트**: DOM-to-Canvas(html-to-image) 기반 고화질 PNG 렌더링, Recharts 기반 실시간 감성 시계열 차트, SVG 원형 뽀모도로 타이머, 오디오 메타태그 조합기 제공.

---

## 🏗️ 2. 시스템 아키텍처 및 기술 스택

### 2.1 시스템 아키텍처 다이어그램
```text
  [ Presentation & UI Layer ]
  ┌────────────────────────────────────────────────────────┐
  │  Next.js 14 App Router (React Server & Client Components)│
  │  - Single Page 8-Module Tab Navigation (No Reload)     │
  │  - Tailwind CSS 기반 반응형 모바일/데스크톱 뷰포트     │
  │  - Lucide Icons & Edge Runtime 다이내믹 파비콘 (icon.tsx)│
  └───────────────────────────┬────────────────────────────┘
                              │
  [ Core Module & Engine Layer ]
  ┌───────────────────────────▼────────────────────────────┐
  │  1. 회고 NLP 엔진       │  2. DOM-to-Canvas 렌더러    │
  │     (KPT & Action)       │     (html-to-image PNG 변환) │
  │  ────────────────────────┼────────────────────────────│
  │  3. 시계열 감성 레이더    │  4. 링크인바이오 프리뷰어  │
  │     (Recharts 다중 추세) │     (테마별 모바일 목업)   │
  │  ────────────────────────┼────────────────────────────│
  │  5. 16:9 스토리보드 캔버스│  6. AI 음악 프롬프트 랩     │
  │  ────────────────────────┼────────────────────────────│
  │  7. 아이디어 스파크 핀보드│  8. 초집중 스프린트 타이머  │
  │     (상태 관리, 검색/정렬)│     (뽀모도로 & 액션 다이스)│
  └───────────────────────────┬────────────────────────────┘
                              │
  [ Persistence & Deployment ]
  ┌───────────────────────────▼────────────────────────────┐
  │  - Browser LocalStorage (sc_retro, sc_adopt,           │
  │    sc_reviews, sc_bio, sc_scenes, sc_music,            │
  │    sc_ideas, sc_action_dice, sc_completed_sessions)    │
  │  - Vercel Edge Network (Global CDN, Auto CI/CD)        │
  └────────────────────────────────────────────────────────┘
```

### 2.2 계층별 상세 기술 스택
| 계층 (Layer) | 사용 기술 | 적용 목적 및 주요 역할 |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | 클라이언트 사이드 고속 탭 전환, `icon.tsx` Edge Runtime 파비콘 자동 생성 |
| **Language** | TypeScript 5 | 엄격한 타입 모델링 (`ReviewItem`, `BioLinkItem`, `StoryboardScene`, `IdeaItem`, `CustomAction`) |
| **Styling** | Tailwind CSS | 다크 모드 목업, 1:1 카드 템플릿, 슬림 스크롤바 제어 및 글래스모피즘 UI |
| **Canvas / Export** | html-to-image | 인스타그램 규격 1:1 카드를 2배수 픽셀(Retina 대응) 고화질 PNG 파일로 즉시 변환 |
| **Data Viz** | Recharts | 날짜별 긍정률/부정률/이상징후(불일치율) 다중 라인 시계열 차트 렌더링 |
| **Timer Engine** | React Hooks + SVG | 원형 프로그레스 게이지 실시간 연산 및 뽀모도로(15m/25m/5m) 상태 머신 제어 |
| **State & Storage** | React Hook + LocalStorage | `useEffect` 듀얼 바인딩으로 새로고침 및 브라우저 재접속 시에도 8개 모듈 완벽 복원 |
| **Hosting & CI/CD** | Vercel, GitHub Actions | GitHub `main` 푸시 시 30초 내 무중단 글로벌 CDN 자동 배포 |

---

## 🧩 3. 8대 핵심 기능 모듈 명세

### 01. AI 회고 아카이브 (1인 스프린트 KPT)
* **동작 원리**: 사용자의 자유 서술형 회고 문장을 문장 부호 단위로 파싱하고 감성/행동 키워드 정규식을 적용.
* **산출물**: Keep(유지할 점), Problem(개선할 점), Try(새 시도) 카드 및 내일의 Action Item 체크리스트 자동 구조화.

### 02. 유기동물 입양 홍보 콘텐츠 제너레이터 (DOM to Canvas)
* **카드 템플릿**: 시네마틱 풀스크린, 폴라로이드 감성 프레임, 긴급 임팩트(경보) 3가지 디자인 실시간 전환.
* **에셋 익스포트**: DOM 노드를 캔버스로 변환하여 고화질 PNG 다운로드 및 인스타그램 본문/해시태그 원클릭 복사.
* **빠른 로드**: 보리, 나비, 초코, 뭉치 등 구조 동물 프로필 원클릭 프리셋 로더 제공.

### 03. 소셜/리뷰 감성 트렌드 레이더 (Data Pipeline)
* **기능**: 실시간 리뷰 수기 등록 및 표준 CSV 파일 일괄 파싱 적재.
* **이상 징후 감지**: 평점(별점)과 텍스트 감성이 어긋나는 평점-감성 불일치(Discrepancy)를 자동 식별.
* **시각화**: Recharts 시계열 꺾은선 차트를 통한 일자별 긍정/부정/불일치율 추이 모니터링.

### 04. 링크인바이오 프로필 빌더 (Mobile Preview)
* **모바일 목업**: 다크 옵시디언, 퍼플 오로라, 모던 클린 3종 테마가 실시간 반응하는 스마트폰 뷰포트.
* **링크 관리**: 링크 제목 및 URL 동적 추가/삭제, 외부 링크 새창 열기, 프로필 이미지 업로드 지원.

### 05. 멀티모달 스토리보드 캔버스 (Cinematic Studio)
* **16:9 프레임 뷰포트**: 씬별 16:9 비율 레퍼런스 비주얼 스케치 업로드 및 프리뷰 제공.
* **멀티모달 설계**: 카메라 워크(Push In, Pan 등), 비주얼 프롬프트, 오디오 톤, 성우 내레이션 대사 통합 기획.
* **타임라인 연산**: 씬 지속 시간(초) 설정에 따른 총 예상 러닝타임 실시간 자동 계산 및 전체 대본 복사.

### 06. AI 음악 프롬프트 & 사운드 랩 (Audio Prompting)
* **프롬프트 빌더**: 장르 칩, 무드 다중 선택, 악기 토글, BPM 슬라이더, 보컬 트랙 스타일 제어.
* **가사 구조 메타태그**: Suno / Udio 맞춤형 기승전결 메타태그(`[Verse]`, `[Chorus]`, `[Drop]`, `[Outro]`) 조합 출력.

### 07. 크리에이티브 아이디어 스파크 (Idea Pinboard)
* **정렬 & 검색**: 카테고리 필터링(프로덕트, 영상, 음악, 디자인) 및 키워드 실시간 검색.
* **상태 트래킹**: 중요 아이디어 별표(Pin) 상단 고정, 실행 상태(구상 중 / 진행 중 / 완료) 토글, 마크다운 기획 노트 내보내기.

### 08. 초집중 스프린트 & 액션 다이스 (Focus Sprint & Action Dice)
* **초집중 타이머**: 15분 초소형 액션, 25분 뽀모도로, 5분 리프레시 휴식 3단계 모드 지원 및 SVG 원형 프로그레스 시각화.
* **15분 액션 다이스 룰렛**: 시작 주저증(Procrastination) 해소를 위한 무작위 초소형 행동 추첨 애니메이션 엔진.
* **착수 풀 관리**: 사용자가 즉시 행동 가능한 15분 단위 행동 목록 동적 추가/삭제 및 당일 완수 세션 카운터 영구 누적.

---

## 💻 4. 로컬 개발 및 실행 가이드

```bash
# 1. 저장소 복제 및 이동
git clone [https://github.com/love4xox/sprintcraft.git](https://github.com/love4xox/sprintcraft.git)
cd sprintcraft

# 2. 패키지 의존성 설치
npm install

# 3. 로컬 개발 서버 구동 (localhost:3000)
npm run dev

# 4. 프로덕션 빌드 사전 검증
npm run build
```

---

## 🛠️ 5. 트러블슈팅 및 사용자 경험(UX) 최적화

### 5.1 Vercel 기본 파비콘 충돌 및 Edge Runtime 다이내믹 아이콘 도입
* **문제 상황**: 배포 후 브라우저 탭에 Next.js 기본 검은색 삼각형 아이콘(`favicon.ico`)과 `Create Next App` 타이틀이 고정 노출되는 브랜딩 문제 발생.
* **원인**: Next.js 14 App Router에서 빌드 시 `app/favicon.ico` 정적 파일이 메타데이터보다 우선순위를 갖는 현상.
* **해결 방안**:
  1. 기존 `app/favicon.ico` 정적 파일을 제거.
  2. Next.js Edge Runtime 기반의 `app/icon.tsx`를 생성하여 ImageResponse로 커스텀 로켓(🚀) 심볼과 그라데이션 배지를 32x32 규격으로 동적 서빙.
  3. `app/layout.tsx`의 Metadata 객체를 `SprintCraft | 올인원 크리에이티브 스튜디오`로 교체 완료.

### 5.2 8개 모듈 확장에 따른 상단 네비게이션 가로 스크롤바 간섭 해결
* **문제 상황**: 8번째 탭 추가 시 뷰포트 너비를 초과하여 상단 네비게이션 영역에 회색 가로 스크롤바가 노출되어 디자인 완성도 저하.
* **해결 방안**:
  1. 탭 라벨 명칭을 간결하게 축약(`8. 뽀모도로 다이스`).
  2. Tailwind CSS 인라인 유틸리티(`scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`)를 주입하여 스크롤바를 완전히 숨기고 터치/휠 스와이프 인터랙션 유지.

### 5.3 라이트 테마 기반 컴포넌트 텍스트 가시성 대비 최적화
* **문제 상황**: 다크 테마 기준으로 작성된 8번 모듈의 흰색 글씨(`text-white`)가 메인 배경(`bg-slate-100`)과 겹쳐 텍스트가 식별되지 않는 현상 발생.
* **해결 방안**: 1~7번 모듈과 일관성을 갖추도록 `bg-white rounded-3xl` 화이트 카드 래퍼를 씌우고 `text-slate-900`, `text-slate-600` 명도 대비를 재조정하여 가독성 확보.

### 5.4 LocalStorage 하이드레이션 불일치(Hydration Mismatch) 방지
* **문제 상황**: SSR(서버 사이드 렌더링) 환경과 브라우저의 LocalStorage 저장 데이터가 일치하지 않아 React Hydration 오류가 발생할 위험 존재.
* **해결 방안**: `isMounted` 플래그 및 마운트 후 1회성 상태 주입 로직을 구성하여 클라이언트 마운트 완료 시점에 안전하게 상태를 복원하도록 아키텍처 설계.

---

## 📑 6. 평가 기준 심층 분석 대응

* **단일 책임 기반 모듈화**: 회고, 에셋 생성, 시계열 분석, 링크 관리, 타이머 등 상이한 비즈니스 로직을 독립된 상태 머신으로 격리하여 결합도를 낮추고 유지보수성을 극대화.
* **운영 비용 제로화 (Zero Server Cost)**: 별도의 백엔드 데이터베이스 서버 없이 브라우저 LocalStorage와 클라이언트 캔버스 엔진을 결합하여 무제한 영구 사용이 가능한 초경량 아키텍처 실현.
* **완성도 높은 반응형 UX**: 원클릭 클립보드 복사, 상태 토글 애니메이션, 고화질 Retina PNG 다운로드 파이프라인, 모바일 뷰 목업을 제공하여 실사용 가치를 극대화.
