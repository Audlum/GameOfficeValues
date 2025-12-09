interface ModalNearWomenNpcProps {
    isOpen: boolean
    onClose: () => void
    title?: string
}

export default function ModalNearWomenNpc({ isOpen, onClose, title = "Добро пожаловать в IT компанию!" }: ModalNearWomenNpcProps) {
    if (!isOpen) return null

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
                <h2 style={{
                    margin: '0 0 20px 0',
                    fontSize: '24px',
                    color: '#333',
                    textAlign: 'center'
                }}>
                    {title}
                </h2>

                <div style={{ textAlign: 'left', lineHeight: '1.6' }}>
                    <p style={{ marginBottom: '15px' }}>
                        <strong>Привет, стажёр! Я Михаил - ваш гид по ценностям нашей компании.</strong>
                    </p>

                    <p style={{ marginBottom: '15px' }}>
                        В течение следующих дней тебе предстоит познакомиться с тремя ключевыми ценностями,
                        которые лежат в основе всего, что мы делаем:
                    </p>

                    <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#2c5530' }}>Наши ценности:</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            <li style={{ marginBottom: '8px' }}>
                                <strong>Ответственность</strong> - мы доверяем и выполняем обещания
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <strong>Прозрачность</strong> - мы открыты в коммуникации и процессах
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <strong>Скорость</strong> - мы действуем быстро и эффективно
                            </li>
                        </ul>
                    </div>

                    <p style={{ marginBottom: '15px' }}>
                        <strong>Как это работает:</strong>
                    </p>

                    <p style={{ marginBottom: '15px' }}>
                        Перед тобой три двери - каждая ведет к серии из трех миссий, посвященных одной из ценностей.
                        В каждой комнате тебя ждут практические задания, которые помогут понять и применить ценность в реальных рабочих ситуациях.
                    </p>

                    <div style={{ marginBottom: '20px', padding: '15px', background: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
                            <strong>Совет:</strong> Начни с любой ценности. После завершения всех трех миссий
                            в одной комнате, переходи к следующей. Удачи!
                        </p>
                    </div>

                    <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                        Выбери дверь и начни своё путешествие по ценностям компании!
                    </p>
                </div>

                <div style={{ textAlign: 'center', marginTop: '25px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '12px 30px',
                            background: '#7e7b72',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Понятно!
                    </button>
                </div>
            </div>
        </div>
    )
}