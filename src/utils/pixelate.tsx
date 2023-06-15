import React, { useRef, useEffect } from 'react';

export function usePixelate(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
    const pixlateIdRef = useRef<number | null>(null);
    const stopPixelateFlagRef = useRef(false);

    function pixelate(ctx: CanvasRenderingContext2D, pathCanvas: HTMLCanvasElement, pixelateCanvas: HTMLCanvasElement, originCanvas: HTMLCanvasElement, width: number, height: number) {
        // 执行 pixelate 动画的代码
        const pathCtx = pathCanvas.getContext('2d');
        const pixelateCtx = pixelateCanvas.getContext('2d');
        const originCtx = originCanvas.getContext('2d');

        // 获取视频像素数据生成马赛克化 canvas
        originCtx?.drawImage(video, 0, 0, width, height);
        const imageData = originCtx?.getImageData(0, 0, width, height);
        const pixelateData = createPixelate(imageData!, pathCtx!.lineWidth);
        pixelateCtx?.putImageData(pixelateData, 0, 0);

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(pathCanvas, 0, 0, width, height);
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(pixelateCanvas, 0, 0, width, height);
        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(originCanvas, 0, 0, width, height);

        // 判断是否需要停止递归调用
        if (stopPixelateFlagRef.current) {
            return;
        }

        // 递归调用 pixelate 函数
        pixlateIdRef.current = requestAnimationFrame(() => pixelate(ctx, pathCanvas, pixelateCanvas, originCanvas, width, height));
    }

    function createPixelate(imageData: ImageData, blockSize: number) {
        const { width, height, data } = imageData;

        // 计算以 blockSize * blockSize 切分像素块在行列方向能排列的个数
        const blockWidthNum = Math.ceil(width / blockSize);
        const blockHeightNum = Math.ceil(height / blockSize);

        for (let col = 0; col < blockWidthNum; col++) {
            let blockWidthSize = blockSize;
            if (col + 1 === blockWidthNum) {
                // 最后一个行方向的像素块宽度
                blockWidthSize = width - col * blockSize;
            }

            for (let row = 0; row < blockHeightNum; row++) {
                let blockHeightSize = blockSize;
                if (row + 1 === blockHeightNum) {
                    // 最后一个列方向的像素块高度
                    blockHeightSize = height - row * blockSize;
                }

                // 计算像素块内各像素总值
                let totalR = 0;
                let totalG = 0;
                let totalB = 0;
                let totalA = 0;

                for (let y = 0; y < blockHeightSize; y++) {
                    for (let x = 0; x < blockWidthSize; x++) {
                        let index = ((row * blockSize + y) * width + col * blockSize + x) * 4;
                        totalR += data[index];
                        totalG += data[index + 1];
                        totalB += data[index + 2];
                        totalA += data[index + 3];
                    }
                }

                // 平均值作为像素块内各像素的值
                let countR = blockHeightSize * blockWidthSize;
                const avgR = Math.round(totalR / countR);
                const avgG = Math.round(totalG / countR);
                const avgB = Math.round(totalB / countR);
                const avgA = Math.round(totalA / countR);

                for (let y = 0; y < blockHeightSize; y++) {
                    for (let x = 0; x < blockWidthSize; x++) {
                        let index = ((row * blockSize + y) * width + col * blockSize + x) * 4;
                        data[index] = avgR;
                        data[index + 1] = avgG;
                        data[index + 2] = avgB;
                        data[index + 3] = avgA;
                    }
                }
            }
        }

        return imageData;
    }

    function createCanvas(canvas: HTMLCanvasElement) {
        const newCanvas = document.createElement('canvas');
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;

        return newCanvas;
    }

    function drawPath(canvas: HTMLCanvasElement) {
        const pathCanvas = createCanvas(canvas);
        const pathCtx = pathCanvas.getContext('2d');
        pathCtx!.strokeStyle = 'red';
        pathCtx!.lineWidth = 30;

        canvas.addEventListener('mousedown', drawDown);

        function drawDown(e: MouseEvent) {
            // 画布分辨率和元素实时比例
            const ratio = pathCanvas.width / canvas.getBoundingClientRect().width;
            pathCtx?.moveTo(e.offsetX * ratio, e.offsetY * ratio);
            canvas.addEventListener('mousemove', drawMove);
            canvas.addEventListener('mouseup', drawUp);
        }

        function drawMove(e: MouseEvent) {
            // 画布分辨率和元素实时比例
            const ratio = pathCanvas.width / canvas.getBoundingClientRect().width;
            pathCtx?.lineTo(e.offsetX * ratio, e.offsetY * ratio);
            pathCtx?.stroke();
        }

        function drawUp(e: MouseEvent) {
            pathCtx?.stroke();
            canvas.removeEventListener('mousemove', drawMove);
            canvas.removeEventListener('mouseup', drawUp);
        }

        return pathCanvas;
    }

    function startPixelate() {
        stopPixelateFlagRef.current = false;

        // 2D 绘图上下文对象的主 canvas
        const ctx = canvas.getContext('2d');

        const width = canvas.width = video.videoWidth;
        const height = canvas.height = video.videoHeight;

        // 路径绘制 canvas
        const pathCanvas = drawPath(canvas);

        // 视频帧马赛克化 canvas, 直接根据 pathCanvas 修改主 canvas 十分卡顿
        const pixelateCanvas = createCanvas(canvas);

        // 绘制源视频的 canvas, 解决马赛克闪烁
        const originCanvas = createCanvas(canvas);

        pixelate(ctx!, pathCanvas, pixelateCanvas, originCanvas, width, height);
    }

    function stopPixelate() {
        stopPixelateFlagRef.current = true;

        if (pixlateIdRef.current) cancelAnimationFrame(pixlateIdRef.current);
    }

    useEffect(() => {
        return () => {
            stopPixelate();
        };
    }, []);

    return { startPixelate, stopPixelate };
}
