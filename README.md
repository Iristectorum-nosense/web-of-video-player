# 简易视频播放器
<img src='https://github.com/Iristectorum-nosense/web-of-video-player/blob/main/assets/1686905733818.png' />

<img src='https://github.com/Iristectorum-nosense/web-of-video-player/blob/main/assets/1686905733831.png' />

<img src='https://github.com/Iristectorum-nosense/web-of-video-player/blob/main/assets/1686905733866.png' />

## 项目简介
本项目是一个基于 video.js + flv.js 的视频播放器，该项目实现 mov / mp4 / flv 视频文件的播放，支持对视频反色、涂抹马赛克、截屏和录制。

## 技术栈
<img src='https://img.shields.io/badge/React.js-orange' /> <img src='https://img.shields.io/badge/video.js-green' /> <img src='https://img.shields.io/badge/flv.js-green' />

React 框架相关详情可参阅 <a href='https://github.com/Iristectorum-nosense/web-of-video-player/blob/main/package.json' title='web-of-video-player/package.json' >web-of-video-player/package.json</a>

## 项目结构及注释
```
.
├─ web-of-video-player
│  ├─ public
│  ├─ src
│  │  ├─ components/Player  // 视频播放器
│  │  │  ├─ Player.tsx                    # 播放器主组件
│  │  |  └─ Player.scss
│  │  |
│  │  ├─ source  // mov、mp4、flv 视频文件，可下载供项目测试（无任何商用用途）
│  │  |
│  │  ├─ utils // 相关功能函数
│  │  |  ├─ invert.tsx                   # 反色功能
│  │  |  ├─ pixelate.tsx                 # 马赛克功能
│  │  |  ├─ playVideo.tsx                # 原视频帧渲染至 <canvas> 供录制使用
│  │  |  ├─ screenshot.tsx               # 截图功能
│  │  |  └─ videotape.jsx                # 录制功能
│  │  |
|  |  ├─ index.tsx  // React 根组件
│  │  |...
│  │  └─
|  |
│  ├─ .gitignore
│  ├─ package-lock.json
│  ├─ package.json
│  └─ README.md
└─
```

