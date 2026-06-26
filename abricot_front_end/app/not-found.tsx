'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function NotFound() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js'
    script.onload = () => {
      const anime = (window as any).anime
      if (!anime) return
      anime({
        targets: '#zero',
        translateY: 10,
        autoplay: true,
        loop: true,
        easing: 'easeInOutSine',
        direction: 'alternate',
      })
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-5 py-10">
      <div className="w-full max-w-[700px]">
        <svg
          width="100%"
          height="auto"
          viewBox="0 0 636 324"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g id="OBJECTS">
            <g id="Group">
              <path
                d="M101.3 255.2C101.3 255.2 111.1 272.6 181.8 280.5C252.5 288.4 288.2 314.9 333.1 322.8C378 330.7 433.6 278.5 481.8 286.5C530 294.4 588.2 264.2 592.8 255.2H101.3Z"
                fill="#2F1829"
              />
              <path
                d="M611.9 251.7H601.4L140.8 251.8C140.8 251.8 136.1 248.1 128.9 241.8C125.8 239.1 122.2 235.9 118.3 232.3C116.9 231 115.4 229.6 113.9 228.2C100.2 215.3 83.6 198.2 70.1 180.1C55.9 161 45.1 140.6 44.8 122.6C44.8 122.2 44.8 121.8 44.8 121.4C45 104 48.4 85.1 56.9 67.7C61.9 57.5 68.5 47.8 77.3 39C100.1 16.2 137.1 0.300011 194.5 0.800011C261.4 1.30001 330.8 26.3 393.5 60.8C406.6 68 419.4 75.7 431.9 83.6C441.1 89.5 450.1 95.5 458.8 101.6C483.1 118.6 505.6 136.4 525.5 153.8C570.6 193.1 602.3 230.4 611.9 251.7Z"
                fill="url(#paint0_linear)"
              />
              <path
                d="M631.8 258.5H75.5C73.6 258.5 72.1 257 72.1 255.1C72.1 253.2 73.6 251.7 75.5 251.7H631.8C633.7 251.7 635.2 253.2 635.2 255.1C635.2 257 633.7 258.5 631.8 258.5Z"
                fill="#2F1829"
              />
              <path
                d="M461 295.7C461 295.7 425 303.6 415.8 315.9C411.3 321.9 429.2 321 444.5 314.4C460.5 307.5 473.6 294.9 461 295.7Z"
                fill="#2F1829"
              />
              <path
                d="M200.2 293.4C200.2 293.4 214.2 293.1 226.5 297.9C238.8 302.7 241.5 317.4 229.2 319.2C217 321 189.1 304.7 190.7 298.1C191.9 293.1 200.2 293.4 200.2 293.4Z"
                fill="#2F1829"
              />
            </g>
            <g id="Group_7">
              <path
                d="M237.3 191.1V97.5H201.8V97.8L159 166.6L140.3 196.7L142.4 218.4H201.8V251H237.3V218.4H253V191H237.3V191.1ZM201.8 191.1H174.2L199.6 147.4L201.8 143.8V191.1Z"
                fill="url(#paint6_linear)"
              />
              <path
                d="M487.5 191.1V97.5H452V97.8L390.5 196.7L392.6 218.4H452V251H487.5V218.4H503.1V191H487.5V191.1ZM452 191.1H424.4L449.8 147.4L452 143.8V191.1Z"
                fill="url(#paint8_linear)"
              />
            </g>
            <g id="zero">
              <path
                d="M361.2 110.3C351.9 99 338.7 93.3 321.6 93.3C304.6 93.3 291.4 98.9 282.1 110.2C272.8 121.5 268.1 137.4 268.1 158.2V186.3C268.1 206.9 272.8 222.9 282.1 234.2C291.5 245.5 304.7 251.2 321.8 251.2C338.7 251.2 351.9 245.6 361.2 234.3C370.5 223 375.2 207.1 375.2 186.3V158.3C375.2 137.6 370.5 121.6 361.2 110.3ZM303.8 151.3C304 141 305.5 133.4 308.3 128.3C311.1 123.2 315.5 120.7 321.6 120.7C327.9 120.7 332.4 123.4 335.3 128.9C338.2 134.4 339.6 142.6 339.6 153.6V191.6C339.5 202.6 338.1 210.7 335.2 215.9C332.3 221.1 327.8 223.7 321.8 223.7C315.5 223.7 311 221 308.1 215.7C305.4 210.7 303.9 202.9 303.8 192.5V151.3Z"
                fill="url(#paint7_linear)"
              />
              <path
                d="M291.5 110.1C291.5 110.1 279.6 101.5 278.3 88.1C286.9 90.5 291.5 101 291.5 101C291.5 101 289.3 91.4 291.5 84.9C297.8 94.1 296.1 101.6 291.5 110.1Z"
                fill="url(#paint9_linear)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="327.54"
                y1="250.471"
                x2="330.184"
                y2="46.9149"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#E8D197" />
                <stop offset="1" stopColor="#FEF5DA" />
              </linearGradient>
              <linearGradient
                id="paint6_linear"
                x1="197.311"
                y1="242.736"
                x2="195.989"
                y2="148.447"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2F1829" />
                <stop offset="1" stopColor="#3B223C" />
              </linearGradient>
              <linearGradient
                id="paint7_linear"
                x1="322.636"
                y1="240.979"
                x2="321.314"
                y2="146.691"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2F1829" />
                <stop offset="1" stopColor="#3B223C" />
              </linearGradient>
              <linearGradient
                id="paint8_linear"
                x1="447.456"
                y1="239.229"
                x2="446.134"
                y2="144.941"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2F1829" />
                <stop offset="1" stopColor="#3B223C" />
              </linearGradient>
              <linearGradient
                id="paint9_linear"
                x1="281.068"
                y1="73.4007"
                x2="292.303"
                y2="109.089"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2F1829" />
                <stop offset="1" stopColor="#3B223C" />
              </linearGradient>
            </defs>
          </g>
        </svg>
      </div>

      <h2 className="text-[28px] font-bold text-[#2F1829] mt-8 text-center">
        Oups ! Page introuvable
      </h2>
      <p className="text-base text-gray-500 mt-2 text-center">
        La page que vous cherchez n'existe pas.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 px-8 py-3 bg-[var(--color-abricot-text)] text-white rounded-lg text-sm font-medium hover:bg-[#b84a09] transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}
