npm i typescript -D
echo "Installing node-gyp and pkg"
npm install node-gyp pkg 
echo "Installing other dependencies"
npm install
tsc index.ts --esModuleInterop true --allowJs true --outDir ./dist

echo "Building using pkg"
pkg -t node14-win -c package.json -o ./executable/termex.exe ./dist/index.js
[Environment]::Exit(0)