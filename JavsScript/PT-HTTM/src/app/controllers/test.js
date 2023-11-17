addMau(req, res, next) {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        const { tenMau, moTa } = fields;

        const videoFile = files.videoFile[0];
        const jsonFile = files.jsonFile[0];
        const pathJsonFile = path.join('D:\\download\\Annotations', jsonFile.originalFilename);
        const pathVideoFile = path.join('D:\\download\\Videos', videoFile.originalFilename);

        const result = await executePython('main.py', [pathVideoFile]);

        const readFilePromise = (path) => {
            return new Promise((resolve, reject) => {
                fs.readFile(path, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        };

        const nhanList = [];
        const jsonData = await new Promise((resolve, reject) => {
            fs.readFile(pathJsonFile, 'utf8', (err, data) => {
                if (err) {
                    console.error('Lỗi khi đọc tệp JSON:', err);
                    reject(err);
                }
                resolve(JSON.parse(data));
            });
        });

        for (const frameKey in jsonData) {
            const frameData = jsonData[frameKey];
            let listPerson = [];

            for (let i = 0; i < frameData.pedestriansData.length; i++) {
                const personData = frameData.pedestriansData[i];
                const person = {
                    id: "Person " + String(i + 1),
                    x_left: Number(personData[0]),
                    y_left: Number(personData[1]),
                    x_right: Number(personData[2]),
                    y_right: Number(personData[3])
                };
                listPerson.push(person);
            }

            const pathImage = path.join('D:\\HoccodePTIT\\JavsScript\\PT-HTTM\\dataset', frameKey + '.jpg');
            try {
                const imageData = await readFilePromise(pathImage);
                nhanList.push({
                    frame: frameKey,
                    person: listPerson,
                    image: imageData
                });
            } catch (err) {
                console.error('Lỗi khi đọc hình ảnh:', err);
            }
        }

        nhanList.sort((a, b) => {
            const frameA = parseInt(a.frame.split('_')[1]);
            const frameB = parseInt(b.frame.split('_')[1]);
            return frameA - frameB;
        });

        const videoBuffer = fs.readFileSync(videoFile.filepath);

        const mau = new Mau({
            ten: tenMau,
            mota: moTa,
            nhan: nhanList,
            fileNhan: jsonFile.originalFilename,
            video: videoBuffer
        });

        try {
            await mau.save();
            console.log(`Lưu mẫu ${tenMau} vào MongoDB thành công.`);
            res.redirect('/admin');
        } catch (err) {
            console.error('Lỗi khi lưu vào MongoDB:', err);
            next(err);
        }
    });
}
