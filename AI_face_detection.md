# Emotion-Adaptive Learning Platform 🧠

## Detecção de Emoções em Tempo Real - Opções Gratuitas

Este documento descreve as opções disponíveis para integrar detecção de expressões faciais e emoções ao projeto **Feeling Maths**.

---

## 📊 Comparação de Frameworks/LLMs Gratuitos

### 1. **face-api.js** ⭐ (Recomendado para começar)

**O que é:**
- Biblioteca JavaScript que usa TensorFlow.js
- Detecta expressões faciais e emoções em tempo real

**Emoções Detectadas:**
- Feliz, triste, irritado, surpreso, medo, nojo, neutro

**Vantagens:**
- ✅ Completamente gratuita e open-source
- ✅ Roda no browser (sem servidor necessário)
- ✅ Não precisa de API key
- ✅ Fácil integração com React/TypeScript
- ✅ Sem limites de uso
- ✅ Privacidade (processamento local)

**Desvantagens:**
- ❌ Requer câmara/webcam
- ❌ Processamento local (usa CPU do utilizador)
- ❌ Precisão moderada comparada com soluções comerciais

**Instalação:**
```bash
npm install @vladmandic/face-api
```

**Exemplo básico:**
```javascript
import * as faceapi from "@vladmandic/face-api";

// Detectar emoções
const detections = await faceapi.detectAllFaces(video)
  .withFaceLandmarks()
  .withFaceExpressions();

console.log(detections[0].expressions); 
// { happy: 0.85, sad: 0.1, angry: 0.02, ... }
```

---

### 2. **TensorFlow.js + BlazeFace**

**O que é:**
- Framework de IA do TensorFlow para visão computacional
- Versão simplificada de detecção facial

**Vantagens:**
- ✅ Gratuito e open-source
- ✅ Excelente performance
- ✅ Bem documentado
- ✅ Parte do ecossistema TensorFlow

**Desvantagens:**
- ❌ Menos emoções detectadas que face-api
- ❌ Focado em landmarks faciais (não emoções)

**Exemplo:**
```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-backend-webgl
npm install @tensorflow-models/blazeface
```

---

### 3. **MediaPipe** (Google) ⭐⭐ (Mais Moderno)

**O que é:**
- Framework de IA do Google para visão computacional
- Estado-da-arte em detecção facial

**Vantagens:**
- ✅ Muito mais preciso que face-api
- ✅ Melhor performance (otimizado pelo Google)
- ✅ Gratuito e open-source
- ✅ Documentação excelente
- ✅ Pronto para produção

**Desvantagens:**
- ❌ Setup um bocado mais complexo
- ❌ Detecção de emoções requer análise adicional dos landmarks

**Instalação:**
```bash
npm install @mediapipe/tasks-vision
```

**Exemplo:**
```javascript
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision"
);

const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: "face_landmarker.task"
  },
  runningMode: "VIDEO"
});
```

---

### 4. **Affectiva** (Comercial com plano GRATUITO)

**O que é:**
- Plataforma comercial de detecção de emoções
- IA muito precisa (treinada com milhões de rostos)

**Vantagens:**
- ✅ Mais preciso que bibliotecas open-source
- ✅ Detecção fiável de múltiplas emoções
- ✅ Plano gratuito disponível

**Desvantagens:**
- ❌ Plano gratuito limitado (10,000 análises/mês)
- ❌ Requer API key
- ❌ Processamento em servidor (dados na cloud)
- ❌ Privacidade (dados enviados para servidor)

**Preço:**
- Free: 10,000 análises/mês
- Paid: A partir de $99/mês

---

## 🎯 Recomendação Final

### Para o protótipo do Feeling Maths:

**Opção 1 (Recomendado): face-api.js**
- Perfeito para MVP/protótipo
- Totalmente gratuito sem limites
- Integração simples em React
- Adequado para demonstrações

**Opção 2 (Melhor qualidade): MediaPipe**
- Se precisar de mais precisão
- Mantém privacidade (processamento local)
- Google-quality
- Ideal para produção

---

## 🔧 Integração Proposta ao Projeto

### Componente EmotionDetector (face-api.js):

```typescript
import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

interface EmotionState {
  happy: number;
  sad: number;
  angry: number;
  surprised: number;
  fearful: number;
  disgusted: number;
  neutral: number;
}

export function useEmotionDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [emotion, setEmotion] = useState<EmotionState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDetection = async () => {
      try {
        // Carregar modelos
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);

        // Obter acesso à webcam
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setLoading(false);
        }

        // Detectar emoções a cada 500ms
        const interval = setInterval(async () => {
          if (videoRef.current && videoRef.current.readyState === 4) {
            const detections = await faceapi
              .detectAllFaces(videoRef.current)
              .withFaceExpressions();
            
            if (detections.length > 0) {
              setEmotion(detections[0].expressions as EmotionState);
            }
          }
        }, 500);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Erro a inicializar detecção:', error);
        setLoading(false);
      }
    };

    initializeDetection();
  }, []);

  return { videoRef, emotion, loading };
}
```

### Como usar nas páginas (Quiz, Exercises):

```typescript
// Adaptar dificuldade baseado em emoções
function adaptDifficulty(emotion: EmotionState) {
  const frustration = emotion.angry + emotion.sad;
  const confusion = emotion.fearful + emotion.surprised;
  
  if (frustration > 0.6) {
    // Reduzir dificuldade, aumentar hints
    return 'easy';
  } else if (confusion > 0.5) {
    // Mostrar mais explicações
    return 'medium';
  }
  
  return 'hard';
}
```

---

## 📋 Próximos Passos

1. **Escolher framework** (recomendado: face-api.js)
2. **Criar componente de detecção** emocional reutilizável
3. **Integrar em Quiz.tsx e Exercises.tsx**
4. **Implementar lógica de adaptação** de dificuldade
5. **Testar e calibrar** sensibilidade
6. **Coletar dados** para A/B testing

---

## 🔐 Considerações de Privacidade

- ✅ **face-api.js**: Processamento 100% local (webcam → browser → descartado)
- ✅ **MediaPipe**: Processamento 100% local
- ❌ **Affectiva**: Dados enviados para servidor (verificar RGPD)

---

*Última atualização: Abril 2026*

