const DatauriParser = require('datauri/parser');
const path = require('path');

const cloudinary = require("cloudinary").v2;
const config=require("../config");

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET
});

const uploadImage = (file, options) => {
    // const {folder,public_id}
    return new Promise((resolve, reject) => {
        const parser = new DatauriParser();
        const base64String = parser.format(path.extname(file.originalname).toString(), file.buffer).content;
        cloudinary.uploader.upload(base64String, options).then(result => {
            resolve(result);
        }).catch(err => {
            reject("image upload error");
        });
    });
}



// const deleteImage = (public_id) => {
//     //delete the photo
//     return new Promise((resolve, reject) => {
//         cloudinary.uploader.destroy(public_id, {
//                 invalidate: true
//             })
//             .then(resolve).catch(reject)
//     })

// }

// const deleteImages = (public_ids) => {
//     //for loop the delete image
//     return new Promise((resolve, reject) => {
//         if (public_ids == null || public_ids.length == 0) {
//             resolve("no public ids provided!");
//         }
//         cloudinary.api.delete_resources(public_ids, {
//                 invalidate: true
//             })
//             .then(result => {
//                 console.log(result);
//                 resolve(result);
//             }).catch(err => {
//                 console.log(err);
//                 reject(err);
//             });
//     })
// }

//middleware to upload images on the fly with post!
const uploadImages = async (files=[]) => {
    let imagesMeta = [];
    for (const file of files) {
        try {
            let meta = await uploadImage(file);
            imagesMeta.push(meta);
        } catch (err) {
            
        }
    }
    return imagesMeta;
}




module.exports = {
    uploadImages,
    // deleteImages,
    // deleteImage
};
