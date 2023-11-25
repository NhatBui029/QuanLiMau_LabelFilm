const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const MauDAO = require('../daos/MauDAO');

module.exports = {
    executePython : async (script, args) => {
        const arguments = args.map(arg => arg.toString());
        const py = spawn('python', [script, ...arguments]);
    
        return new Promise((resolve, reject) => {
            let output = '';
            let errorOutput = '';
    
            py.stdout.on('data', (data) => {
                output += data.toString();
            });
    
            py.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });
    
            py.on('exit', (code) => {
                if (code === 0) {
                    resolve(output.trim().split('\n'));
                } else {
                    console.error(`Python script exited with code ${code}`);
                    reject(new Error(`Error executing Python script: ${errorOutput || 'Unknown error'}`));
                }
            });
    
            py.on('error', (err) => {
                console.error('Failed to start Python process:', err);
                reject(new Error('Failed to start Python process'));
            });
        });
    },

    saveImages : async (savePath, mauId, frameId) => {
        let kt = 0;
        try {
            const mau = await MauDAO.getMauById(mauId);
            const frame = mau.data.find(frame => frame._id.toString() === frameId);
    
            if (!frame) {
                console.log('Frame not found');
                return;
            }
    
            if (frame.image1) {
                const image1Path = path.join(savePath, 'image1.jpg');
                fs.writeFileSync(image1Path, frame.image1);
                console.log(`Image1 saved to: ${image1Path}`);
            }
    
            if (frame.image2) {
                const image2Path = path.join(savePath, 'image2.jpg');
                fs.writeFileSync(image2Path, frame.image2);
                console.log(`Image2 saved to: ${image2Path}`);
                kt = 1;
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
        return kt;
    },
    
    readImagesFromFolder : async (imageFolder) => {
        return new Promise((resolve, reject) => {
            fs.readdir(imageFolder, (err, files) => {
                if (err) {
                    console.error('Lỗi khi đọc thư mục hình ảnh:', err);
                    reject(err);
                    return;
                }
    
                const list = files.map((file) => {
                    const imagePath = path.join(imageFolder, file);
                    const imageName = file.split('.')[0];
                    const imageBuffer = fs.readFileSync(imagePath);
                    return {
                        name: imageName,
                        image1: imageBuffer,
                    };
                });
                resolve(list);
            });
        });
    }
}