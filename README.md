![cf](https://i.imgur.com/7v5ASc8.png) Lab 19 - Deployment to Heroku
======

## Description
  * Create an AWS account
  * Create an AWS Access Key and Secret
    * add the Access Key and Secret to your `.env` file
  * Create a new model that represents a file type that you want to store on AWS S3
    * ex: `.mp3`, `.mp4`, `.png`, etc
  * Create a test that uploads one of these files to your route
  * Use the `aws-sdk` to assist with uploading
  * Use `multer` to parse the file upload request

## Server Endpoint
  * `POST` - `/api/gallery/:galleryID/pic`
  * `DELETE` route - `/api/gallery/:galleryID/pic/:picID`
  * Test: `DELETE` - **204** - test to ensure the object was deleted from s3

## Tests
  * `POST` - **200** - test that the upload worked and a resource object is returned
