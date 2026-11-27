# 皮肤素材说明

这个目录在公开仓库里是空的。

`build_css.py` / `build_xm_css.py` 会把 `css/20-decor.css` 里的 `asset(name.ext)`
替换成 `assets/` 下同名文件的 data URI（base64 内联）。因此：

- **成品主题包不需要这个目录** —— 发布的 `halloween.css` / `christmas.css` 已经把
  素材内联进去了，解压即用。
- **要重新生成 CSS**，就把素材放回这个目录再跑 `python build_css.py`。
- 素材缺失时脚本不会崩，它会打印一条 WARNING，并把引用保留成相对路径。

这些素材是 AI 生成的章鱼娘形象与万圣节/圣诞装饰（`.webp` / `.svg`），
连同配乐与音效一起按各自的权利归属发布，不适用本仓库的 MIT 许可，
详见 `launcher/THIRD_PARTY_NOTICES.md`。
