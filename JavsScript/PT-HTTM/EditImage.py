import cv2
import sys
import json

rect_pts = []
imagePath = sys.argv[1]
dataNhan_str = sys.argv[2]
nameLabel = sys.argv[4]
    
def click_and_drag(event, x, y, flags, param):
    global rect_pts

    if event == cv2.EVENT_LBUTTONDOWN:
        rect_pts = [(x, y)]

    elif event == cv2.EVENT_LBUTTONUP:
        rect_pts.append((x, y))

        print(f"{rect_pts[0][0]} {rect_pts[0][1]} {rect_pts[1][0]} {rect_pts[1][1]}")
        sys.stdout.flush()

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
        
    for rect in arrayNhan:
        name, x_left, y_left, x_right, y_right = rect['name'], rect['x_left'], rect['y_left'], rect['x_right'], rect['y_right']
        cv2.rectangle(image, (x_left, y_left), (x_right, y_right), (0, 255, 0), 2) 
        cv2.putText(image,name, (x_left + 10, y_left + 30),  16, 1, (0, 255, 0), 2)

    cv2.namedWindow('Hình ảnh', cv2.WINDOW_NORMAL)
    cv2.setMouseCallback('Hình ảnh', click_and_drag)
    cv2.setWindowProperty('Hình ảnh', cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

    while True:
        img_copy = cv2.resize(image, (1920, 1080))
        if len(rect_pts) == 2:
            cv2.rectangle(img_copy, rect_pts[0], rect_pts[1], (0, 255, 0), 2)

            img_with_rect = image.copy()
            cv2.rectangle(img_with_rect, rect_pts[0], rect_pts[1], (0, 255, 0), 2)

            x = max(rect_pts[0][0]+10 , 0)
            y = max(rect_pts[0][1] + 30, 0)
            cv2.putText(img_with_rect,nameLabel, (x,y),  16, 1, (0, 255, 0), 2)

            cv2.imwrite(sys.argv[3], img_with_rect)
            break

        cv2.imshow('Hình ảnh', img_copy)

        key = cv2.waitKey(1) & 0xFF
        if key == 27:
            break

    cv2.destroyAllWindows()

