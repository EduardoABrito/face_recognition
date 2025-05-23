# Sistema de Reconhecimento Facial com OpenCV

Este projeto realiza **detecção** e **reconhecimento facial** em tempo real via webcam, utilizando os modelos da OpenCV baseados em *deep learning* com as redes **YuNet** (para detecção) e **SFace** (para reconhecimento).

## ✨ Funcionalidades

- Detecção facial em tempo real
- Reconhecimento facial baseado em embeddings
- Cadastro de novos rostos pelo teclado
- Armazenamento dos rostos reconhecidos na pasta `persons`
- Feedback visual com retângulo, pontos de referência e nome do reconhecido

## 🧠 Contexto do Código

Este sistema utiliza dois modelos ONNX:

- `face_detection_yunet_2023mar.onnx`: detecta rostos na imagem.
- `face_recognition_sface_2021dec.onnx`: gera uma *feature vector* (embedding) para cada rosto detectado.

Cada novo rosto cadastrado é salvo em disco e seus vetores são mantidos na memória durante a execução para comparação com futuros rostos detectados.

## 📦 Requisitos

### Modelos necessários (baixe e coloque na pasta `models/`):

- [YuNet face detector (2023)](https://github.com/opencv/opencv_zoo/tree/main/models/face_detection_yunet)
- [SFace face recognizer (2021)](https://github.com/opencv/opencv_zoo/tree/main/models/face_recognition_sface)

### Estrutura recomendada de pastas:

```
project-root/
│
├── main.py
├── models/
│   ├── face_detection_yunet_2023mar.onnx
│   └── face_recognition_sface_2021dec.onnx
├── persons/
```

### Bibliotecas necessárias

- Python 3.10+
- OpenCV com suporte a face recognition (versão recomendada: **opencv-contrib-python 4.8.0.76**)
- tkinter (vem por padrão no Python)

### Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/EduardoABrito/face_recognition.git
   cd face_recognition
   ```

2. Crie um ambiente virtual e ative:
   ```bash
   python -m venv venv
   source venv/bin/activate  # no Windows: venv\Scripts\activate
   ```

3. Instale as dependências:
   ```bash
   pip install opencv-contrib-python numpy
   ```

4. Baixe os modelos `.onnx` e coloque na pasta `models/` (links acima).

5. Crie a pasta onde os rostos serão armazenados:
   ```bash
   mkdir persons
   ```

## 🚀 Como usar

1. Execute o script principal:
   ```bash
   python main.py
   ```

2. O programa abrirá a webcam.

3. Quando uma face for detectada:
   - Se reconhecida, o nome será exibido.
   - Se desconhecida, pressione **ENTER** para cadastrar:
     - Uma janela solicitará o nome da pessoa.
     - A imagem será salva em `persons/` com esse nome.

4. Pressione **ESC** para sair.

## 💡 Observações

- O reconhecimento depende da qualidade da câmera e iluminação.
- Embeddings são comparados com `cv2.FaceRecognizerSF_FR_NORM_L2` e validados com limiar `1.128`.
- O sistema mantém os vetores em memória, então reiniciar o script limpa a memória (mas as imagens permanecem salvas).

## ✅ Testado com:

| Item         | Versão                |
|--------------|------------------------|
| Python       | 3.10.12                |
| OpenCV       | 4.8.0.76 (`contrib`)   |
| OS           | Windows 10 / Ubuntu 22.04 |
| Webcam       | Full HD USB / Notebook integrada |

## 📖 Créditos

- Modelos da [OpenCV Zoo](https://github.com/opencv/opencv_zoo)
- Projeto desenvolvido para fins educacionais e experimentação com reconhecimento facial.