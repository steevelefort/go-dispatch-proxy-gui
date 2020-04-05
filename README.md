# Go Dispatch Proxy GUI

This is a little GUI for Windows made with Electron.
**It does not include  go-dispatch-proxy sources and binaries**
Please, visit : [https://github.com/extremecoders-re/go-dispatch-proxy](https://github.com/extremecoders-re/go-dispatch-proxy)

**Warning:** I wrote this GUI __for my personal use__, so I'm sorry if the code is ugly.

## Dependencies

- go-dispatch-proxy.exe binary
- electron
- optional : electron-packager (to make a standalone .exe)

## To Use

Clone this repository:

```bash
# Clone this repository
git clone https://github.com/steevelefort/go-dispatch-proxy-gui
# Go into the repository
cd go-dispatch-proxy-gui
```
Copy go-dispatch-proxy.exe binary in the new directory then 
```bash
# Install dependencies
npm install

# Run the app with electron
electron .
```

Note: You can use electron-packager to generate a standalone binary. Don't forget to copy go-dispatch-proxy.exe in the binary directory.

## License

Licensed under MIT