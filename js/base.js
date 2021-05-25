const Flood = {}
Flood.size = 14
Flood.limit = 25
Flood.started = false
Flood.music_started = false

Flood.init = function () {
  Flood.el_grid = document.querySelector("#grid")
  Flood.el_colorbox = document.querySelector("#colorbox")
  Flood.el_counter = document.querySelector("#counter")
  Flood.audio_laser = document.querySelector("#audio_laser")
  Flood.audio_ambient = document.querySelector("#audio_ambient")
  Flood.audio_bell = document.querySelector("#audio_bell")
  Flood.get_style()
  Flood.prepare_blocks()
  Flood.prepare_colorbox()
  Flood.prepare_counter()
  Flood.start()
}

Flood.start = function () {
  Flood.active = 0
  Flood.count = 0
  Flood.start_grid()
  Flood.update_counter()
  Flood.started = true
}

Flood.random_int = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

Flood.get_style = function () {
  let style = getComputedStyle(document.body)

  Flood.colors = [
    "#ffffff",
    style.getPropertyValue("--color_1"),
    style.getPropertyValue("--color_2"),
    style.getPropertyValue("--color_3"),
    style.getPropertyValue("--color_4"),
    style.getPropertyValue("--color_5"),
    style.getPropertyValue("--color_6")
  ]
}

Flood.set_active = function (item, color) {
  item.active = true
  Flood.active += 1
  item.block.classList.add("active")
}

Flood.set_color = function (item, color) {
  item.color = color
  item.block.dataset.color = color
  item.block.style.backgroundColor = Flood.colors[color]
}

Flood.random_color = function () {
  return Flood.random_int(1, Flood.colors.length - 1)
}

Flood.start_grid = function () {
  Flood.grid = []
  Flood.el_grid.innerHTML = ""

  for (let y=0; y<Flood.size; y++) {
    let row = []
    let elrow = document.createElement("div")
    elrow.classList.add("grid_row")

    for (let x=0; x<Flood.size; x++) {
      let item = {}
      item.x = x
      item.y = y
      item.active = false
      item.checked = false

      let color = Flood.random_color()
      let block = document.createElement("div")
      block.classList.add("block")
      block.dataset.color = color
      item.block = block
      Flood.set_color(item, color)

      row.push(item)
      elrow.append(block)
    }

    Flood.grid.push(row)
    Flood.el_grid.append(elrow)
  }

  let first = Flood.grid[0][0]
  Flood.set_active(first)
  Flood.set_color(first, 0)
}

Flood.onclick = function (color) {
  if (color === 0) {
    return
  }
  
  if (!Flood.music_started) {
    Flood.audio_ambient.play()
    Flood.music_started = true
  }

  Flood.fill(0, 0, color)
  Flood.reset_checked()
  Flood.count += 1
  Flood.update_counter()
  Flood.audio_laser.play()
}

Flood.prepare_blocks = function () {
  Flood.el_grid.addEventListener("click", (e) => {
    if (!Flood.started) {
      return
    }

    if (e.target.classList.contains("block")) {
      Flood.onclick(parseInt(e.target.dataset.color))
    }
  })
}

Flood.prepare_colorbox = function () {
  Flood.el_colorbox.addEventListener("click", (e) => {
    if (!Flood.started) {
      return
    }

    if (e.target.classList.contains("block")) {
      Flood.onclick(parseInt(e.target.dataset.color))
    }
  })
}

Flood.reset_checked = function () {
  for (let row of Flood.grid) {
    for (let item of row) {
      item.checked = false
    }
  }
}

Flood.fill = function (y, x, color) {
  if (y < 0 || y >= Flood.size) {
    return
  }

  if (x < 0 || x >= Flood.size) {
    return
  }

  let item = Flood.grid[y][x]

  if (item.checked) {
    return
  }

  item.checked = true
  let is_first = y === 0 && x === 0
  
  if (is_first || item.active || item.color === color) {
    if (!item.active) {
      Flood.set_active(item, color)
    }

    if (item.color !== color) {
      Flood.set_color(item, color)
    }

    Flood.fill(y + 1, x, color)
    Flood.fill(y - 1, x, color)
    Flood.fill(y, x + 1, color)
    Flood.fill(y, x - 1, color)
  }

  return
}

Flood.prepare_counter = function () {
  Flood.el_counter.addEventListener("click", function () {
    Flood.start()
  })
}

Flood.update_counter = function () {
  Flood.el_counter.textContent = `Clicks: ${Flood.count} / ${Flood.limit}`
  let won = Flood.active === Flood.size * Flood.size

  if (won || Flood.count >= Flood.limit) {
    Flood.started = false
    Flood.el_counter.textContent += ` (Click Here To Restart)`
    Flood.audio_bell.play()
  }
}