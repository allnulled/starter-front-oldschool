Sistema_de_modulos.definir("lib/aplicacion", [
  "vue",
  "vue-router",
  "vue-i18n",
  "lib/rutas"
  //, Vue, VueRouter, VueI18n, rutas 
], async function (...args) {
  
  const Vue = await args[0];
  const VueRouter = await args[1];
  const VueI18n = await args[2];
  const rutas = await args[3];

  Vue.config.productionTip = false;

  /* INTERNATIONALIZATION */
  const i18n = new VueI18n({
    locale: "es",
    fallbackLocale: "en",
    messages: {
      es: {
        "Hola": "Hola en español"
      },
      en: {
        "Hola": "Hello"
      },
      ca: {
        "Hola": "Hola en català"
      }
    }
  });

  /* FRAMEWORK */
  window.Vue = Vue;

  /* ROUTER */
  Vue.use(VueRouter);
  const router = new VueRouter({
    routes: rutas
  });

  /* VUE */
  return new Vue({
    router,
    i18n,
    render: h => h(Vue.options.components.app),
  }).$mount("#app");

});