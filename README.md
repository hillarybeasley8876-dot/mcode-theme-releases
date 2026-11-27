# MCode 万圣节主题 · MiniMax Code 桌面主题包

给 [MiniMax Code](https://www.minimaxi.com) 桌面版换一套万圣节皮肤，并在启动时播一段
13 秒的万圣节开屏动画。

- **开屏动画** — 女巫装章鱼娘、南瓜灯、蝙蝠、紫色药水烟，动画结尾直接变成软件自己的首页。
- **界面皮肤** — 深紫夜色、南瓜橙按钮，首页有月亮、蝙蝠、南瓜灯和探头的小幽灵，
  问候语固定为「不给代码，就捣蛋！」。

不改软件本身的功能，随时可以一键还原。只支持 Windows。

## 下载

见 [Releases](../../releases)。`MiniMaxCodeBoot-万圣节版.zip` 是完整主题包，
解压即用。

## 目录结构

| 路径 | 说明 |
|---|---|
| `launcher/` | 启动器（C#，WPF）。播放开屏动画并把真实窗口交给客户端。MIT 许可。 |
| `film/` | 开屏动画的 Remotion 源码。`src/hw/` 是万圣节合成，`src/xm/` 是圣诞节合成。 |
| `skin/skin-dev/` | 客户端皮肤的源码。`css/` 与 `css-xm/` 是手写装饰层， |
| | `10-tokens.gen.css` 由 `build_css.py` / `build_xm_css.py` 从客户端调色板生成。 |
| | 同一目录也放着打包与校验脚本（`make_hw_package.py`、`verify_hw_package.py`）。 |
| `skin/skin-dev/assets/` | AI 生成的形象与装饰素材，公开仓库里为空 —— 成品 CSS 已内联。 |
| `docs/` | 启动器配置、快捷方式接管、测试与发布说明。 |

## 自行打包

```powershell
cd launcher
.\scripts\build.ps1      # 编译 MiniMaxCodeBoot.exe
```

```bash
cd skin/skin-dev
python build_css.py          # 重新生成 skin/halloween.css（需要 assets/ 里的素材）
python make_hw_package.py    # 打包 deliver/hw/ 下的主题包
python verify_hw_package.py  # 校验包的内容与可移植性
```

## 许可

启动器、构建脚本与文档按 [MIT](launcher/LICENSE) 发布。角色形象、音乐与音效不适用
MIT，详见 [THIRD_PARTY_NOTICES.md](launcher/THIRD_PARTY_NOTICES.md)。

本项目是独立作品，和 MiniMax 官方无隶属关系。
