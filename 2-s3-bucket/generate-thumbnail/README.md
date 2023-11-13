### Generate thumbnail
This index.mjs is the code for a lambda function to transform an image uploaded to a thumbnail size.

It is important to make the installation of the only module in here "sharp" but with the following command:
```
npm install --platform=linux --arch=x64 sharp
```

A straighforward way to do it is by running:
```
npm run install-package
```
#### Prepare the upload process
Then to upload the project to lambda, compress it in .zip format only the next two files:
- node_modules
- index.mjs
The rest of the lambda files are not needed.

It is important to highlight that is importante to compress only the files, not the files inside a folder, because lambda in the decompress process won't be able to find the index file.