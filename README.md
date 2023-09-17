# 简易视频播放器
<img src='https://github.com/Iristectorum-nosense/web-of-video-player/blob/main/assets/1686905733818.png' />

<img src='https://github.com/Iristectorum-nosense/web-of-video-player/blob/main/assets/1686905733831.png' />

<img src='https://github.com/Iristectorum-nosense/web-of-video-player/blob/main/assets/1686905733866.png' />

## 项目简介
一款支持在浏览器播放主流类型视频文件的 Web 应用，包含像素反转、马赛克处理、截屏和录屏功能。
1.实现浏览器播放 MOV / MP4 / FLV 格式的视频文件。
2.实现视频播放时像素反转，鼠标涂抹马赛克，利用 <canvas> 实时显示处理画面。
3.实现原画面、像素反转画面、马赛克处理画面的截屏和录屏，并自动下载保存至默认路径。

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

