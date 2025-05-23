import cv2
import os
import numpy as np
import tkinter as tk
from tkinter import simpledialog

####### INITIALIZATION #######
def FaceDetectorYN(model=False):
    return cv2.FaceDetectorYN.create(model, "", (320, 320), 0.8, 0.3, 5000)

def FaceRecognizerSF(model=False):
    return cv2.FaceRecognizerSF.create(model, "")

def Detect(detector, img, width, height):    
    detector.setInputSize((width, height))
    return detector.detect(img)

def Crop(recognizer, image, face):
    return recognizer.alignCrop(image, face)

def reSize(img_path):
    img = cv2.imread(img_path)
    width = int(img.shape[1])
    height = int(img.shape[0])
    resized = cv2.resize(img, (width, height))
    return resized, height, width

def ask_name():
    root = tk.Tk()
    root.withdraw()
    name = simpledialog.askstring("Cadastro", "Digite o nome da pessoa:")
    root.destroy()
    return name

def register_new_person(result, frame, known_faces, known_names, recognizer, folder):
    if result[1] is not None and len(result[1]) > 0:
        print("\n=== Cadastro de nova pessoa ===")
        name = ask_name()
        if name and name.strip():
            name = name.strip()
            face = result[1][0]
            face_aligned = Crop(recognizer, frame, face)
            face_feature = recognizer.feature(face_aligned)

            known_faces.append(face_feature)
            known_names.append(name)
            print(f"Pessoa '{name}' cadastrada com sucesso!")

            save_path = os.path.join(folder, f"{name}.png")
            cv2.imwrite(save_path, face_aligned)
            print(f"Imagem salva em: {save_path}")
        else:
            print("Cadastro cancelado ou nome inv\u00e1lido.")
    else:
        print("Nenhuma face detectada para cadastro.")

def recognize_face(face_feature, known_faces, known_names, threshold=1.128):
    min_score = float('inf')
    identity = "Desconhecido"
    for i, known_feature in enumerate(known_faces):
        score = FaceRecognizer.match(known_feature, face_feature, cv2.FaceRecognizerSF_FR_NORM_L2)
        if score < min_score:
            min_score = score
            if score <= threshold:
                identity = known_names[i]
    return identity, min_score

def draw_transparent_circle(img, center, radius, color, alpha):
    overlay = img.copy()
    cv2.circle(overlay, center, radius, color, -1)
    cv2.addWeighted(overlay, alpha, img, 1 - alpha, 0, img)

def Coords(frame, face, thickness, color, texto=None):
    coords = face[:-1].astype(np.int32)
    x, y, w, h = coords[0], coords[1], coords[2], coords[3]

    cv2.rectangle(frame, (x, y), (x + w, y + h), (color[0], color[1], color[2]), thickness + 2)
    cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 255, 255), 1)

    point_colors = [(255, 0, 0), (0, 0, 255), (0, 255, 0), (255, 0, 255), (0, 255, 255)]
    for i in range(5):
        px, py = coords[4 + i * 2], coords[5 + i * 2]
        draw_transparent_circle(frame, (px, py), 6, (0, 0, 0), 0.1)
        draw_transparent_circle(frame, (px, py), 3, point_colors[i], 0.3)

    if texto:
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 1.3
        thickness_text = 1
        text_size, _ = cv2.getTextSize(texto, font, font_scale, thickness_text)
        text_w, text_h = text_size

        text_x = x + w // 2 - text_w // 2
        text_y = y + h + text_h + 12

        overlay = frame.copy()
        cv2.rectangle(overlay, (text_x - 10, text_y - text_h - 10), (text_x + text_w + 10, text_y + 10), color, -1)
        cv2.addWeighted(overlay, 0.4, frame, 0.6, 0, frame)

        cv2.putText(frame, texto, (text_x, text_y), font, font_scale, (255, 255, 255), thickness_text, cv2.LINE_AA)

### MAIN ###
folder = "persons"
os.makedirs(folder, exist_ok=True)

FaceDetector = FaceDetectorYN('models/face_detection_yunet_2023mar.onnx')
FaceRecognizer = FaceRecognizerSF('models/face_recognition_sface_2021dec.onnx')

known_faces = []
known_names = []

for filename in os.listdir(folder):
    if filename.lower().endswith((".png", ".jpg", ".jpeg")):
        name = os.path.splitext(filename)[0]
        path = os.path.join(folder, filename)
        img, h, w = reSize(path)
        faces = Detect(FaceDetector, img, w, h)
        if faces[1] is not None and len(faces[1]) > 0:
            face_aligned = Crop(FaceRecognizer, img, faces[1][0])
            feature = FaceRecognizer.feature(face_aligned)
            known_faces.append(feature)
            known_names.append(name)
            print(f"Adicionado: {name}")
        else:
            print(f"Nenhuma face detectada em {filename}")

cap = cv2.VideoCapture(0)
cv2.namedWindow("Reconhecimento Facial", cv2.WINDOW_NORMAL)
cv2.setWindowProperty("Reconhecimento Facial", cv2.WND_PROP_ASPECT_RATIO, cv2.WINDOW_KEEPRATIO)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
FaceDetector.setInputSize((width, height))

threshold = 1.128

def handle_enter_key():
    register_new_person(result, frame, known_faces, known_names, FaceRecognizer, folder)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    frame = cv2.flip(frame, 1)
    result = FaceDetector.detect(frame)
    thickness = 2

    if result[1] is not None:
        for face in result[1]:
            face_aligned = Crop(FaceRecognizer, frame, face)
            face_feature = FaceRecognizer.feature(face_aligned)
            identity, score = recognize_face(face_feature, known_faces, known_names, threshold)

            color = (0, 255, 0) if identity != "Desconhecido" else (0, 0, 255)
            texto = f"{identity} ({round(score,3)})"
            Coords(frame, face, thickness, color, texto)
    else:
        cv2.putText(frame, "Nenhuma face detectada", (10, 30), cv2.FONT_HERSHEY_SIMPLEX,
                    1, (0, 0, 255), 2, cv2.LINE_AA)

    cv2.imshow('Reconhecimento Facial', frame)

    key = cv2.waitKey(1) & 0xFF
    if key == 27:
        break
    elif key == 13:
        handle_enter_key()

cap.release()
cv2.destroyAllWindows()
