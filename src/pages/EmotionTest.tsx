import { useEmotionDetector, type EmotionState } from '../hooks/useEmotionDetector';
import './EmotionTest.css';

export default function EmotionTest() {
    const {
        videoRef,
        emotion,
        loading,
        error,
        startDetection,
        stopDetection,
    } = useEmotionDetector();

    // Map emoções para emojis e cores
    const emotionConfig = {
        happy: { emoji: '😊', color: '#FFD700', label: 'Feliz' },
        sad: { emoji: '😢', color: '#4169E1', label: 'Triste' },
        angry: { emoji: '😠', color: '#FF4500', label: 'Irritado' },
        surprised: { emoji: '😮', color: '#9370DB', label: 'Surpreso' },
        fearful: { emoji: '😨', color: '#FF6347', label: 'Assustado' },
        disgusted: { emoji: '🤢', color: '#228B22', label: 'Nojento' },
        neutral: { emoji: '😐', color: '#808080', label: 'Neutro' },
    };

    // Obter emoção dominante
    const getDominantEmotion = (): keyof typeof emotionConfig => {
        if (!emotion) return 'neutral';

        const emotions = Object.entries(emotion);
        const dominant = emotions.reduce((prev, current) =>
            prev[1] > current[1] ? prev : current
        );

        return (dominant[1] > 0.1 ? dominant[0] : 'neutral') as keyof typeof emotionConfig;
    };

    const renderEmotionBar = (emotionName: keyof EmotionState, value: number) => {
        const config = emotionConfig[emotionName as keyof typeof emotionConfig];
        const percentage = Math.round(value * 100);

        return (
            <div key={emotionName} className="emotion-bar-container">
                <div className="emotion-label">
                    <span className="emotion-emoji">{config.emoji}</span>
                    <span className="emotion-name">{config.label}</span>
                </div>
                <div className="emotion-bar-wrapper">
                    <div
                        className="emotion-bar"
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: config.color,
                        }}
                    />
                    <span className="emotion-percentage">{percentage}%</span>
                </div>
            </div>
        );
    };

    const dominantEmotionKey = getDominantEmotion();
    const dominantConfig = emotionConfig[dominantEmotionKey];

    return (
        <div className="emotion-detector-container">
            <div className="emotion-header">
                <h1>🎭 Teste de Detecção de Emoções</h1>
                <p>Preview da câmara com análise em tempo real</p>
            </div>

            {error && (
                <div className="error-message">
                    <p>❌ {error}</p>
                </div>
            )}

            {loading && (
                <div className="loading-message">
                    <p>Carregando modelos de IA...</p>
                    <div className="spinner"></div>
                </div>
            )}

            <div className="emotion-content">
                {/* Seção da Câmara */}
                <div className="camera-section">
                    <div className="camera-wrapper">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="video-feed"
                        />
                        <div className="camera-placeholder">
                            <p>📷 Câmara inativa</p>
                        </div>
                    </div>

                    <div className="camera-controls">
                        <button
                            className="btn-start"
                            onClick={startDetection}
                            disabled={loading}
                        >
                            Iniciar Câmara
                        </button>
                        <button className="btn-stop" onClick={stopDetection}>
                            Parar Câmara
                        </button>
                    </div>
                </div>

                {/* Seção de Emoções */}
                <div className="emotions-section">
                    <div className="dominant-emotion">
                        <h2>Emoção Detectada</h2>
                        {emotion ? (
                            <div className="dominant-display">
                                <div className="dominant-emoji">{dominantConfig.emoji}</div>
                                <p className="dominant-label">{dominantConfig.label}</p>
                            </div>
                        ) : (
                            <p className="no-detection">Inicie a câmara para detectar emoções</p>
                        )}
                    </div>

                    {/* Barras de Emoções */}
                    <div className="emotions-bars">
                        <h3>Análise Detalhada</h3>
                        {emotion ? (
                            <div className="bars-container">
                                {Object.entries(emotion).map(([emotionName, value]) =>
                                    renderEmotionBar(emotionName as keyof EmotionState, value)
                                )}
                            </div>
                        ) : (
                            <p className="no-detection">Nenhuma emoção detectada</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className="info-box">
                <h4>ℹ️ Informações</h4>
                <ul>
                    <li>✅ Processamento 100% local (sem envio de dados)</li>
                    <li>📍 Requer permissão de câmara</li>
                    <li>⚡ Atualização a cada 500ms</li>
                    <li>🔒 Dados não são armazenados</li>
                </ul>
            </div>
        </div>
    );
}