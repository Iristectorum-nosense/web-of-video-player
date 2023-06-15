import React, { useRef, useEffect, useState } from 'react';
import useAnimation from './playVideo';

export default function useVideotape() {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

    function startVideotape(canvas: HTMLCanvasElement) {
        // 捕获 canvas 的帧数据, 创建 MediaRecorder 对象
        const stream = canvas.captureStream();
        const videoType = 'webm';
        const mediaRecorder = new MediaRecorder(stream, { mimeType: `video/${videoType}` });

        // canvas 更新后的数据存入 Blob, 不能使用 useState 管理, 会不同步
        const streams: Blob[] = [];

        mediaRecorder.ondataavailable = function (e) {
            if (e.data && e.data.size) {
                streams.push(e.data);
            }
        }

        mediaRecorder.onstop = function () {
            const blob = new Blob(streams, { type: `video/${videoType}` });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${new Date().getTime()}.${videoType}`;
            link.click();
        }

        setMediaRecorder(mediaRecorder);
        mediaRecorder.start();
    }

    function stopVideotape() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setMediaRecorder(null);
        }
    }

    return { startVideotape, stopVideotape };
}
