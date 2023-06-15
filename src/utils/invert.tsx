import React, { useRef, useEffect } from 'react';

export function useInvert(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
    const invertIdRef = useRef<number | null>(null);
    const stopInvertFlagRef = useRef(false);

    function invert(ctx: CanvasRenderingContext2D, width: number, height: number) {
        // 执行 invert 动画的代码
        ctx.drawImage(video, 0, 0, width, height);

        // 获取 canvas 像素数据
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // 反色
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
            data[i + 3] = 255;
        }

        // 处理后的像素写回 canvas
        ctx.putImageData(imageData, 0, 0);

        // 判断是否需要停止递归调用
        if (stopInvertFlagRef.current) {
            return;
        }

        // 递归调用 invert 函数
        invertIdRef.current = requestAnimationFrame(() => invert(ctx, width, height));
    }

    function startInvert() {
        stopInvertFlagRef.current = false;

        // 2D 绘图上下文对象
        const ctx = canvas.getContext('2d');

        const width = canvas.width = video.videoWidth;
        const height = canvas.height = video.videoHeight;

        invert(ctx!, width, height);
    }

    function stopInvert() {
        stopInvertFlagRef.current = true;

        if (invertIdRef.current) cancelAnimationFrame(invertIdRef.current);
    }

    useEffect(() => {
        return () => {
            stopInvert();
        };
    }, []);

    return { startInvert, stopInvert };
}