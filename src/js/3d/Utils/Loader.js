import EventEmitter from './EventEmitter.js'
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
    FBXLoader
} from 'three/examples/jsm/loaders/FBXLoader.js'
import {
    DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader.js'

export default class Resources extends EventEmitter {
    /**
     * Constructor
     */
    constructor() {
        super()

        this._setLoaders();

        this.loaded = 0;
        this.toLoad = 0;
        this.items = {};

        this.loadQueue = [];
    }

    /**
     * Set loaders
     */
     _setLoaders() {
        this.loaders = [];

        // Images
        this.loaders.push({
            extensions: ['jpg', 'png'],
            action: (_resource) => {
                const image = new Image()

                image.addEventListener('load', () => {
                    this.fileLoadEnd(_resource, image)
                })

                image.addEventListener('error', () => {
                    console.log('image error')
                    this.fileLoadEnd(_resource, image)
                })

                image.crossOrigin = "anonymous";
                image.src = _resource.source
            }
        })

        // Draco
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('plugin/draco/')
        dracoLoader.setDecoderConfig({
            type: 'js'
        })

        this.loaders.push({
            extensions: ['drc'],
            action: (_resource) => {
                dracoLoader.load(_resource.source, (_data) => {
                    this.fileLoadEnd(_resource, _data)

                    DRACOLoader.releaseDecoderModule()
                }, () => {}, err => {
                    console.error('draco error', _resource.name)
                })
            }
        })

        // GLTF
        const gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(dracoLoader)

        this.loaders.push({
            extensions: ['glb', 'gltf'],
            action: (_resource) => {
                gltfLoader.load(_resource.source, (_data) => {
                    this.fileLoadEnd(_resource, _data)
                }, () => {}, err => {
                    console.error('gltf error', _resource.name)
                })
            }
        })

        // FBX
        const fbxLoader = new FBXLoader()

        this.loaders.push({
            extensions: ['fbx'],
            action: (_resource) => {
                fbxLoader.load(_resource.source, (_data) => {
                    this.fileLoadEnd(_resource, _data)
                }, () => {}, err => {
                    console.log('fbx error')
                    console.error(err)
                })
            }
        })
    }

    _beginLoad() {
        const _resources = this.loadQueue[0].list;
        this.loaded = 0;
        this.toLoad = this.loadQueue[0].list.length;
        
        for (const _resource of _resources) {
            const extensionMatch = _resource.source.match(/\.([a-z]+)$/)

            if (extensionMatch && typeof extensionMatch[1] !== 'undefined') {
                const extension = extensionMatch[1]
                const loader = this.loaders.find((_loader) => _loader.extensions.find((_extension) => _extension === extension))

                if (loader) {
                    loader.action(_resource)
                } else {
                    console.warn(`Cannot found loader for ${_resource}`)
                }
            } else {
                console.warn(`Cannot found extension of ${_resource}`)
            }
        }
    }

    /**
     * 
     * @param {*} _resources 资源列表
     * @param {*} name 用于标记加载的资源组
     */
    load(_resources = [], name) {
        this.resName = name;

        this.loadQueue.push({
            name: name,
            list: _resources
        })

        if (this.loadQueue.length == 1) {
            this._beginLoad();
        }
    }

    /**
     * File load end
     */
    fileLoadEnd(_resource, _data) {
        this.loaded++;
        this.items[_resource.name] = _data;

        this.trigger(EventConst.FILE_END, [_resource, _data])

        if (this.loaded === this.toLoad) {
            this.trigger(EventConst.LOAD_END, [this.loadQueue[0].name])

            this.loadQueue.shift();
            if (this.loadQueue.length > 0) {
                this._beginLoad();
            }
        }
    }
}