import cv2
import sys
import json

def draw_rectangles(image, rectangles):
    for rect in rectangles:
        name, x_left, y_left, x_right, y_right = rect['name'], rect['x_left'], rect['y_left'], rect['x_right'], rect['y_right']
        cv2.rectangle(image, (x_left, y_left), (x_right, y_right), (0, 255, 0), 2) 
        cv2.putText(image,name, (x_left + 10, y_left + 30),  16, 1, (0, 255, 0), 2)
    cv2.imwrite(sys.argv[3], image)

imagePath = sys.argv[1]
dataNhan_str = sys.argv[2]

image = cv2.imread(imagePath)

if image is None:
    print(f"Không thể đọc hình ảnh từ đường dẫn: {imagePath}")
else:
    image_resized = cv2.resize(image, (1920, 1080))

    json_parts = dataNhan_str.split('},{')

    jsonNhan = []
    arrayNhan = []

    if len(dataNhan_str) != 0:
        for part in json_parts:
            if part[0] !=  '{':
                part = '{' + part
            if part[-1] != '}':
                part = part + '}'
            jsonNhan.append(part)


        for part in jsonNhan:
            data = json.loads(part)
            arrayNhan.append({
                'name': data['name'],
                'x_left': data['x_left'],
                'y_left': data['y_left'],
                'x_right': data['x_right'],
                'y_right': data['y_right']
            })

    draw_rectangles(image_resized, arrayNhan)
