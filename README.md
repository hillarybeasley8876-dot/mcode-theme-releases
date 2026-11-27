# MCode 节日主题 · MiniMax Code 桌面主题包

给 [MiniMax Code](https://www.minimaxi.com) 桌面版换一套节日皮肤，并在启动时播一段 13 秒的
节日开屏动画。现在有两套主题，各自是一个独立的包。

**圣诞节**

- **开屏动画** — 雪夜、极光和圣诞帽，穿圣诞裙、提着星灯的章鱼娘从雪雾里升起来，
  动画结尾直接变成软件自己的首页。
- **界面皮肤** — 雪夜深蓝配烛光金按钮，首页是极光下的雪林和月亮前的雪橇，慢慢飘着雪，
  还有礼物、星灯、松枝挂球和戴圣诞帽的小雪精灵，问候语固定为「圣诞快乐，许个愿吧！」。

**万圣节**

- **开屏动画** — 女巫装章鱼娘、南瓜灯、蝙蝠、紫色药水烟，动画结尾直接变成软件自己的首页。
- **界面皮肤** — 深紫夜色、南瓜橙按钮，首页有月亮、蝙蝠、南瓜灯和探头的小幽灵，
  问候语固定为「不给代码，就捣蛋！」。

不改软件本身的功能，随时可以一键还原。只支持 Windows。

## 下载

见 [Releases](../../releases)。每套主题两个文件：`.zip` 是完整主题包（启动器 + 开屏动画 + 皮肤），
解压即用；`.mp4` 是开屏动画本身（1920×1080，60fps，含配乐和音效），想单独看效果时用，可选。

| 主题 | 文件 | 大小 |
|---|---|---|
| 圣诞节 [v1.0](../../releases/tag/christmas-v1.0) | `MiniMaxCodeBoot-Christmas-v1.0-win-x64.zip` | 18.7 MB |
| | `MiniMaxCodeBoot-Christmas-boot-v1.0.mp4` | 19.3 MB |
| 万圣节 [v1.1](../../releases/tag/v1.1) | `MiniMaxCodeBoot-Halloween-v1.1-win-x64.zip` | 19.1 MB |
| | `MiniMaxCodeBoot-Halloween-boot-v1.1.mp4` | 20.1 MB |

两个 `.zip` 的 SHA-256：

```text
28042fceae31850e0d404548df150b151aa495997e7bc5c9b90cc390500b6795  MiniMaxCodeBoot-Christmas-v1.0-win-x64.zip
8c06ed978f448fbeb9a78f189f79731f8cec4e33c1d4a83a9170ef6360e39073  MiniMaxCodeBoot-Halloween-v1.1-win-x64.zip
```

## 安装

两套主题的步骤一样。解压到以后不会删、不会挪的位置，然后双击两个文件：

1. `安装皮肤.cmd` — 给软件装上皮肤，并登记后台小任务「MiniMaxCode 皮肤守护」，
   软件自动更新后自动补回。
2. `安装到快捷方式.cmd` — 把桌面和开始菜单的快捷方式改成先播动画再进软件。

之后照常点 MiniMax Code 图标就行。播放时按 Esc 或点右上角「跳过」可直接进软件。

换主题：先在正在用的那个主题文件夹里双击 `恢复原快捷方式.cmd` 和 `卸载皮肤.cmd` 还原，
再装另一个包。

不改软件本身的功能，随时可以一键还原。

## 目录结构

| 路径 | 说明 |
|---|---|
| `launcher/` | 启动器（C#，WPF）。播放开屏动画并把真实窗口交给客户端。MIT 许可。 |
| `launcher/docs/` | 启动器配置、快捷方式接管、测试与发布说明。 |
| `film/` | 开屏动画的 Remotion 源码。`src/hw/` 是万圣节合成，`src/xm/` 是圣诞节合成。 |
| `skin/skin-dev/` | 客户端皮肤的源码。`css/`（万圣节）与 `css-xm/`（圣诞节）是手写装饰层， |
| | `10-tokens.gen.css` 由 `build_css.py` / `build_xm_css.py` 从客户端调色板生成。 |
| | 同一目录也放着打包与校验脚本（`make_hw_package.py`、`make_xm_package.py`、`verify_hw_package.py`）。 |
| `skin/skin-dev/assets/` | AI 生成的形象与装饰素材，公开仓库里为空 —— 成品 CSS 已内联。 |

## 自行打包

```powershell
cd launcher
.\scripts\build.ps1      # 编译 MiniMaxCodeBoot.exe
```

万圣节：

```bash
cd skin/skin-dev
python build_css.py          # 重新生成 skin/halloween.css（需要 assets/ 里的素材）
python make_hw_package.py    # 打包 deliver/hw/ 下的主题包
python verify_hw_package.py  # 校验包的内容与可移植性
```

圣诞节：

```bash
cd skin/skin-dev
python build_xm_css.py       # 重新生成 skin/christmas.css（需要 assets/ 里的素材）
python make_xm_package.py <启动器用的视频> <分享用的成片>   # 更新启动器并打包 deliver/xm/ 下的主题包
```

## 版本

**圣诞节 v1.0** — 圣诞节主题第一次公开发布，内容是 11-12 定稿的那一版。启动器、皮肤加载器和
开关脚本与万圣节 v1.1 是同一份。

在 MiniMax Code 3.1.14 ～ 3.1.17 上实际使用过。对 3.1.19 做过静态核对（皮肤覆盖的颜色变量、
用到的界面元素、补丁位置都还在），尚未实机验证。

**万圣节 v1.1（修复版）** — 修掉了 10-30 那一版遗留的三个问题：

- **启动器交接闪一下**：动画结束、把真实窗口交出来的那一瞬间会闪回视频的最后一帧
  （假侧边栏 / 空输入框）。11-12 改了交接顺序，本版用的是修好的启动器。
- **皮肤加载器**：改成按主题取首帧底色，不再写死一个颜色。
- **皮肤开关脚本**：支持在万圣节 / 圣诞节 / 原版之间切换；安装时会顺手删掉旧版留下的
  「万圣节皮肤守护」「圣诞节皮肤守护」计划任务，不会留两套后台任务。

皮肤样式本身与当前客户端 3.1.19 兼容：用当前调色板重新生成后与发布版逐字节一致。

## 许可

启动器、构建脚本与文档按 [MIT](launcher/LICENSE) 发布。角色形象、音乐与音效不适用
MIT，详见 [THIRD_PARTY_NOTICES.md](launcher/THIRD_PARTY_NOTICES.md)。

本项目是独立作品，和 MiniMax 官方无隶属关系。
