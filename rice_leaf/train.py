# huấn luyện mô hình 

import os
import json
from rice_leaf.model_builder import build_model
from rice_leaf.utils import get_data_generators

def train_model(data_dir='data/', model_path='model/rice_model.h5', epochs=10): # data 
    train_gen, val_gen = get_data_generators(data_dir)
    
    with open("class_indices.json", "w") as f:
        json.dump(train_gen.class_indices, f)
    print("✅ class_indices.json saved")
    
    model = build_model(input_shape=(128,128,3), num_classes=len(train_gen.class_indices))
    
    model.fit(train_gen, validation_data=val_gen, epochs=epochs)
    model.save(model_path)

    print(f"✅ Model saved to {model_path}")
