/* Handbook UI strings — edit when adding locales or copy */
(function () {
  window.HANDBOOK_I18N = {
    READ_UI: {
      vi: {
        continue: "Tiếp tục đọc",
        intro: "Tiếp tục đọc mở đầu",
        closing: "Tiếp tục đọc lời kết",
        principle: "Tiếp tục đọc điều {n}",
        dismiss: "Đóng"
      },
      en: {
        continue: "Continue reading",
        intro: "Continue reading · Introduction",
        closing: "Continue reading · Closing",
        principle: "Continue reading · Principle {n}",
        dismiss: "Dismiss"
      },
      ja: {
        continue: "続きから読む",
        intro: "続きを読む · はじめに",
        closing: "続きを読む · 結び",
        principle: "続きを読む · 第{n}条",
        dismiss: "閉じる"
      },
      ko: {
        continue: "이어서 읽기",
        intro: "이어서 읽기 · 머리말",
        closing: "이어서 읽기 · 맺음말",
        principle: "이어서 읽기 · 제{n}항",
        dismiss: "닫기"
      },
      zh: {
        continue: "继续阅读",
        intro: "继续阅读 · 前言",
        closing: "继续阅读 · 结语",
        principle: "继续阅读 · 第{n}条",
        dismiss: "关闭"
      }
    },
    SEARCH_UI: {
      vi: {
        open: "Tìm trong trang",
        title: "Tìm trong trang",
        placeholder: "Ví dụ: từ bi, thiền, khiêm cung…",
        hint: "Gõ từ khóa (không dấu cũng được). Chọn kết quả để nhảy tới đoạn.",
        empty: "Không thấy kết quả trong ngôn ngữ đang chọn.",
        short: "Nhập ít nhất 2 ký tự.",
        intro: "Mở đầu",
        closing: "Lời kết",
        article: "Điều {n}",
        shortcut: "Phím tắt: Ctrl+K"
      },
      en: {
        open: "Search page",
        title: "Search this page",
        placeholder: "e.g. compassion, meditate, humility…",
        hint: "Type a keyword. Pick a result to jump to that passage.",
        empty: "No matches in the current language.",
        short: "Enter at least 2 characters.",
        intro: "Introduction",
        closing: "Closing",
        article: "Principle {n}",
        shortcut: "Shortcut: Ctrl+K"
      },
      ja: {
        open: "ページ内検索",
        title: "ページ内検索",
        placeholder: "例：慈悲、瞑想、謙虚…",
        hint: "キーワードを入力し、結果を選ぶと該当箇所へ移動します。",
        empty: "現在の言語では見つかりませんでした。",
        short: "2文字以上入力してください。",
        intro: "はじめに",
        closing: "結び",
        article: "第{n}条",
        shortcut: "ショートカット: Ctrl+K"
      },
      ko: {
        open: "페이지 검색",
        title: "페이지 검색",
        placeholder: "예: 자비, 명상, 겸손…",
        hint: "키워드를 입력하고 결과를 선택하면 해당 문단으로 이동합니다.",
        empty: "현재 언어에서 결과가 없습니다.",
        short: "2자 이상 입력하세요.",
        intro: "머리말",
        closing: "맺음말",
        article: "제{n}항",
        shortcut: "단축키: Ctrl+K"
      },
      zh: {
        open: "页面内搜索",
        title: "页面内搜索",
        placeholder: "例：慈悲、禅修、谦卑…",
        hint: "输入关键词，选择结果即可跳转到对应段落。",
        empty: "当前语言下未找到匹配内容。",
        short: "请至少输入 2 个字符。",
        intro: "前言",
        closing: "结语",
        article: "第{n}条",
        shortcut: "快捷键：Ctrl+K"
      }
    },
    SHARE_UI: {
      vi: {
        section: "Sao chép nội dung điều {n}",
        copied: "Đã sao chép nội dung",
        failed: "Không sao chép được"
      },
      en: {
        section: "Copy principle {n} text",
        copied: "Content copied",
        failed: "Could not copy"
      },
      ja: {
        section: "第{n}条の本文をコピー",
        copied: "本文をコピーしました",
        failed: "コピーできませんでした"
      },
      ko: {
        section: "제{n}항 내용 복사",
        copied: "내용이 복사되었습니다",
        failed: "복사할 수 없습니다"
      },
      zh: {
        section: "复制第{n}条正文",
        copied: "已复制正文",
        failed: "无法复制"
      }
    },
    THEME_LABELS: {
      vi: { light: "Bật giao diện tối", dark: "Bật giao diện sáng" },
      en: { light: "Switch to dark mode", dark: "Switch to light mode" },
      ja: { light: "ダークモードに切り替え", dark: "ライトモードに切り替え" },
      ko: { light: "다크 모드로 전환", dark: "라이트 모드로 전환" },
      zh: { light: "切换到深色模式", dark: "切换到浅色模式" }
    },
    THEME_COLORS: { light: "#fafafa", dark: "#111111" },
    LANG_MENU_UI: {
      vi: { title: "Ngôn ngữ", open: "Chọn ngôn ngữ" },
      en: { title: "Language", open: "Choose language" },
      ja: { title: "言語", open: "言語を選択" },
      ko: { title: "언어", open: "언어 선택" },
      zh: { title: "语言", open: "选择语言" }
    },
    LANG_SHORT: { vi: "VI", en: "EN", ja: "日本語", ko: "한국어", zh: "中文" },
    LANG_NAMES: {
      vi: "Tiếng Việt",
      en: "English",
      ja: "日本語",
      ko: "한국어",
      zh: "中文"
    },
    BOOKMARK_UI: {
      vi: {
        open: "Đã lưu",
        title: "Điều đã lưu",
        hint: "Các điều bạn đánh dấu — lưu trên thiết bị này.",
        empty: "Chưa có điều nào được lưu. Nhấn biểu tượng lưu ở từng điều để đánh dấu.",
        add: "Lưu điều {n}",
        remove: "Bỏ lưu điều {n}",
        article: "Điều {n}",
        goto: "Đọc điều {n}"
      },
      en: {
        open: "Saved",
        title: "Saved principles",
        hint: "Principles you bookmarked — stored on this device only.",
        empty: "No saved principles yet. Tap the bookmark icon on any principle to save it.",
        add: "Save principle {n}",
        remove: "Remove principle {n}",
        article: "Principle {n}",
        goto: "Read principle {n}"
      },
      ja: {
        open: "保存済み",
        title: "保存した原則",
        hint: "ブックマークした項目 — この端末にのみ保存されます。",
        empty: "まだ保存がありません。各原則のブックマークをタップして保存してください。",
        add: "第{n}条を保存",
        remove: "第{n}条の保存を解除",
        article: "第{n}条",
        goto: "第{n}条を読む"
      },
      ko: {
        open: "저장됨",
        title: "저장한 원칙",
        hint: "북마크한 항목 — 이 기기에만 저장됩니다.",
        empty: "저장된 원칙이 없습니다. 각 원칙의 북마크를 눌러 저장하세요.",
        add: "제{n}항 저장",
        remove: "제{n}항 저장 해제",
        article: "제{n}항",
        goto: "제{n}항 읽기"
      },
      zh: {
        open: "已收藏",
        title: "收藏的要义",
        hint: "您标记的条目 — 仅保存在本设备。",
        empty: "尚无收藏。点按各条目的收藏图标即可收藏。",
        add: "收藏第{n}条",
        remove: "取消收藏第{n}条",
        article: "第{n}条",
        goto: "阅读第{n}条"
      }
    }
  };
})();
