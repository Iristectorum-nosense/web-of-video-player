import React from 'react'

export default function screenshot(canvas: HTMLCanvasElement, source: HTMLVideoElement | HTMLCanvasElement, setIsScreenshot: React.Dispatch<React.SetStateAction<boolean>>) {
    const imageType = 'png';
    canvas.getContext('2d')?.drawImage(source, 0, 0, canvas.width, canvas.height);

    // 下载,并指定导出的 MIME 类型
    canvas.toBlob((blob) => {
        downloadFile(URL.createObjectURL(blob!), imageType);
    }, `image/${imageType}`);

    function downloadFile(blobUrl: string, imageType: string) {
        // <a> 元素用于下载文件
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = blobUrl;
        link.download = `${new Date().getTime()}.${imageType}`;
        link.click();
        setIsScreenshot(false);
    }
}
