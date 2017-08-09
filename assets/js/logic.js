let levels
let keysSpeed
let keys
let error
// generate Keys

const keyboardkeys = document.querySelectorAll('.key')
const keyboardkeysLength = keyboardkeys.length

let levelbox = document.getElementById('levelBoard')
let keyboard = document.getElementById('keyboard')

function setLevel(levelNumber) {
  levelbox.className = 'levelBoard'
  keyboard.classList.add('active')

  switch (levelNumber) {
    case 1:
      levels = 5
      keysSpeed = 950
      break
    case 2:
      levels = 10
      keysSpeed = 550
      break
    default:
      levels = 15
      keysSpeed = 250
      break
  }
  keys = generateKeys(levels)
  nextRound(0)
}

//  Logic of the geme
function nextRound(currentLevel) {
  error = true
  if (currentLevel == levels) {
    return swal({
      title: 'YOU WIN',
      type: 'success',
      text: 'Do you want to play again?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      closeOnConfirm: true
    }, function(ok) {
      if (ok) {
        keyboard.classList.remove('active')
        levelbox.classList.add('active')
      }  else {
        swal("See you later", "Take Care :)")
        keyboard.classList.remove('active')
        levelbox.classList.add('active')
        const again = getElementByKeyCode(key)
        desactivete(again)
      }
    })
  }

  swal({
    timer: 1200,
    title: `Nivel ${currentLevel + 1} / ${levels}`,
    showConfirmButton: false
  })

  for (let i = 0; i <= currentLevel; i++) {
    setTimeout(() => activate(keys[i]), (keysSpeed * (i + 1) + 1000))
  }

  let i = 0
  let currentKey = keys[i]

  window.addEventListener('keydown', onkeydown)

  for (let j = 0; j < keyboardkeysLength; j++) {
    keyboardkeys[j].addEventListener('click', onclick)
  }

  function onkeydown(ev) {
    keyPressed(ev.keyCode)
  }

  function onclick(ev) {
    keyPressed(ev.target.innerHTML.toUpperCase().charCodeAt(0))
  }

  function keyPressed(key) {
    if (key == currentKey) {
      activate(currentKey, {success: true})
      i++;
      if (i > currentLevel) {
        window.removeEventListener('keydown', onkeydown)
        for (let j = 0; j < keyboardkeysLength; j++) {
          keyboardkeys[j].removeEventListener('click', onclick)
        }
        setTimeout(() => nextRound(i), 1500)
      }
      currentKey = keys[i]
    } else {
      window.removeEventListener('keydown', onkeydown)
      for (let j = 0; j < keyboardkeysLength; j++) {
        keyboardkeys[j].removeEventListener('click', onclick)
      }
      activate(key, {fail: true})

      setTimeout(()=> swal({
        title: 'YOU LOST ;)',
        text: 'Do you want to play again?',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        closeOnConfirm: false,
        closeOnCancel: false
      }, function(isConfirm) {
        if (isConfirm) {
          const again = getElementByKeyCode(key)
          desactivete(again)
          keys = generateKeys(levels)
          nextRound(0)
        } else {
          swal("See you later", "Take Care :)")
          keyboard.classList.remove('active')
          levelbox.classList.add('active')
          const again = getElementByKeyCode(key)
          desactivete(again)
        }
      }), 1000)
    }
  }
}

function generateRandomKey() {
  const min = 65
  const max = 90
  return Math.round(Math.random() * (max - min) + min)
}

function generateKeys(levels) {
  return new Array(levels).fill(0).map(generateRandomKey)
}

// Get method
function getElementByKeyCode(keyCode) {
  console.log(document.querySelector(`[data-key="${keyCode}"]`));
  return document.querySelector(`[data-key="${keyCode}"]`)
}

// changing key status
function activate(keyCode, opts = {}) {
  const el = getElementByKeyCode(keyCode)
  if (opts.fail) {
    el.classList.add('active')
    el.classList.add('fail')
    error = false
  }
  if (error) {
    el.classList.add('active')
    if (opts.success) {
      el.classList.add('success')
    }
    setTimeout(() => desactivete(el), 500)
  }
}

function desactivete(el) {
  el.className = 'key'
}
