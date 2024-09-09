require('dotenv').config();
const express = require('express');
const router = express.Router();
const policyService = require('./policy.service');

const zlib = require('zlib');
const util = require('util');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});
const multer = require('multer');
const storage = multer.memoryStorage(); // Store the file in memory instead of on disk
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // Limit file size to 10MB

// routes
router.post('/register', register);
router.get('/', getAll);
router.get('/getAllReadOnly', getAllReadOnly);
router.get('/getAllProcessing', getAllProcessing);

router.get('/list/:ids', getByIds);
router.get('/getAllById/:id', getAllById);
router.get('/getPending/:id', getPending);
router.get('/getFromRange/:id/:range', getFromRange);
router.get('/getAllPolicyIssueDate/:year', getAllPolicyIssueDate);
router.get('/getAllPolicyCommission/:year', getAllPolicyCommission);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.post('/proposal_no', getByProposalNumber);
router.post('/policy_no', getByPolicyNumber);
router.get('/registration_no/:registration_no', getByRegNumber);

router.post('/find/policy_no', findPolicyNumber);
router.post('/find/findPolicyByStatus', findPolicyByStatus);

router.post('/find/previous_policy_no', findByPreviousPolicyNumber);
router.post('/find/reg_no', findRegNumber);
router.put('/:id', update);
router.post('/updateByField/:id', updateByField);

router.delete('/:id', _delete);
router.post('/uploadFiles', upload.array('files'), uploadFiles);
router.get('/downloadFiles/:fileName', downloadFile);
router.post('/uploadProfileImage', upload.array('files'), uploadProfileImage);
// router.get('/downloadProfileImage/:fileName', downloadProfileImage);

module.exports = router;

function register(req, res, next) {
    policyService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    policyService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAllById(req, res, next) {
    policyService.getAllById(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getPending(req, res, next) {
    policyService.getPending(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    policyService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    policyService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    policyService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function updateByField(req, res, next) {
    policyService.updateByField(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}


function _delete(req, res, next) {
    policyService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

async function uploadFiles(req, res, next) {

    console.log('uploadFiles method calling: ');
    const files = req.files;
    console.log(files)

    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files provided' });
    }

    const uploadedFileNames = [];
    try {
        await Promise.all(files.map(async (file) => {
            // const fileName = 'media/documents/' + file.originalname;

            let fileName = file.originalname.toLowerCase()

            if (!fileName.startsWith('media/documents/')) {
                fileName = 'media/documents/' + fileName;
            }

            await s3.upload({
                Bucket: process.env.BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
            }).promise();
            uploadedFileNames.push(fileName);
        }));
        console.log('Successfully uploaded!');
        // Verify that all uploads are done
        if (uploadedFileNames.length === files.length) {
            res.status(200).json({ message: 'Successfully uploaded!', fileNames: uploadedFileNames });
        } else {
            res.status(500).json({ error: 'Some files failed to upload', fileNames: uploadedFileNames });
        }
    } catch (e) {
        console.log('Error uploading data: ', e);
        res.status(500).json({ error: 'Some files failed to upload', fileNames: uploadedFileNames });
    }
}

async function downloadFile(req, res, next) {
    let fileName = req.params.fileName; // Assuming you pass the file name in the request parameters
    const bucketName = process.env.BUCKET_NAME;  
    fileName = `media/documents/` + fileName
    // console.log(fileName);

    try {
        const params = {
            Bucket: bucketName,
            Key: fileName
        };

        const s3Response = await s3.getObject(params).promise();

        if (s3Response.ContentEncoding === 'gzip') {
            // Decompress the file
            const decompressedBuffer = await util.promisify(zlib.gunzip)(s3Response.Body);

            // Set appropriate headers for response
            res.set({
                'Content-Type': 'application/octet-stream', // Set appropriate content type
                'Content-Disposition': `attachment; filename="${fileName}"` // Force download
            });

            // Send the decompressed file to the client
            res.send(decompressedBuffer);
        } else {
            // If the file is not compressed, send it as is
            res.set({
                'Content-Type': s3Response.ContentType,
                'Content-Length': s3Response.ContentLength,
                'Content-Disposition': `attachment; filename="${fileName}"` // Force download
            });
            res.send(s3Response.Body);
        }
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
}

function getFromRange(req, res, next) {
    console.log('getFromRange calling');
    // console.log(req.params.range);
    id = req.params.id
    frmDate = req.params.range.split('|')[0]
    toDate = req.params.range.split('|')[1]

    policyService.getFromRange(id, frmDate, toDate)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getByProposalNumber(req, res, next) {
    console.log('getByProposalNumber calling:');
    policyService.getByProposalNumber(req.body.proposal_no)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByPolicyNumber(req, res, next) {
    console.log('getByPolicyNumber calling:');
    policyService.getByPolicyNumber(req.body.policy_no)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByRegNumber(req, res, next) {
    console.log('getByRegNumber calling:');
    policyService.getByRegNumber(req.params.registration_no)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function findPolicyNumber(req, res, next) {
    policyService.findPolicyNumber(req.body.policy_no)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function findPolicyByStatus(req, res, next) {
    policyService.findPolicyByStatus(req.body.status)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}


function findByPreviousPolicyNumber(req, res, next) {
    policyService.findByPreviousPolicyNumber(req.body.previous_policy_no)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function findRegNumber(req, res, next) {
    policyService.findRegNumber(req.body.reg_no)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByIds(req, res, next) {
    policyService.getByIds(req.params.ids)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

async function uploadProfileImage(req, res, next) {

    console.log('uploadFiles method calling: ');
    const files = req.files;
    console.log(files)

    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files provided' });
    }

    const uploadedFileNames = [];
    try {
        await Promise.all(files.map(async (file) => {
            // const fileName = 'media/documents/' + file.originalname;

            // let s3_url = 'https://ebook-images.s3.us-east-2.amazonaws.com/'

            let fileName = file.originalname.toLowerCase()

            const compressedBuffer = await util.promisify(zlib.gzip)(file.buffer);
            await s3.upload({

                Bucket: process.env.EBOOK_IMAGES,
                Key: fileName,
                Body: compressedBuffer,
                ContentEncoding: 'gzip',
            }).promise();
            uploadedFileNames.push(fileName);
        }));
        console.log('Successfully uploaded!');
        // Verify that all uploads are done
        if (uploadedFileNames.length === files.length) {
            res.status(200).json({ message: 'Successfully uploaded!', fileNames: uploadedFileNames });
        } else {
            res.status(500).json({ error: 'Some files failed to upload', fileNames: uploadedFileNames });
        }
    } catch (e) {
        console.log('Error uploading data: ', e);
        res.status(500).json({ error: 'Some files failed to upload', fileNames: uploadedFileNames });
    }
}

function getAllPolicyIssueDate(req, res, next) {
    policyService.getAllPolicyIssueDate(req.params.year)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAllPolicyCommission(req, res, next) {
    policyService.getAllPolicyCommission(req.params.year)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAllProcessing(req, res, next) {  
    policyService.getAllProcessing()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAllReadOnly(req, res, next) {
    policyService.getAllReadOnly()
        .then(users => res.json(users))
        .catch(err => next(err));
}




