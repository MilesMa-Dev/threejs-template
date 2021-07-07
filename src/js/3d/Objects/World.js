import * as THREE from 'three'
import Ground from './Ground';

export default class World {
    constructor(_options) {
        this.renderer = _options.renderer;
        this.sizes = _options.sizes;
        this.time = _options.time;
        this.resource = _options.resource;
        this.event = _options.event;
        this.camera = _options.camera;

        this.container = new THREE.Object3D();
        this.container.matrixAutoUpdate = false;

        this.resource.on(EventConst.RES_READY, this.onResReady.bind(this));
    }

    onResReady() {
        this.setLight();
        this.setGround();
    }

    /**
     * 地面
     */
    setGround() {
        this.ground = new Ground({
            renderer: this.renderer,
            time: this.time,
            sizes: this.sizes,
            resource: this.resource,
        })
        this.container.add(this.ground.container);
    }

    /**
     * 光线
     */
    setLight() {
        const parameter = {
            ambientColor: '#ffffff'
        }

        const ambientLight = new THREE.AmbientLight('#ffffff', 100)
        this.container.add(ambientLight)

        if (debug) {
            const debugFolder = gui.addFolder('light');

            debugFolder.addColor(parameter, 'ambientColor').name('环境光颜色').onChange(() => {
                ambientLight.color.set(parameter.ambientColor);
            })
            debugFolder.add(ambientLight, 'intensity').min(0).max(100).step(0.0001).name('环境光强度')
        }
    }
}