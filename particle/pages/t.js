let THREE = null
let createScopedThreejs = null

try {
  const threeModule = require('threejs-miniprogram')
  createScopedThreejs = threeModule.createScopedThreejs
} catch (e) {
  console.error('Failed to load threejs-miniprogram:', e)
}

const SYS = wx.getSystemInfoSync()
const PIXEL_RATIO = SYS.pixelRatio || 2

/** 
 * 物理与渲染参数配置
 */
const ROWS = 28 
const COLS = 42 
const SPACING = 0.22 
const CLOTH_W = COLS * SPACING
const CLOTH_H = ROWS * SPACING
const HALF_H = CLOTH_H / 2

// 物理常量：微调重力和阻力以提升回归速度，消除慢动作感
const SUB_STEPS = 25 
const ITERATIONS = 3 
const GRAVITY = -865.0 // 增强重力，让纸张回归更快、更沉稳
const AIR_DRAG = 0.983 // 稍微降低阻力，让反馈更直接灵敏
const PAPER_STIFFNESS = 0.95 

Page({
  data: {},
  canvas: null,
  renderer: null,
  scene: null,
  camera: null,
  cloth: null,
  isReady: false,
  _drag: { active: false, idx: -1, pos: null, radius: 1.8 }, 
  _raycaster: null,
  _startTime: 0,
  _animFrameId: null,

  onReady() {
    if (!createScopedThreejs) {
      console.error('threejs-miniprogram not available')
      return
    }
    wx.createSelectorQuery()
      .select('#receiptCanvas')
      .node()
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          console.error('Canvas node not found')
          return
        }
        const canvas = res[0].node
        this.canvas = canvas
        try {
          THREE = createScopedThreejs(canvas)
          this._init(THREE)
        } catch (e) {
          console.error('Failed to init Three.js:', e)
        }
      })
  },

  onUnload() {
    if (this._animFrameId) {
      this._animFrameId = null
    }
    this.isReady = false
  },

  _init(THREE) {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true 
    })
    renderer.setSize(this.canvas.width, this.canvas.height)
    renderer.setPixelRatio(PIXEL_RATIO)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer = renderer

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xF2F0E9)
    this.scene = scene

    const camera = new THREE.PerspectiveCamera(35, this.canvas.width / this.canvas.height, 0.1, 200)
    camera.position.set(0, 5, 22)
    camera.lookAt(0, 0, 0)
    this.camera = camera

    const amb = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(amb)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0)
    mainLight.position.set(10, 20, 10)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.set(2048, 2048) 
    mainLight.shadow.bias = -0.0001
    scene.add(mainLight)

    const fillLight = new THREE.PointLight(0xfff0dd, 0.4)
    fillLight.position.set(-10, 0, 5)
    scene.add(fillLight)

    const ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(100, 100),
      new THREE.ShadowMaterial({ opacity: 0.1 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -HALF_H - 3
    ground.receiveShadow = true
    scene.add(ground)

    this._raycaster = new THREE.Raycaster()
    this._buildAdvancedCloth(THREE)

    this._startTime = Date.now()
    const loop = () => {
      if (!this.isReady) return
      this._animFrameId = this.canvas.requestAnimationFrame(loop)
      if (this.isReady) {
        this._updatePhysics()
        this._syncMesh()
      }
      renderer.render(scene, camera)
    }
    loop()
  },

  _buildAdvancedCloth(THREE) {
    const N = (ROWS + 1) * (COLS + 1)
    const pos = new Float32Array(N * 3)
    const old = new Float32Array(N * 3)
    const vel = new Float32Array(N * 3)
    const invMass = new Float32Array(N)

    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        const i = r * (COLS + 1) + c
        const x = (c - COLS * 0.5) * SPACING
        const y = HALF_H - r * SPACING
        const z = Math.random() * 0.01 

        pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z
        old[i*3] = x; old[i*3+1] = y; old[i*3+2] = z
        
        invMass[i] = (r < 1) ? 0 : 1.0
      }
    }

    const constraints = []
    const addDistConstraint = (a, b, stiffness = 1.0) => {
      const dx = pos[a*3] - pos[b*3], dy = pos[a*3+1] - pos[b*3+1], dz = pos[a*3+2] - pos[b*3+2]
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
      constraints.push({ a, b, dist, stiffness })
    }

    const getIdx = (r, c) => r * (COLS + 1) + c

    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        const i = getIdx(r, c)
        if (c < COLS) addDistConstraint(i, getIdx(r, c + 1), 1.0)
        if (r < ROWS) addDistConstraint(i, getIdx(r + 1, c), 1.0)
        if (c < COLS && r < ROWS) {
          addDistConstraint(i, getIdx(r + 1, c + 1), 0.9)
          addDistConstraint(getIdx(r + 1, c), getIdx(r, c + 1), 0.9)
        }
        if (c < COLS - 2) addDistConstraint(i, getIdx(r, c + 2), 0.5)
        if (r < ROWS - 2) addDistConstraint(i, getIdx(r + 2, c), 0.5)
        if (c < COLS - 3) addDistConstraint(i, getIdx(r, c + 3), 0.3)
        if (r < ROWS - 3) addDistConstraint(i, getIdx(r + 3, c), 0.3)
      }
    }

    const geometry = new THREE.PlaneBufferGeometry(CLOTH_W, CLOTH_H, COLS, ROWS)
    const texture = this._generateHighResTexture(THREE)
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      roughness: 0.65,
      metalness: 0.1,
      transparent: true,
      alphaTest: 0.5
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    this.scene.add(mesh)

    this.cloth = { pos, old, vel, invMass, constraints, mesh, N }
    this.isReady = true
  },

  _generateHighResTexture(THREE) {
    const W = 1024, H = 2048
    let cv
    try {
      cv = wx.createOffscreenCanvas({ type: '2d', width: W, height: H })
    } catch (e) {
      cv = wx.createCanvas()
      cv.width = W
      cv.height = H
    }
    const ctx = cv.getContext('2d')

    ctx.fillStyle = '#FBFAF5'
    ctx.fillRect(0, 0, W, H)
    for(let i=0; i<5000; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random()*0.02})`
      ctx.fillRect(Math.random()*W, Math.random()*H, 2, 2)
    }

    ctx.fillStyle = '#222'
    ctx.textAlign = 'center'
    ctx.font = 'bold 90px monospace'
    ctx.fillText('PIXEL PANTRY', W / 2, 200)
    

    ctx.font = '36px monospace'

    
    ctx.fillText('***************************', W/2, 260)
    ctx.fillText('欢迎来到世界模型时代', W/2, H - 200)




    ctx.textAlign = 'left'
    let y = 400


    const items = ["押注JEPA", "笃信AGI", "新范式的表征是未来？", "想加载online", "什么是我们可以抵达的"]


    items.forEach(item => {
      ctx.fillText(item, 100, y)
      ctx.textAlign = 'right'
      ctx.fillText('$' + (Math.random()*20).toFixed(2), W-100, y)
      ctx.textAlign = 'left'
      y += 80
    })

    ctx.fillStyle = '#000'
    for(let bx = 150; bx < W - 150; bx += Math.random()*15 + 5) {
      ctx.fillRect(bx, H - 450, 4, 120)
    }

    const tex = new THREE.CanvasTexture(cv)
    tex.anisotropy = 8 
    return tex
  },

  _updatePhysics() {
    const { pos, old, vel, invMass, constraints, N } = this.cloth
    const dt = 0.016 / SUB_STEPS
    const dragPos = this._drag.pos

    for (let s = 0; s < SUB_STEPS; s++) {
      for (let i = 0; i < N; i++) {
        if (invMass[i] === 0) continue
        const i3 = i * 3
        vel[i3] = (pos[i3] - old[i3]) * AIR_DRAG
        vel[i3+1] = (pos[i3+1] - old[i3+1]) * AIR_DRAG
        vel[i3+2] = (pos[i3+2] - old[i3+2]) * AIR_DRAG

        old[i3] = pos[i3]; old[i3+1] = pos[i3+1]; old[i3+2] = pos[i3+2]

        pos[i3] += vel[i3]
        pos[i3+1] += vel[i3+1] + GRAVITY * dt * dt
        pos[i3+2] += vel[i3+2]
      }

      if (this._drag.active && dragPos) {
        for (let i = 0; i < N; i++) {
          if (invMass[i] === 0) continue
          const i3 = i * 3
          const dx = pos[i3] - dragPos.x, dy = pos[i3+1] - dragPos.y, dz = pos[i3+2] - dragPos.z
          const distSq = dx*dx + dy*dy + dz*dz
          const rSq = this._drag.radius * this._drag.radius
          if (distSq < rSq) {
            const weight = Math.exp(-distSq / (rSq * 0.5))
            pos[i3] += (dragPos.x - pos[i3]) * weight * 0.2
            pos[i3+1] += (dragPos.y - pos[i3+1]) * weight * 0.2
            pos[i3+2] += (dragPos.z - pos[i3+2]) * weight * 0.2
          }
        }
      }

      for (let j = 0; j < ITERATIONS; j++) {
        for (let c = 0; c < constraints.length; c++) {
          const { a, b, dist, stiffness } = constraints[c]
          const a3 = a * 3, b3 = b * 3
          const dx = pos[a3] - pos[b3], dy = pos[a3+1] - pos[b3+1], dz = pos[a3+2] - pos[b3+2]
          const currentDist = Math.sqrt(dx*dx + dy*dy + dz*dz)
          if (currentDist < 0.0001) continue

          const error = (currentDist - dist) / currentDist
          const totalInvMass = invMass[a] + invMass[b]
          if (totalInvMass === 0) continue

          const correction = error * stiffness * PAPER_STIFFNESS / totalInvMass
          if (invMass[a] > 0) {
            pos[a3] -= dx * correction * invMass[a]
            pos[a3+1] -= dy * correction * invMass[a]
            pos[a3+2] -= dz * correction * invMass[a]
          }
          if (invMass[b] > 0) {
            pos[b3] += dx * correction * invMass[b]
            pos[b3+1] += dy * correction * invMass[b]
            pos[b3+2] += dz * correction * invMass[b]
          }
        }
      }
    }
  },

  _syncMesh() {
    const { mesh, pos } = this.cloth
    const attr = mesh.geometry.attributes.position
    attr.array.set(pos)
    attr.needsUpdate = true
    mesh.geometry.computeVertexNormals() 
  },

  _rayPlane(touch) {
    const ndcX = (touch.x / this.canvas.width) * 2 - 1
    const ndcY = 1 - (touch.y / this.canvas.height) * 2
    this._raycaster.setFromCamera({ x: ndcX, y: ndcY }, this.camera)
    const ray = this._raycaster.ray
    const t = -ray.origin.z / ray.direction.z
    return { x: ray.origin.x + ray.direction.x * t, y: ray.origin.y + ray.direction.y * t, z: 0 }
  },

  touchStart(e) {
    if (!this.isReady) return
    const wp = this._rayPlane(e.touches[0])
    this._drag.active = true
    this._drag.pos = wp
  },

  touchMove(e) {
    if (!this._drag.active) return
    const wp = this._rayPlane(e.touches[0])
    this._drag.pos = wp
    this._drag.pos.z = 1.5 
  },

  touchEnd() {
    this._drag.active = false
    this._drag.pos = null
  }
})
