import Component from "./components/flow.vue";
import { createApp } from "vue";
const Plugin = {};
Plugin.install = function (app, options) {
  app.config.globalProperties.$flow = function (opts = {}) {
    return new Promise((resolve, reject) => {
      const mountNode = document.createElement("div");
      document.body.appendChild(mountNode);
      const instanceApp = createApp(Component, { options: opts });

      const instance = instanceApp.mount(mountNode);

      const promise = instance.open();
      const destroy = () => {
        const timer = setTimeout(() => {
          instanceApp.unmount();
          if (mountNode.parentNode === document.body) {
            document.body.removeChild(mountNode);
          }

          clearTimeout(timer);
        }, 300);
      };
      promise
        .then((result) => {
          resolve(result);
          destroy();
        })
        .catch((error) => {
          reject(error);
          destroy();
        });
    });
  };
};

export default Plugin;
