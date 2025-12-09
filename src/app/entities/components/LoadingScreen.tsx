'use client'

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Загрузка...</h2>
                <p className="text-gray-300">Пожалуйста, подождите</p>
            </div>
        </div>
    )
}