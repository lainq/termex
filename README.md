<br />
<p align="center">
  <img src="https://i.imgur.com/uP8MCw0.gif" height="120">
  <h3 align="center"><i><strong>Termex</strong></i></h3>

  <p align="center">
    Explore the filesystem from your terminal
  <br />
    <a href="https://github.com/pranavbaburaj/termex/blob/main/docs/README.md">📖 Documentation</a>
    ·
    <a href="https://github.com/pranavbaburaj/termex/issues">Report a Bug</a>
    ·
    <a href="https://github.com/pranavbaburaj/termex/pulls">Request Feature</a>
  </p>
  <br>
  <p align="center">
    <img src="https://img.shields.io/discord/808537055177080892.svg">
    <img src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103">   
  </p>
  <br />

</p>

<div align="center">
  <img src="https://user-images.githubusercontent.com/70764593/124089457-89068e80-da71-11eb-9ddb-e51cf84a0369.gif" height="300">
 </div>

# About

Termex(**Ter**minal **Ex**plorer) is a terminal-based file explorer created using typescript. 

# Features

- Terminal-based file navigation
- View files with syntax highlighting
- Discord RPC
  and many other small features
  
 Read the documentation [here](https://github.com/pranavbaburaj/termex/tree/main/docs)

# Installation

## Manual installation

- **NPM**

```ps1
$ npm i termex -g
```

<!-- - **Windows**

Windows users can download the zip file from the [releases](https://github.com/pranavbaburaj/termex/releases/latest/). Unzip the downloaded file and you can find the termex executable in the directory. An alternate wa is to build from source. You can learn more about it [here](https://github.com/pranavbaburaj/termex#building-from-source)

- **Other platforms**
  Non-Windows users require to build the application from source. Read more about it [here](https://github.com/pranavbaburaj/termex#building-from-source) -->

## Building from source

Inorder to build the repository from your local system 💻, you will need to have the following programs installed:

- Node JS
- NPM
- Git

Once you have installed all the required software, let's get started by cloning the repository.

```ps1
# Clone the repository into your local system
git clone https://github.com/pranavbaburaj/termex.git

# Get into the directory
cd termex
```

Build the project

```ps1
# Install typescript to compile the source
npm i typescript -D

# Install node-gyp(Required by discord-rpc) and pkg(to package the application)
npm install node-gyp pkg

# Install all the other dependencies
npm install

# Compile the source into dist directory
tsc index.ts --esModuleInterop true --allowJs true --outDir ./dist


# Build the application into an executable
pkg -c package.json ./dist/index.js
```

<hr>

Once you are done with the installation, add the executable into the `PATH` envrionment variable and start using termex.

Please mind reading the documentation before using termex. Learn more about documentation [here](https://github.com/pranavbaburaj/termex#Documentation)

# Documentation

Read the official documentation [here](https://github.com/pranavbaburaj/termex/blob/main/docs/README.md). If you find any issues with the documentation, please let us know by creating an [issue](https://github.com/pranavbaburaj/termex/issues/new).
