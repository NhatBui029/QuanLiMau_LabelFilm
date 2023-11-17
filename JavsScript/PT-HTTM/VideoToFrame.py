import cv2
import sys
import os

video_path = sys.argv[1]
output_directory = 'D:/HoccodePTIT/JavsScript/PT-HTTM/dataset/'

# Xóa các tệp trong thư mục đầu ra nếu tồn tại
for file in os.listdir(output_directory):
    file_path = os.path.join(output_directory, file)
    try:
        if os.path.isfile(file_path):
            os.unlink(file_path)
    except Exception as e:
        print(e)

vidcap = cv2.VideoCapture(video_path)
success, image = vidcap.read()
count = 1

while success:
    # Điều chỉnh kích thước của frame thành 1920x1080 px
    resized_image = cv2.resize(image, (1920, 1080))

    frame_name = f'Frame_{count:07d}.jpg' 
    frame_path = os.path.join(output_directory, frame_name)
    cv2.imwrite(frame_path, resized_image)
    
    success, image = vidcap.read()
    count += 1
