'use client'

// import Link from "next/link";
// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="relative min-h-screen">
//       <Image
//         src="/img/start.png"
//         alt="Фон игры"
//         fill
//         className="object-cover"
//         quality={100}
//         priority
//       />

//       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-8">
//         <h1 className="text-6xl font-bold text-white text-center font-serif tracking-wide drop-shadow-2xl">
//           Office Values
//         </h1>

//         <Link
//           href="/pages/Admin"
//           className="bg-gray-600/90 hover:bg-gray-700/90 text-white font-small py-4 px-12 rounded-2xl text-xl transition-all duration-300 shadow-2xl hover:shadow-gray-900/60 border border-gray-400 hover:scale-105 backdrop-blur-sm"
//         >
//           Начать игру
//         </Link>
//       </div>
//     </div>
//   );
// }


















import Link from "next/link";
import RotatingOfficeScene from "./entities/components/RotatingOfficeScene";
import { useEffect, useState } from "react";
import LoadingScreen from "./entities/components/LoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])
  return (
    <>
      {isLoading && <LoadingScreen />}
      <RotatingOfficeScene />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-8">
        <h1 className="text-6xl font-bold text-white text-center font-serif tracking-wide drop-shadow-2xl">
          Office Values
        </h1>

        <Link
          href="/pages/Admin"
          className="bg-gray-600/90 hover:bg-gray-700/90 text-white font-semibold py-4 px-12 rounded-2xl text-xl transition-all duration-300 shadow-2xl hover:shadow-gray-900/60 border border-gray-400 hover:scale-105 backdrop-blur-sm"
        >
          Начать игру
        </Link>
      </div>
    </>
  )
}