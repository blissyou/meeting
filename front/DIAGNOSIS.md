# React 앱 상단 잘림 문제 진단 가이드

## 🔍 빠른 자가진단 순서 (개발자도구)

### 1단계: 기본 레이아웃 확인
```
Elements 탭 → html 선택 → Computed 탭에서 확인:
- margin-top: 0px (음수면 문제)
- overflow: visible (hidden이면 문제)
- height: 100% 

body 선택 → Computed 탭에서 확인:
- margin: 0px (음수면 문제)  
- padding-top: 0px
- overflow: visible (hidden이면 문제)
- background-attachment: fixed (scroll이면 배경 잘림 가능)

#root 선택 → Computed 탭에서 확인:
- min-height: 100dvh 또는 100vh
- overflow: auto (visible도 OK, hidden이면 문제)
```

### 2단계: 겹침 요소 검사
```
Elements 탭에서 최상단 콘텐츠 위에 마우스 올려서:
- position: fixed 또는 sticky 요소가 덮고 있는지 확인
- z-index가 높은 요소가 상단을 가리는지 확인
- transform이나 filter로 새 스태킹 컨텍스트 생성 여부

Console에서 실행:
document.querySelectorAll('[style*="position: fixed"], [style*="position: sticky"]')
```

### 3단계: 스크롤 컨테이너 확인
```
Console에서 실행:
getComputedStyle(document.documentElement).overflow  // "visible"이어야 함
getComputedStyle(document.body).overflow            // "visible"이어야 함
getComputedStyle(document.getElementById('root')).overflow // "auto" 또는 "visible"
```

## 🔧 문제 패턴별 수정 방법

### A. 일반 CSS 패치 (src/App.css 또는 index.css)

**수정 전:**
```css
* { margin: 0; padding: 0; }
html, body { height: 100%; }
#root { min-height: 100vh; }
body { overflow-x: hidden; }
```

**수정 후:**
```css
/* 전역 리셋 */
* { box-sizing: border-box; margin: 0; padding: 0; }

/* 세이프 에어리어 변수 */
:root { --safe-top: max(env(safe-area-inset-top, 0px), 0px); }

/* 기본 높이 및 오버플로우 설정 */
html, body { 
  height: 100%; 
  width: 100%; 
  overflow: visible; /* 상단 잘림 방지 */ 
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

/* 루트 컨테이너 - 실제 스크롤 담당 */
#root { 
  min-height: 100dvh; /* 모바일 주소창 대응 */
  width: 100%; 
  overflow: auto; 
}

/* 메인 래퍼 클래스 */
.main-wrap {
  padding-block-start: var(--safe-top);
  scroll-margin-top: var(--safe-top);
}

/* 박스 그림자 잘림 방지 */
.card, .container, .page, .section { overflow: visible; }
```

### B. Tailwind 패치 (src/index.css)

**수정 전:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**수정 후:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --safe-top: max(env(safe-area-inset-top, 0px), 0px); }
  html, body { 
    height: 100%; 
    width: 100%; 
    overflow: visible; 
  }
  #root { 
    min-height: 100dvh; 
    width: 100%; 
    overflow: auto; 
  }
  body { 
    @apply bg-gradient-to-br from-blue-100 to-purple-200; 
    background-repeat: no-repeat; 
    background-size: cover; 
    background-attachment: fixed; 
  }
  .main-wrap { 
    padding-block-start: var(--safe-top); 
    scroll-margin-top: var(--safe-top); 
  }
  .card, .container, .page, .section { overflow: visible; }
}
```

## 🔍 문제 코드 패턴 검색

### 검색해야 할 패턴들:
```bash
# 음수 마진 검색
grep -r "margin.*-" src/
grep -r "top.*-" src/

# 오버플로우 히든 검색  
grep -r "overflow.*hidden" src/
grep -r "overflow-y.*hidden" src/

# 트랜스폼/필터 검색
grep -r "transform:" src/
grep -r "filter:" src/

# 고정/스티키 포지션 검색
grep -r "position.*fixed" src/
grep -r "position.*sticky" src/

# 높은 z-index 검색
grep -r "z-index.*[5-9][0-9]" src/
```

## 📱 적용 방법

1. **App 컴포넌트 수정:**
```jsx
function App() {
  return (
    <div className="main-wrap">
      {/* 기존 콘텐츠 */}
    </div>
  );
}
```

2. **index.tsx에서 CSS 임포트:**
```tsx
import './index.css'; // 또는 './App.css'
```

3. **styled-components 사용 시:**
```jsx
const MainWrapper = styled.div.attrs({ className: 'main-wrap' })`
  /* 추가 스타일 */
`;
```