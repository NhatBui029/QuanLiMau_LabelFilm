import cv2
import sys

rect_pts = []

def click_and_drag(event, x, y, flags, param):
    global rect_pts

    if event == cv2.EVENT_LBUTTONDOWN:
        rect_pts = [(x, y)]

    elif event == cv2.EVENT_LBUTTONUP:
        rect_pts.append((x, y))

        print(f"{rect_pts[0][0]} {rect_pts[0][1]} {rect_pts[1][0]} {rect_pts[1][1]}")
        sys.stdout.flush()

image = cv2.imread(sys.argv[1])

screen_height, screen_width = 1080, 1920  

cv2.namedWindow('Hình ảnh', cv2.WINDOW_NORMAL)
cv2.setMouseCallback('Hình ảnh', click_and_drag)

cv2.setWindowProperty('Hình ảnh', cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

while True:
    img_copy = cv2.resize(image, (screen_width, screen_height))
    if len(rect_pts) == 2:
        cv2.rectangle(img_copy, rect_pts[0], rect_pts[1], (0, 255, 0), 2)

        img_with_rect = image.copy()
        cv2.rectangle(img_with_rect, rect_pts[0], rect_pts[1], (0, 255, 0), 2)

        x = max(rect_pts[0][0]+10 , 0)
        y = max(rect_pts[0][1] + 30, 0)
        cv2.putText(img_with_rect,'Label '+ sys.argv[2], (x,y),  16, 1, (0, 255, 0), 2)

        cv2.imwrite(sys.argv[3], img_with_rect)
        break

    cv2.imshow('Hình ảnh', img_copy)

    key = cv2.waitKey(1) & 0xFF
    if key == 27:
        break

cv2.destroyAllWindows()