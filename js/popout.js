function popout (cfg) {
  let d = document.documentElement

  const getMidPoint = l => Math.round(l / 2)

  const UPPER_LEFT = 0
  const UPPER_RIGHT = 1
  const LOWER_RIGHT = 2
  const LOWER_LEFT = 3
  const X = 0
  const Y = 1

  const config = {
    vanishingPoint: cfg.vanishingPoint || {
      x: getMidPoint(d.clientWidth),
      y: getMidPoint(window.innerHeight + d.scrollTop),
      recalc: true
    },
    hooks: {
      canvas: cfg.hooks.canvas || 'depth',
      container: cfg.hooks.container || 'wrapper',
      popout: cfg.hooks.popout || '.pop'
    },
    dimensions: cfg.dimensions || {
      height: d.scrollHeight,
      width: d.clientWidth
    },
    gradient: {
      stop: cfg.gradient.stop || 60,
      color: cfg.gradient.color || 'black'
    },
    options: {
      stroke: cfg.stroke || false,
      noSides: cfg.noSides || false
    }
  }

  let {
    vanishingPoint: { x, y, recalc },
    gradient,
    hooks: { canvas, container, popout },
    dimensions: { width, height },
    options: { noSides, stroke }
  } = config

  function getFaces (el) {
    let offset = el.getBoundingClientRect()
    let faces = []
    let dimensions = {
      width: Math.round(el.offsetWidth),
      height: Math.round(el.offsetHeight)
    }
    let position = {
      left: offset.left + document.body.scrollLeft,
      top: offset.top + document.body.scrollTop
    }
    let coord = getCornerVals(dimensions, position)

    function Face (side) {
      this.coord = coord
      this.popColor = window.getComputedStyle(el).backgroundColor
      this.distance = getDistance(this.coord)
      this[side] = true
    }

    function getCornerVals ({ width, height }, { left, top }) {
      let corner = new Array(4)
      for (let i = 0; i < 4; i += 1) corner[i] = new Array(2)

      corner[UPPER_LEFT][X] = left
      corner[UPPER_LEFT][Y] = top + d.scrollTop
      corner[UPPER_RIGHT][X] = left + width
      corner[UPPER_RIGHT][Y] = top + d.scrollTop
      corner[LOWER_RIGHT][X] = left + width
      corner[LOWER_RIGHT][Y] = top + height + d.scrollTop
      corner[LOWER_LEFT][X] = left
      corner[LOWER_LEFT][Y] = top + height + d.scrollTop
      return corner
    }

    function getDistance (coord) {
      let distBuff
      let distance = Number.MAX_VALUE
      for (let a = 0; a < 4; a++) {
        distBuff = Math.sqrt(
          Math.pow(x - coord[a][X], 2) + Math.pow(y - coord[a][Y], 2)
        )
        if (distBuff < distance) distance = distBuff
      }
      return distance
    }
    coord[UPPER_LEFT][X] >= x && faces.push(new Face('left'))
    coord[UPPER_RIGHT][X] < x && faces.push(new Face('right'))
    coord[UPPER_LEFT][Y] > y && faces.push(new Face('top'))
    coord[LOWER_LEFT][Y] <= y && faces.push(new Face('bottom'))
    return faces
  }

  function draw (canvas, ctx, el) {
    let faces = []
    const clearCanvas = c =>
      c.getContext && c.getContext('2d').clearRect(0, 0, c.width, c.height)
    // Painters algorithm - determines paint order
    const sortByDistance = (a, b) =>
      a.distance < b.distance ? 1 : a.distance > b.distance ? -1 : 0

    function drawFaces (ctx, { left, right, bottom, top, coord, popColor }) {
      let lineargradient
      let gs = gradient.stop
      const neg = num => num * -1

      if (!noSides) {
        left && drawFace(UPPER_LEFT, LOWER_LEFT, gs, true)
        right && drawFace(UPPER_RIGHT, LOWER_RIGHT, neg(gs), true)
      }
      bottom && drawFace(LOWER_LEFT, LOWER_RIGHT, neg(gs))
      top && drawFace(UPPER_LEFT, UPPER_RIGHT, gs)

      function drawFace (coord1, coord2, gs, side) {
        lineargradient = side
          ? ctx.createLinearGradient(coord[coord1][X] + gs, y, x, y)
          : ctx.createLinearGradient(
            coord[UPPER_LEFT][X],
            coord[LOWER_RIGHT][Y] + gs,
            coord[UPPER_LEFT][X],
            y
          )
        lineargradient.addColorStop(0, popColor)
        lineargradient.addColorStop(1, gradient.color)
        ctx.fillStyle = lineargradient
        ctx.beginPath()
        ctx.moveTo(coord[coord1][X], coord[coord1][Y])
        ctx.lineTo(x, y)
        ctx.lineTo(coord[coord2][X], coord[coord2][Y])
        stroke && ctx.stroke()
        ctx.fill()
      }
    }

    if (el) {
      clearCanvas(canvas)
      for (let i = 0; i < el.length; i++) {
        getFaces(el[i]).forEach(face => faces.push(face))
      }
      faces.sort(sortByDistance)
      for (let i = 0; i < faces.length; i++) drawFaces(ctx, faces[i])
      window.requestAnimationFrame(draw)
    }
  }

  function canvasManager () {
    let wrapper = document.getElementById(container)
    let background = document.createElement('div')
    let newCanvas = document.createElement('canvas')

    const evDraw = () => draw(canvas, ctx, elProps)
    const getDocHeight = () => Math.max(d.scrollHeight, d.clientHeight)
    const setVanishingPoint = () => {
      x = getMidPoint(d.clientWidth)
      y = getMidPoint(window.innerHeight + d.scrollTop)
    }

    newCanvas.setAttribute('width', width || d.clientWidth)
    newCanvas.setAttribute('height', height || getDocHeight())
    newCanvas.setAttribute('id', canvas)
    background.setAttribute('id', 'background')
    background.appendChild(newCanvas)
    wrapper.parentNode.insertBefore(background, wrapper)
    let elProps = document.querySelectorAll(popout)
    let cvs = document.getElementById(canvas)
    if (cvs.getContext) var ctx = cvs.getContext('2d')

    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('a.pop').forEach(el => {
        ['click', 'focusin', 'focusout', 'mouseenter', 'mouseleave'].forEach(
          ev => el.addEventListener(ev, evDraw)
        )
      })
      evDraw()
    })
    window.addEventListener('resize', () => {
      recalc && setVanishingPoint()
      cvs.setAttribute('width', d.clientWidth)
      cvs.setAttribute('height', height || getDocHeight())
      evDraw()
    })
    recalc &&
      window.addEventListener('scroll', () => {
        setVanishingPoint()
        evDraw()
      })
    setVanishingPoint()
  }
  canvasManager()
}
popout(window.POPOUT_cfg)
