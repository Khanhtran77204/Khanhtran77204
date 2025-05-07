# chạy dự án

import argparse
from rice_leaf.train import train_model
from rice_leaf.predict import predict_image
import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--train", action="store_true", help="Huấn luyện mô hình")
    parser.add_argument("--predict", type=str, help="Dự đoán ảnh đầu vào")
    args = parser.parse_args()

    if args.train:
        train_model()
    elif args.predict:
        result = predict_image(args.predict)
        print("👉 Kết quả dự đoán:", result)
