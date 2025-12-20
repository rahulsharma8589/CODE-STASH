// client/src/utils/fileSystem.js

// This function turns ["css/style.css"] into a nested object
export const buildFileTree = (files) => {
  const root = {};

  files.forEach((file) => {
    const parts = file.name.split('/'); // Split path by slash
    let currentLevel = root;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // It's a FILE
        currentLevel[part] = {
          ...file,
          type: 'file',
          name: part,
          fullPath: file.name
        };
      } else {
        // It's a FOLDER
        if (!currentLevel[part]) {
          currentLevel[part] = {
            type: 'folder',
            name: part,
            children: {}
          };
        }
        currentLevel = currentLevel[part].children;
      }
    });
  });

  return root;
};