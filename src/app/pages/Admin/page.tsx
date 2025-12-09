'use client'

import { useState, useEffect } from 'react'
import Test from "@/app/entities/scenes/test"
import LoadingScreen from '@/app/entities/components/LoadingScreen'

export default function Admin() {
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
            <Test />
        </div>
    )
}