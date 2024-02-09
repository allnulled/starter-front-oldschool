(function (factoria) {
    const modulo = factoria();
    if (typeof window !== "undefined") {
        window.Sistema_de_modulos = modulo;
    }
    if (typeof global !== "undefined") {
        global.Sistema_de_modulos = modulo;
    }
})(function () {
    class Factoria_de_sistema_de_modulos {
        constructor() {
            this.modulos = {};
        }
        definir(nombreModulo, dependencias, factoria) {
            this.modulos[nombreModulo] = {
                dependencias: dependencias,
                factoria: factoria,
                exports: null,
                resuelto: false,
            };
        }
        requerir(nombresModulos, callback) {
            const modulosResueltos = nombresModulos.map((nombre) => this.cargar_modulo(nombre));
            return Promise.all(modulosResueltos).then((exportsResueltos) => {
                callback.apply(this, exportsResueltos);
            });
        }
        cargar_modulo(nombreModulo) {
            const modulo = this.modulos[nombreModulo];
            if (typeof modulo === "undefined") {
                throw new Error("No se encontró definido módulo «" + nombreModulo + "»");
            }
            if (!modulo.resuelto) {
                const exports = {};
                const dependencias = modulo.dependencias.map((dep) => this.cargar_modulo(dep));
                modulo.exports = modulo.factoria.apply(this, dependencias);
                modulo.resuelto = true;
            }
            return Promise.resolve(modulo.exports);
        }
        cargar_script(url) {
            return new Promise(function (resolve, reject) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                if (script.readyState) {  // IE
                    script.onreadystatechange = function () {
                        if (script.readyState === "loaded" || script.readyState === "complete") {
                            script.onreadystatechange = null;
                            resolve();
                        }
                    };
                } else {  // Otros navegadores
                    script.onload = function () {
                        resolve();
                    };
                }
                script.onerror = function () {
                    reject(new Error("Error al cargar el script " + url));
                };
                script.src = url;
                document.getElementsByTagName("head")[0].appendChild(script);
            });
        }
        cargar_estilo(url) {
            return new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                link.onload = () => {
                    resolve();
                };
                link.onerror = () => {
                    reject(new Error(`Error al cargar el archivo CSS: ${url}`));
                };
                document.head.appendChild(link);
            });
        }
    }
    return new Factoria_de_sistema_de_modulos();
});