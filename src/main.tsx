import { StrictMode } from 'react';
import { Container, createRoot } from 'react-dom/client';
import App from './App.jsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileTransfer } from '@capacitor/file-transfer';

try {
Filesystem.stat({
        path: "proot",
        directory: Directory.External
}).catch(_ => Filesystem.getUri({
        path: "proot",
        directory: Directory.External
}).then(uri => FileTransfer.downloadFile({
        url: "https://raw.githubusercontent.com/proot-me/proot-static-build/refs/heads/master/static/proot-arm64",
        path: uri.uri
})));
createRoot(document.getElementById('root') as Container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
} catch(e) { 
  e = (e as Error);
  alert(e);
}