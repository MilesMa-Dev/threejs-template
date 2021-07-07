import * as THREE from 'three'
import EventEmitter from '../../Utils/EventEmitter';

/**
 * 物体基类，不可直接调用
 */
export default class ObjectBase extends EventEmitter {
    constructor(_options) {
        super();

        this.renderer = _options.renderer;
        this.sizes = _options.sizes;
        this.time = _options.time;
        this.resource = _options.resource;

        this.container = new THREE.Object3D();
        this.container.matrixAutoUpdate = false;
    }

    /**设置模型 */
    setModel() {}

    /**设置3d材质 */
    setMaterial() {
        const material = new THREE.MeshStandardMaterial({
            color: '#d6eddc'
        })

        this.container.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });
    }
}