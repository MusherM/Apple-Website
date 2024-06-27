import { useGSAP } from '@gsap/react'
import { chipImg, fireflyVideo, frameImg } from '../utils'
import gsap from 'gsap'
import { useRef } from 'react'
import { animateGsap } from '../utils/animation'

const HowItWorks = () => {
  const videoRef = useRef()

  useGSAP(() => {
    gsap.to('#fireflyVideo', {
      scrollTrigger: {
        trigger: '#fireflyVideo',
        toggleActions: 'play pause reverse restart',
        start: '-10% bottom'
      },
      onComplete: () => {
        videoRef.current.play()
      }
    })

    gsap.from('#chip', {
      scrollTrigger: {
        trigger: '#chip',
        start: '20% bottom'
      },
      opacity: 0,
      scale: 2,
      duration: 2,
      ease: 'power2.inOut'
    })

    animateGsap(
      '.g_fadeIn',
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.inOut'
      },
      {
        start: 'top 100%'
      }
    )
  }, [])

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <div id="chip" className="flex-center w-full my-20">
          <img src={chipImg} alt="chip" width={180} height={180} />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="hiw-title">
            A17 Pro chip.
            <br />A monster win for gaming.
          </h2>

          <p className="hiw-subtitle">
            It's here. The biggest redesign in the history of Apple GPUs.
          </p>
        </div>

        <div className="mt-10 md:mt-20 mb-14">
          <div className="relative h-full flex-center">
            <div className="overflow-hidden">
              <img
                src={frameImg}
                alt="frame"
                className="bg-transparent relative z-10"
              />
            </div>
            <div className="hiw-video">
              <video
                className="pointer-events-none size-full object-cover"
                playsInline
                preload="none"
                muted
                autoPlay
                ref={videoRef}
                id="fireflyVideo"
              >
                <source src={fireflyVideo} type="video/mp4" />
              </video>
            </div>
          </div>

          <p className="text-gray font-semibold text-center mt-3">
            Honkai: Star Rail
          </p>
          <p className="text-[#000] font-semibold text-center mt-3">
            你说的没错，但这就是流萤，集加速、自拉条、希儿的再动、比银狼还强的
            100%
            上弱点、击破、超击破、自戕、自回血、自回能于一体，甚至还是美少女，甚至还能开机甲！这哪里是三体人，这简直就是新世纪福音战士。
          </p>
        </div>

        <div className="hiw-text-container">
          <div className="flex flex-1 flex-col justify-center">
            <p className="hiw-text g_fadeIn">
              A17 Pro is an entirely new class of iPhone chip that delivers our{' '}
              <span className="text-white">
                best graphic performance by far.
              </span>
            </p>

            <div className="flex-1 flex-center">
              <p className="hiw-text g_fadeIn">
                Mobile{' '}
                <span className="text-white">
                  games will look and feel so immersive{' '}
                </span>
                with incredibly detailed environments and characters.
              </p>
            </div>
          </div>

          <div className="flex-1 flex justify-center flex-col g_fadeIn">
            <p className="hiw-text">New</p>
            <p className="hiw-bigtext">Pro-class GPU</p>
            <p className="hiw-text">with 6 cores</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
