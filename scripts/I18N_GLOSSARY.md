# i18n glossary (EN → JA / KO / ZH)

**Source of truth:** English blocks (`class="en-only"`) in `index.html`, aligned with `Parenting_Handbook_English.pdf`.

**Vietnamese** (`vi-only`) follows the Vietnamese PDF and is maintained separately.

## Section labels (must match across all principles)

| English | 日本語 | 한국어 | 中文 |
|---------|--------|--------|------|
| The teaching | 教え | 가르침 | 教诲 |
| In practice | 実践 | 실천 | 实践 |
| Try saying | 言ってみる | 말해 보기 | 可练习的话 |
| Verse to remember | 心に留める句 | 기억할 시 | 牢记的诗句 |
| Stories to keep | 覚えておきたい話 | 기억할 이야기 | 宜记的故事 |

## Key terms

| English | 日本語 | 한국어 | 中文 |
|---------|--------|--------|------|
| Buddha | 仏 | 부처(님) | 佛 |
| the Buddha | 仏陀 | 부처님 | 佛陀 |
| Dharma | 仏法 | 불법 | 佛法 |
| Arahants | 阿羅漢 | 아라한 | 阿罗汉 |
| awakened sages | 覚者 | 깨달으신 분들 | 觉者 |
| Shakyamuni Buddha, Our Original Teacher | 本師釈迦牟尼仏 | 본사 석가모니불 | 本师释迦牟尼佛 |
| Vesak Address, 2026 | 2026年・仏降誕会の法話より | 2026년 부처님 오신 날 법문에서 발췌 | 摘自 2026 年佛诞开示 |
| devas | 諸天 | 천신 | 诸天 |
| karma | 業 | 업 | 业 |
| Mr. Ba | バーさん | 바 할아버지 | 巴老先生 |
| native accent | ネイティブのアクセント | 원어민 발음 | 母语者口音 |

## Rules

1. Translate JA/KO/ZH **only from English**, not from Vietnamese.
2. Do not omit, add, summarize, or reinterpret any sentence.
3. Preserve HTML structure (`p.label`, `ul.practice-list`, `.sayings`, `.dialogue .line`, `p.prompt`, `p.exchange`, `blockquote`, etc.).
4. Keep proper names from English (e.g. Mr. Ba) unless a standard localized form exists in the target language.

## Updating injected blocks

CJK content lives after `<!-- INJECTED:... -->` comments in `index.html`. After edits, optionally mirror changes into `scripts/cjk-blocks*.html` for `inject_i18n.py`.
