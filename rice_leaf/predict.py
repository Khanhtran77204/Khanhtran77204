# dự đoán hình ảnh

import numpy as np
import json
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.models import load_model
from rice_leaf.utils import load_and_preprocess_image
import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

def predict_image(image_path, model_path='model/rice_model.h5', class_map_path="class_indices.json"):
    # Tải mô hình
    model = load_model(model_path)
    # Kích thước ảnh đầu vào
    img = load_img(image_path, target_size=(128, 128))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    img = load_and_preprocess_image(image_path)
    # Dự đoán bệnh
    prediction = model.predict(img)[0]
    predicted_class = np.argmax(prediction)
    predictions = model.predict(img_array)[0]
    predicted_idx = np.argmax(predictions)
    # Đọc class mapping ánh xạ từ file JSON
    with open(class_map_path, "r", encoding="utf-8") as f:
        class_indices = json.load(f)
    inv_map = {v: k for k, v in class_indices.items()}

    predicted_label = inv_map[predicted_idx]
    confidence = float(np.max(prediction) * 100)
    # của confidence cũ: float(predictions[predicted_idx])
    label_idx = np.argmax(prediction) # predictions
    label = inv_map[label_idx]  
    
    # Ánh xạ với xác suất tên lớp ( mới )
    result = {inv_map[i]: float(f"{prob:.4f}") for i, prob in enumerate(predictions)}
    return result




    # đây là giá trị trả về của label ( cũ )

  #  if class_indices:
  #      inv_map = {v: k for k, v in class_indices.items()}
   #     return inv_map[predicted_class]
 #   return result, confidence, label, predicted_label
    # return cũ có predicted_label
    