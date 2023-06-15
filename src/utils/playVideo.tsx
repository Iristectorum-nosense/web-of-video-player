import React, { useRef, useEffect } from 'react';

export default function useAnimation(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
    const animationIdRef = useRef<number | null>(null);
    const stopAnimationFlagRef = useRef(false);

    function animate(ctx: CanvasRenderingContext2D, width: number, height: number) {
        // 执行动画的代码
        ctx.drawImage(video, 0, 0, width, height);

        // 判断是否需要停止递归调用
        if (stopAnimationFlagRef.current) {
            return;
        }

        // 递归调用 animate 函数
        animationIdRef.current = requestAnimationFrame(() => animate(ctx, width, height));
    }

    function startAnimation() {
        stopAnimationFlagRef.current = false;

        // 2D 绘图上下文对象
        const ctx = canvas.getContext('2d');

        const width = canvas.width = video.videoWidth;
        const height = canvas.height = video.videoHeight;

        animate(ctx!, width, height);
    }

    function stopAnimation() {
        stopAnimationFlagRef.current = true;
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    }

    useEffect(() => {
        return () => {
            stopAnimation();
        };
    }, []);

    return { startAnimation, stopAnimation };
}