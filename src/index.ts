import type { PlaygroundPlugin, PluginUtils } from "./vendor/playground"
import type { Sandbox } from "./vendor/sandbox";
import { initVimMode } from "./vim-monaco";

let vimMode;
let vimStatus: HTMLDivElement;

console.log("TypeScript Playground vim");

function startVimMode(sandbox: Sandbox) {
  if (!vimStatus) {
    vimStatus = document.createElement("div");
    vimStatus.style.position = "fixed";
    vimStatus.style.backgroundColor = "#fff";
    vimStatus.style.bottom = "4px";
    vimStatus.style.padding = "4px 8px";
    document.body.appendChild(vimStatus);
  } else {
    vimStatus.style.display = "block";
  }
  vimMode = initVimMode(sandbox.editor, vimStatus);
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
        startButton.innerText = "Stop vim mode";
      }

      startButton.onclick = () => {
        if (!vimMode) {
          startVimMode(sandbox);
          startButton.innerText = "Stop vim mode";
        } else {
          stopVimMode();
          startButton.innerText = "Use vim mode";
        }
      }
    },

    // Gives you a chance to remove anything set up,
    // the container itself if wiped of children after this.
    didUnmount: () => {
      console.log('Removing plugin')
    },
  }

  return customPlugin
}

export default makePlugin
