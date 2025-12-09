'use client'

import { useState, useEffect } from 'react'
import LoadingScreen from '@/app/entities/components/LoadingScreen'
import LivingScene from '@/app/entities/scenes/living'

export default function OfficePage() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div>
            {isLoading && <LoadingScreen />}
            <LivingScene />
        </div>
    )
}