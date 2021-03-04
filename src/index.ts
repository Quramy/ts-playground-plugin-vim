import type { PlaygroundPlugin, PluginUtils } from "./vendor/playground"
import type { Sandbox } from "./vendor/sandbox";
import { initVimMode } from "./vim-monaco";

let vimMode;
let vimStatus: HTMLDivElement;

function startVimMode(sandbox: Sandbox) {
  const mainNode = document.querySelector('main');
  if (!vimStatus) {
    vimStatus = document.createElement("div");
    vimStatus.style.position = "absolute";
    vimStatus.style.bottom = ".4rem";
    vimStatus.style.left = "1rem";
    vimStatus.style.fontSize = "small";
    if (mainNode) {
      mainNode.appendChild(vimStatus);
      mainNode.style.position = "relative";
    }
  } else {
    vimStatus.style.display = "block";
  }
  if (!vimMode) {
    vimMode = initVimMode(sandbox.editor, vimStatus);
  }
  localStorage.setItem("tsplayvim", "activated");
}

function stopVimMode() {
  if (vimStatus) {
    vimStatus.style.display = "none";
  }
  if (vimMode) {
    vimMode.dispose();
  }
  vimMode = null;
  localStorage.removeItem("tsplayvim");
}

if ("sandbox" in globalThis && !!localStorage.getItem("tsplayvim")) {
  const sandbox = (globalThis as unknown as { sandbox: Sandbox }).sandbox;
  startVimMode(sandbox);
}

const makePlugin = (utils: PluginUtils) => {
  const customPlugin: PlaygroundPlugin = {
    id: 'ts-playground-vim',
    displayName: 'Vim',
    didMount: (sandbox, container) => {

      const p = (str: string) => utils.el(str, "p", container);
      p("This plugin provides Vim keybindings to the editor.")
      
      const startButton = document.createElement('button')
      startButton.style.fontSize = "16px";
      startButton.style.cursor = "pointer";
      startButton.style.padding = "4px 8px";
      startButton.innerText = "Use vim mode";
      container.appendChild(startButton)

      if (localStorage.getItem("tsplayvim")) {
        startVimMode(sandbox);
        startButton.innerText = "Stop Vim mode";
      }

      startButton.onclick = () => {
        if (!vimMode) {
          startVimMode(sandbox);
          startButton.innerText = "Stop Vim mode";
        } else {
          stopVimMode();
          startButton.innerText = "Use Vim mode";
        }
      }
    },
  }

  return customPlugin
}

export default makePlugin
