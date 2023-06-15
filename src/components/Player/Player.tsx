import React, { useEffect, useRef, useState } from 'react';
import './Player.scss';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import flvjs from 'flv.js';
import { Button, Modal, Upload, message } from 'antd';
import { UploadOutlined, BranchesOutlined, CameraOutlined, VideoCameraOutlined, MergeCellsOutlined, TableOutlined } from '@ant-design/icons';
import { useInvert } from '../../utils/invert';
import { usePixelate } from '../../utils/pixelate';
import screenshot from '../../utils/screenshot';
import useVideotape from '../../utils/videotape';
import useAnimation from '../../utils/playVideo';

const Player: React.FC = () => {
    const [videoModal, setVideoModal] = useState<boolean>(true)
    const [videoSrc, setVideoSrc] = useState<string | null>(null)
    const [videoType, setVideoType] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const videoPlayer = useRef<any>(null);

    const invertRef = useRef<HTMLCanvasElement | null>(null);
    const pixelateRef = useRef<HTMLCanvasElement | null>(null);
    const videotapeRef = useRef<HTMLCanvasElement | null>(null);

    const [isInvert, setIsInvert] = useState<boolean>(false);
    const [isPixelate, setIsPixelate] = useState<boolean>(false);
    const [isScreenshot, setIsScreenshot] = useState<boolean>(false);
    const [isVideotape, setIsVideotape] = useState<boolean>(false);

    const { startInvert, stopInvert } = useInvert(invertRef.current!, videoRef.current!);
    const { startPixelate, stopPixelate } = usePixelate(pixelateRef.current!, videoRef.current!)
    const { startVideotape, stopVideotape } = useVideotape();
    const { startAnimation, stopAnimation } = useAnimation(videotapeRef.current!, videoRef.current!);

    const showVideoModal = (type: 'open' | 'close') => {
        if (type === 'close') setVideoModal(false)
        else setVideoModal(true)
    }

    const handleUpload = (file: File, fileList: File[]) => {
        const url = URL.createObjectURL(fileList[0]);
        let type = file.name.substring(file.name.lastIndexOf('.') + 1)

        // videojs 需要指定 .mov 文件的 MIME 类型为 video/mp4
        if (type === 'mov' || type === 'mp4') type = 'video/mp4'
        if (type === 'flv') type = 'flv'

        setVideoSrc(url);
        setVideoType(type);
        showVideoModal('close');

        return false;
    }

    const handleInvert = () => {
        if (isVideotape) {
            message.error('请先结束录制');
        } else {
            if (!isInvert) setIsPixelate(false);
            setIsInvert(!isInvert);
        }
    }

    const handlePixlate = () => {
        if (isVideotape) {
            message.error('请先结束录制');
        } else {
            if (!isPixelate) setIsInvert(false);
            setIsPixelate(!isPixelate);
        }
    }

    const handleScreenshot = () => {
        setIsScreenshot(true);
    }

    const handleVideotape = () => {
        setIsVideotape(!isVideotape);
    }

    useEffect(() => {
        if (videoSrc && videoRef.current) {
            if (videoType !== 'video/mp4' && videoType !== 'flv') {
                setVideoSrc(null);
                message.error('不支持此类文件');
                setVideoModal(true);
            } else {
                // 创建播放器实例
                videoPlayer.current = videojs(videoRef.current, {
                    controls: true,
                    fluid: true,
                });

                if (videoType === 'flv' && flvjs.isSupported()) {
                    // 如果是 .flv, 关联并覆盖 videojs 创建的实例
                    videoPlayer.current = flvjs.createPlayer({
                        type: videoType,
                        url: videoSrc,
                    });
                    videoPlayer.current.attachMediaElement(videoRef.current);
                    videoPlayer.current.load();
                }

                if (videoType === 'video/mp4') {
                    videoPlayer.current.src([
                        {
                            src: videoSrc,
                            type: videoType,
                        }
                    ])
                }
            }
        }
    }, [videoSrc]);

    useEffect(() => {
        // 销毁播放器实例
        return () => {
            if (videoPlayer.current) {
                videoPlayer.current.dispose();
            }
        };
    }, [])

    useEffect(() => {
        // 控制显示反色 canvas 还是马赛克 canvas
        if (videoRef.current) {
            const playerContainer = document.getElementById('playerContainer');
            const invertCanvas = document.getElementById('invert');
            const pixelateCanvas = document.getElementById('pixelate');

            if (isInvert || isPixelate) {
                if (playerContainer) playerContainer.style.gridTemplateColumns = '50% 50%';
            }

            if (!isInvert && !isPixelate) {
                if (playerContainer) playerContainer.style.gridTemplateColumns = '';
                if (invertCanvas && pixelateCanvas) {
                    pixelateCanvas.style.display = 'none';
                    invertCanvas.style.display = 'none';
                }
            }

            if (isInvert) {
                if (invertCanvas && pixelateCanvas) {
                    invertCanvas.style.display = 'flex';
                    pixelateCanvas.style.display = 'none';
                }
            }

            if (isPixelate) {
                if (invertCanvas && pixelateCanvas) {
                    pixelateCanvas.style.display = 'flex';
                    invertCanvas.style.display = 'none';
                }
            }
        }
    }, [isInvert, isPixelate])

    useEffect(() => {
        // 反色逻辑
        if (invertRef.current && videoRef.current) {
            if (isInvert) {
                // 监听 timeupdate 事件进行反色, 画面不流畅
                // 直接使用 requestAnimationFrame 时, 其 ID 因为处理程序时差不能正确被停止
                startInvert();
            } else {
                stopInvert();
            }
        }
    }, [isInvert])

    useEffect(() => {
        // 马赛克逻辑
        if (pixelateRef.current && videoRef.current) {
            if (isPixelate) {
                startPixelate();
            } else {
                stopPixelate();
            }
        }
    }, [isPixelate])

    useEffect(() => {
        // 截图逻辑
        if (videoRef.current && isScreenshot) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;

            // 反色和马赛克时, 返回对应图像, 否则使用原图像
            let video: HTMLVideoElement | HTMLCanvasElement;
            if (isInvert && invertRef.current) video = invertRef.current;
            else if (isPixelate && pixelateRef.current) video = pixelateRef.current;
            else video = videoRef.current;

            screenshot(canvas, video, setIsScreenshot);
        }
    }, [isScreenshot])

    useEffect(() => {
        // 录制逻辑
        if (videoRef.current) {
            if (isVideotape) {
                // 反色和马赛克时, 返回对应视频, 否则使用原视频
                if (isInvert && invertRef.current) startVideotape(invertRef.current);
                else if (isPixelate && pixelateRef.current) startVideotape(pixelateRef.current);
                else if (videotapeRef.current) {
                    startAnimation();
                    startVideotape(videotapeRef.current);
                }
            } else {
                stopAnimation();
                stopVideotape();
            }
        }
    }, [isVideotape])

    return (
        <>
            <div id='playerContainer' className='player-container' >
                <video ref={videoRef} className='video-js' />
                <canvas id='invert' ref={invertRef} className='video-js' style={{ display: 'none' }} />
                <canvas id='pixelate' ref={pixelateRef} className='video-js' style={{ display: 'none' }} />
            </div >
            <div className='player-navigator' >
                <Button onClick={() => showVideoModal('open')}><BranchesOutlined />选择视频源</Button>
                {
                    videoSrc
                        ? <>
                            <Button onClick={handleScreenshot}><CameraOutlined />
                                {
                                    isScreenshot ? <>正在截图</> : <>截图</>
                                }
                            </Button>
                            <Button onClick={handleVideotape}><VideoCameraOutlined />
                                {
                                    isVideotape ? <>正在录制</> : <>录制</>
                                }
                            </Button>
                            <Button onClick={handleInvert}><MergeCellsOutlined />
                                {
                                    isInvert ? <>取消反色</> : <>反色播放</>
                                }
                            </Button>
                            <Button onClick={handlePixlate}><TableOutlined />
                                {
                                    isPixelate ? <>涂抹右侧视频区域打码</> : <>区域打码</>
                                }
                            </Button>
                        </> : null
                }
            </div>
            <canvas id='videotape' ref={videotapeRef} className='video-js' style={{ display: 'none' }} />
            <Modal
                open={videoModal}
                onCancel={() => showVideoModal('close')}
                footer={null}
            >
                <Upload beforeUpload={handleUpload} maxCount={1} showUploadList={false} >
                    <Button icon={<UploadOutlined />}>选择视频文件, 支持 mp4 / mov / flv 格式</Button>
                </Upload>
            </Modal>
        </>
    )
}

export default Player;
