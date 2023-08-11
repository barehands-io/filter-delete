const fs = require('fs');
const path = require('path');

const folderPath = './uploads/2020/04'; // replace with your folder path

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading the folder:', err);
        return;
    }

    // Group files by base name
    let fileGroups = {};
    files.forEach(file => {
        const baseName = getBaseName(file);
        if (!fileGroups[baseName]) {
            fileGroups[baseName] = [];
        }
        fileGroups[baseName].push(file);

        console.log(` ${file} as ${baseName}`);
    });

    // Identify files to delete
    let filesToDelete = [];
    for (let baseName in fileGroups) {
        const files = fileGroups[baseName];
        const baseFile = files.find(file => getBaseName(file) === baseName); // Find the file that matches the base name
        filesToDelete = filesToDelete.concat(files.filter(file => file !== baseFile));
    
        console.log(`Base file: ${baseFile}`);        
    }

    // Delete the identified files
   /*   filesToDelete.forEach(file => {
        const filePath = path.join(folderPath, file);
        fs.unlink(filePath, err => {
            if (err) {
                console.error(`Error deleting the file ${file}:`, err);
                return;
            }
            console.log(`Deleted: ${file}`);
        });
    });  */
});



function getBaseNameWithoutResolution(filename) {
    // Remove the file extension
    const nameWithoutExtension = filename.split('.').slice(0, -1).join('.');

    // If the name contains a resolution pattern (e.g., "-1024x768"), remove it
    const resolutionPattern = /-\d+x\d+$/;
    if (resolutionPattern.test(nameWithoutExtension)) {
        return nameWithoutExtension.split('-').slice(0, -1).join('-');
    }

    return nameWithoutExtension;
}

function getBaseName(filename) {
    // Split the filename to separate the extension
    const parts = filename.split('.');
    const extension = parts.pop();
    let nameWithoutExtension = parts.join('.');

    // Check if the last segment of the name matches a resolution pattern
    const segments = nameWithoutExtension.split('-');
    const lastSegment = segments[segments.length - 1];
    const resolutionPattern = /^\d+x\d+$/;
    if (resolutionPattern.test(lastSegment)) {
        segments.pop(); // Remove the last segment if it's a resolution pattern
    }

    // Further refine by checking if the last segment is a common image size descriptor (like 'scaled')
    const commonDescriptors = ['scaled', 'thumb', 'small', 'medium', 'large'];
    if (commonDescriptors.includes(segments[segments.length - 1])) {
        segments.pop();
    }

    return segments.join('-');
}



