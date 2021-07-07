import * as THREE from 'three'
import ObjectBase from './base/ObjectBase';

export default class Ground extends ObjectBase {
    constructor(_options) {
        super(_options);

        this.setModel();
    }

    setModel() {
        const texture = this.resource.items['githubLogoTexture'];

        this.geometry = new THREE.PlaneGeometry(30, 30);
        this.material = new THREE.MeshStandardMaterial({
            color: '#666666',
            map: texture,
            side: THREE.DoubleSide
        });

        this.model = new THREE.Mesh(this.geometry, this.material);
        this.model.rotation.x = -Math.PI * 0.5;
        this.container.add(this.model);
    }
}