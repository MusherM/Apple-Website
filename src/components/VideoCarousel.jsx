import { useRef, useState, useEffect } from 'react'
import { hightlightsSlides } from '../constants'
import gsap from 'gsap'
import { pauseImg, playImg, replayImg } from '../utils'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

const VideoCarousel = () => {
  const videoRef = useRef([])
  const videoSpanRef = useRef([])
  const videoDivRef = useRef([])

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false
  })

  const [loadedData, setLoadedData] = useState([])

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video

  useGSAP(() => {
    gsap.to('#slider', {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: 'power2.inOut'
    })

    gsap.to('#video', {
      scrollTrigger: {
        trigger: '#video',
        toggleActions: 'restart none none none'
      },
      onComplete: () => {
        setVideo(pre => ({
          ...pre,
          startPlay: true,
          isPlaying: true
        }))
      }
    })
  }, [isEnd, videoId])

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause()
      } else {
        startPlay && videoRef.current[videoId].play()
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData])

  const handleLoadedMetadata = (i, e) => setLoadedData(pre => [...pre, e])

  useEffect(() => {
    let currentProgress = 0
    const span = videoSpanRef.current

    if (span[videoId]) {
      // animate the progress of the video
      const anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100)

          if (progress !== currentProgress) {
            currentProgress = progress

            // 控制外层 div 的宽度（进度条的总长度）,效果是播放到的视频，下面的小圆点展开为长的进度条
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? '10vw'
                  : window.innerWidth < 1200
                    ? '10vw'
                    : '4vw'
            })

            // 控制进度条的宽度（随视频进度同步），即进度条往前走
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: 'white'
            })
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: '12px',
              duration: 0.5
            })
            gsap.to(span[videoId], {
              backgroundColor: '#afafaf',
              duration: 0.5
            })
          }
        }
      })

      if (videoId === 0) {
        anim.restart()
      }

      // 该函数用于计算进度，如果进度不匹配，则触发动画更新
      // 而前面的 gsap.to() 则是用于动画的实际更新
      const animUpdate = () => {
        const cur = videoRef.current[videoId].currentTime
        const dur = hightlightsSlides[videoId].videoDuration
        anim.progress(cur / dur)
      }

      if (isPlaying) {
        gsap.ticker.add(animUpdate)
      } else {
        gsap.ticker.remove(animUpdate)
      }

      // 返回一个清除动画的函数，这里至关重要，否则在点击切换时会出现重复动画
      return () => gsap.ticker.remove(animUpdate)
    }
  }, [videoId, startPlay])

  const handleProcess = (type, i) => {
    switch (type) {
      case 'video-end':
        setVideo(prev => ({
          ...prev,
          isEnd: true,
          videoId: i + 1
        }))
        break

      case 'video-last':
        setVideo(prev => ({
          ...prev,
          isLastVideo: true
        }))
        break

      case 'video-reset':
        setVideo(prev => ({
          ...prev,
          isLastVideo: false,
          videoId: 0
        }))
        break

      case 'pause':
      case 'play':
        setVideo(prev => ({
          ...prev,
          isPlaying: !prev.isPlaying
        }))
        break

      default:
        return video
    }
  }

  const handleClick = i => {
    // #TODO: 等动画播放完成再播放视频
    if (isPlaying) {
      videoRef.current[videoId].pause()
      videoRef.current[videoId].currentTime = 0
    }
    setVideo(prev => ({
      ...prev,
      isEnd: true,
      videoId: i,
      isLastVideo: false,
      isPlaying: true
    }))
  }

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="size-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline
                  preload="auto"
                  muted
                  className={`${list.id === 2 && 'translate-x-44'} pointer-events-none`}
                  ref={el => {
                    videoRef.current[i] = el
                  }}
                  onEnded={() => {
                    i !== 3
                      ? handleProcess('video-end', i)
                      : handleProcess('video-last')
                  }}
                  onPlay={() => {
                    setVideo(prevVideo => ({
                      ...prevVideo,
                      isPlaying: true
                    }))
                  }}
                  onLoadedMetadata={e => handleLoadedMetadata(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map(text => (
                  <p key={text} className="md:text-3xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={el => {
                videoDivRef.current[i] = el
              }}
              className="mx-2 size-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute size-full rounded-full"
                ref={el => {
                  videoSpanRef.current[i] = el
                }}
                onClick={() => handleClick(i)}
              ></span>
            </span>
          ))}
        </div>
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
            onClick={
              isLastVideo
                ? () => handleProcess('video-reset')
                : !isPlaying
                  ? () => handleProcess('play')
                  : () => handleProcess('pause')
            }
          />
        </button>
      </div>
    </>
  )
}

export default VideoCarousel
