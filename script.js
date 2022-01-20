// ---------- HOME SCREEN ELEMENTS --------------

const startSkull = document.getElementById('start-skull');
const startBtn = document.getElementById('start-play')
const startConfigMenu = document.getElementById('start-config')
const rulesBtn = document.getElementById('start-button-rules')
const rulebook = document.getElementById('start-rulebook')
const homeScreen = document.getElementById('start')

// ---------- HOME SCREEN --------------

// operates spinning skull animation in home screen
let framesNum = 40

let startSkullImages = []

for (let i = 1; i <= framesNum; i++){
    
    const frame = document.createElement('img');
    frame.setAttribute('src', `skull-horizontal-spin/${i}.PNG`)
    startSkullImages.push(frame)
    startSkull.appendChild(frame)
}

let frameCount = 0
setInterval(()=>{
    startSkullImages[frameCount].style.display = 'none'
    
    if(frameCount == framesNum-1){
        frameCount = 0
    }

    frameCount++

    startSkullImages[frameCount].style.display = 'block'
},30)

// enables rulebook
rulesBtn.addEventListener('click', () => {
    rulebook.style.display = 'block'
})

rulebook.addEventListener('click', () => {
    rulebook.style.display = 'none'
})

// shows pre-game menu
startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none'
    startConfigMenu.style.display = 'block'
})

// ------------- FORM ELEMENTS ---------------------

const player1NameInput = document.getElementById('player1NameInput')
const player2NameInput = document.getElementById('player2NameInput')
const quantity = document.getElementById('quantity')
const modeRadioBtns = document.getElementsByName('mode')
const startGameBtn = document.getElementById('start-submit')
const startForm = document.getElementById('start-form')

// ------------- GAME SCREEN ELEMENTS ---------------

const gameScreen = document.getElementById('game')
const skullPlaceholder1 = document.getElementById('player1-skull')
const skullPlaceholder2 = document.getElementById('player2-skull')
const cardStackPlaceholder1 = document.getElementById('player1-card-stack-placeholder')
const cardStackPlaceholder2 = document.getElementById('player2-card-stack-placeholder')
const playerAssets = document.querySelector('.player-assets')
const cardsWonEl = document.getElementById('cards-won')
const advantageBar = document.getElementById('advantageBar')
const advantageMeter1 = document.getElementById('firstPlayerAdvantageMeter')
const advantageMeter2 = document.getElementById('secondPlayerAdvantageMeter')
const cardsNumAdvBar1 = document.getElementById('firstPlayerCardsNum')
const cardsNumAdvBar2 = document.getElementById('secondPlayerCardsNum')
const gameInfoEl = document.getElementById('game-info')
const playerNameEl1 = document.getElementById('firstPlayerName')
const playerNameEl2 = document.getElementById('secondPlayerName')
const advanceBtn = document.getElementById('advanceBtn')
const autoBtn = document.getElementById('auto-btn')
const leaveGameBtn = document.getElementById('game-leave-btn')
const speedBtns = [...document.getElementsByClassName('speed-button')]

// -------------- END SCREEN ELEMENTS --------------

const noddingHeadContainer1 = document.getElementById('nodding-head1')
const noddingHeadContainer2 = document.getElementById('nodding-head2')
const winnerName = document.getElementById('winner')
const warsWagedDisplay = document.getElementById('wars-waged')
const totalCardsTurnedDisplay = document.getElementById('total-cards-turned')
const timeElapsedDisplay = document.getElementById('time-elapsed')
const resetBtn = document.getElementById('reset-btn')
const endScreen = document.getElementById('end-screen')

////// ---------------- CLASSES ----------------
class Player{
    constructor(currentCard, cardsOnTheLine, cards, name, timerId, lastStackImg, lastFrame, cardsNum, skullPlaceholder, allCardsPrecentage,
         isAdvantageous, isDisadvantageous, cardStackImages, playerSkullImages){
        this.currentCard = currentCard
        this.cardsOnTheLine = cardsOnTheLine
        this.cards = cards
        this.name = name
        this.timerId = timerId
        this.lastStackImg = lastStackImg
        this.lastFrame = lastFrame
        this.cardsNum = cardsNum
        this.skullPlaceholder = skullPlaceholder
        this.allCardsPrecentage = allCardsPrecentage
        this.isAdvantageous = isAdvantageous
        this.isDisadvantageous = isDisadvantageous
        this.cardStackImages = cardStackImages
        this.playerSkullImages = playerSkullImages
    }
}

class Card {
    constructor(figure,color,imageFile){
        this.figure = figure
        this.color = color
        this.imageFile = imageFile
    }
}

// array used when two cards' strength is compared 
const figureValues = [2, 3, 4, 5, 6, 7, 8, 9, 10,'j','q','k','a']

// creates one unshuffled deck for generating shuffled ones  
let regDeck = []
cardsFilePath = 'cards/'
for( let i = 1; i <= 52; i++){
    let color
    let figure
    
    if (i <= 13){
        color = 'karo'
    }else if (i <= 26){
        color = 'kier'
    }else if (i <= 39){
        color = 'pik'
    }else{
        color = 'trefl'
    }

    if (i % 13 == 1){
        figure = 'a'
    }else if (i % 13 == 11){
        figure = 'j'
    }else if (i % 13 == 12){
        figure = 'q'
    }else if (i % 13 == 0){
        figure = 'k'
    }else {
        figure = i % 13
    }

    const card = new Card(figure, color, `${cardsFilePath}${color}_${figure}.PNG`)
    regDeck.push(card)
}

// ----------- GLOBAL VARIABLES ------------
let numOfDecks
let player1Name
let player2Name
let mode
let speed
let existingCardEl = []
let existingCardImg = []
let player1SkullImages
let player2SkullImages
let playerSkullImagesNum = 7
let extension
let gameDeck
let players
let cardsTurnedCounter
let warsWagedCounter
let secondsElapsedCounter
let waitTime
let longerWaitTime


// ----------- GAME START ----------------

startForm.addEventListener('submit', startNewGame)
resetBtn.addEventListener('click', reset)

////// --------------- FUNCTIONS ----------------

// resets all values and starts the game
function startNewGame(e){
    e.preventDefault()

    // gets the values the user set in the home screen form
    numOfDecks = quantity.value
    player1Name = player1NameInput.value
    player2Name = player2NameInput.value
    for (radio of modeRadioBtns){
            if (radio.checked){
                mode = radio.value
                if (mode == 'manual'){
                    
                    speed = 1
                    
                }else{
                    speed = 0
                }
            }
    }
    
    changeSpeed(speed)    

    // transition from home screen to game screen
    homeScreen.style.left = '-100vw'
    gameScreen.style.left = '0'
    endScreen.style.left = '0'

    //resets images of players' card stacks
    cardStackPlaceholder1.innerHTML = ''
    cardStackPlaceholder2.innerHTML = ''
    cardStack1Images = []
    cardStack2Images = []
    for (let i = 1; i <= 20; i++){
        let img1 = document.createElement('img')
        let img2 = document.createElement('img')

        img1.setAttribute('src', `card-stack/${i}.png`)
        img2.setAttribute('src', `card-stack/${i}.png`)

        cardStack1Images.push(img1)
        cardStack2Images.push(img2)

        cardStackPlaceholder1.appendChild(img1)
        cardStackPlaceholder2.appendChild(img2)   
    }

    //creates a shuffled deck for the new game
    gameDeck = shuffle(numOfDecks)

    // resets the images of players' heads
    skullPlaceholder1.innerHTML = ''
    skullPlaceholder2.innerHTML = ''
    player1SkullImages = []
    player2SkullImages = []
    playerSkullImagesNum = 7

    extension = 'pure'
    for(let j = 1; j <= 3; j++){
        for(let i = 1; i <= playerSkullImagesNum; i++){
            if (j == 2){
                extension = 'heart'
            }else if (j == 3){
                extension = 'x'
            }

            const skull1 = document.createElement('img');
            skull1.setAttribute('src', `skull-idle-${extension}/${i}.PNG`)
            player1SkullImages.push(skull1)
            skullPlaceholder1.appendChild(skull1)

            const skull2 = document.createElement('img');
            skull2.setAttribute('src', `skull-idle-${extension}/${i}.PNG`)
            player2SkullImages.push(skull2)
            skullPlaceholder2.appendChild(skull2)

        }
    }

    // creates player objects for the new game
    players = [
        new Player(null, [], gameDeck.slice(0, gameDeck.length / 2), player1Name, null, 1, null, gameDeck.length / 2,
        skullPlaceholder1, 50, false, false, cardStack1Images, player1SkullImages),
        new Player(null, [], gameDeck.slice(gameDeck.length / 2), player2Name, null, 1, null, gameDeck.length / 2,
        skullPlaceholder2, 50, false, false, cardStack2Images, player2SkullImages)
    ]

    // updates game screen elements with starter values
    playerNameEl1.textContent = players[0].name
    playerNameEl2.textContent = players[1].name
    updateAdvantageBar()
    updateCardStack()
    updateGameInfo()

    // starts players' heads idle animations
    players.forEach(player => {
        clearInterval(player.timerId)
        
        gameSkullAnimation(player)
    })

    // resets counters used for end screen's summary 
    cardsTurnedCounter = 0
    warsWagedCounter = 0
    secondsElapsedCounter = 0
    

    setTimeout(() => {    
        if (mode == 'manual'){

            // gives control to player
            advanceBtn.addEventListener('click', normalAdvance)
            leaveGameBtn.addEventListener('click', reset)
            if (mode == 'auto'){
                setTimeout(() => {
                    advanceBtn.click()
                },100)
            }

            // sets starting timeout time for manual mode 
            waitTime = 1100
            longerWaitTime = 2000

            // gives eeach animation speed button it's action
            speedBtns.forEach(btn => {
    
                let x
                switch (btn.textContent){
                    case 'x1':
                        x = 1
                        break
                    case 'x2':
                        x = 2
                        break
                    case 'x5':
                        x = 5
                        break
                    case 'x10':
                        x = 10
                        break
                    case 'x15':
                        x = 15
                        break
                    case 'x20':
                        x = 20
                        break
                }
                btn.addEventListener('click', () => changeSpeed(x))
            })
            
            autoBtn.addEventListener('click', autoOn)
        }else{
            // starts instant mode
            instantNormalAdvance()
        }
    },2000)
}

// creates a shuffled array of cards from n number of whole decks
function shuffle(numOfDecks){
    let shuffled = []
    
    for (let i = 1; i <= numOfDecks; i++){
        
        // array of numbers from 0 to 51
        let possibleCards = [...Array(52).keys()]
        
        for (let i = 1; i <= 52; i++){
            const randomIndex = Math.floor(Math.random() * possibleCards.length)

            shuffled.push(regDeck[possibleCards[randomIndex]])
            possibleCards.splice(randomIndex, 1)
        }
    }

    return shuffled
}

// calculates the precentage
function percentage(partialValue, totalValue){
    return (100 * partialValue) / totalValue;
} 

// advances the game in auto and manual mode
function normalAdvance(){
    updateCardStack()

    players.forEach(player => {
        player.currentCard = player.cards[0]
        player.cardsOnTheLine.push(player.currentCard)
        player.cards.shift()

        cardsTurnedCounter++
    })

    
    secondsElapsedCounter += 5

    existingCardEl.forEach(card => {
        card.style.zIndex = 0
    } )

    let newCard1
    let newCard2

    advanceBtn.removeEventListener('click', normalAdvance)
 
    newCard1 = document.createElement('div')
    newCard1.classList.add('card-placeholder', 'player1-card-placeholder', 'card-from-deck-transition')
    playerAssets.appendChild(newCard1)
    console.log(players[0].currentCard.imageFile)
    newCard1.innerHTML = `<img src=${players[0].currentCard.imageFile}>`
    existingCardImg.push(newCard1.innerHTML)
    existingCardEl.push(newCard1)

    newCard2 = document.createElement('div')
    newCard2.classList.add('card-placeholder', 'player2-card-placeholder', 'card-from-deck-transition')
    playerAssets.appendChild(newCard2)
    console.log(players[1].currentCard.imageFile)
    newCard2.innerHTML = `<img src=${players[1].currentCard.imageFile}>`
    existingCardImg.push(newCard2.innerHTML)
    existingCardEl.push(newCard2)
    
    
    
    setTimeout(() => {
        newCard1.classList.remove('card-from-deck-transition')
        newCard2.classList.remove('card-from-deck-transition')
        

        setTimeout(() => {
            

            let tie = false
            let won = -1
            let lost = -1

            if (figureValues.indexOf(players[0].currentCard.figure) > 
                figureValues.indexOf(players[1].currentCard.figure)){
                
                won = 0
                lost = 1

            }else if(figureValues.indexOf(players[0].currentCard.figure) < 
                    figureValues.indexOf(players[1].currentCard.figure)){
                
                won = 1
                lost = 0

            }else{
                tie = true
            }

            

            if (!tie){
                players[won].cardsOnTheLine.push(...players[lost].cardsOnTheLine)
                players[won].cards.push(...players[won].cardsOnTheLine)
                players.forEach(player => {
                    player.cardsOnTheLine = []
                    player.cardsNum = player.cards.length
                    
                    existingCardEl.forEach(card => {
                        card.classList.add('card-to-center-transition')
                    } )

                    if(won == 0){

                        winFilter(0)
                    }else{

                        winFilter(1)
                    }
                    updateAdvantageBar()

                    setTimeout(() => {
                        existingCardEl.forEach(card => {
                            card.classList.add('card-to-bottom-transition')
                        } )
                        
                        
                        setTimeout(() => {
                            existingCardEl.forEach(card => {
                                card.remove()
                            } )
                            let images = ''
                            existingCardImg.forEach(card => {
                                images += card
                            } )
                            cardsWonEl.innerHTML = images
                            
                            cardsWonEl.classList.remove('cards-won-hidden')
                            setTimeout(() => {
                                if (won == 0){
                                    cardsWonEl.classList.add('cards-won-to-left')
                                }else{
                                    cardsWonEl.classList.add('cards-won-to-right')
                                }
                                setTimeout(() => {
                                    cardsWonEl.classList.remove('cards-won-to-left','cards-won-to-right')
                                    cardsWonEl.classList.add('cards-won-hidden')
                                    
                                    existingCardImg = []
                                    cardsWonEl.innerHTML = ''
                                    
                                    if(!checkWin()){
                                        advanceBtn.addEventListener('click', normalAdvance)
                                        if (mode == 'auto'){
                                            
                                            setTimeout(() => {
                                                advanceBtn.click()
                                            },100)
                                        }
                                    }
                                    
                                   
                                },longerWaitTime)
                            },waitTime)
                            

                        },waitTime)
                    },waitTime)
                    
                })
            }else{
                advanceBtn.addEventListener('click', warAdvance)
                if (mode == 'auto'){
                    
                    setTimeout(() => {
                        advanceBtn.click()
                    },100)
                }
                
                
            }
        },waitTime)
        
    },waitTime)
    
    
}

// simulates the game in instant mode (without any animations) 
function instantNormalAdvance(){
    updateAdvantageBar()
    updateCardStack()
    while(players[0].cardsNum != 0 && players[1].cardsNum != 0){
        

        players.forEach(player => {
            player.currentCard = player.cards[0]
            player.cardsOnTheLine.push(player.currentCard)
            player.cards.shift()

            cardsTurnedCounter++
        })

        secondsElapsedCounter += 5

        let tie = false
        let won = -1
        let lost = -1

        if (figureValues.indexOf(players[0].currentCard.figure) > 
            figureValues.indexOf(players[1].currentCard.figure)){
            
            won = 0
            lost = 1

        }else if(figureValues.indexOf(players[0].currentCard.figure) < 
                figureValues.indexOf(players[1].currentCard.figure)){
            
            won = 1
            lost = 0

        }else{
            tie = true
        }

        if (!tie){
            players[won].cardsOnTheLine.push(...players[lost].cardsOnTheLine)
            players[won].cards.push(...players[won].cardsOnTheLine)
            players.forEach(player => {
                player.cardsOnTheLine = []
                player.cardsNum = player.cards.length

                
            })
            
            if(players[0].cardsNum != 0 && players[1].cardsNum != 0){
                
                continue
            }else{
                checkWin()
                break
            }
        }else{
            warsWagedCounter++
            cardsTurnedCounter += 2
            secondsElapsedCounter += 5
                
            players.forEach(player => {
                player.currentCard = player.cards[0]
                player.cardsOnTheLine.push(player.currentCard)
                player.cards.shift()
                player.cardsNum = player.cards.length
                
            })
            if(players[0].cardsNum != 0 && players[1].cardsNum != 0){
                
                continue
            }else{
                checkWin()
                break
            }
            
        }
        
    }
    updateAdvantageBar()
    updateCardStack()
}

// dictates what happens when players play cards with the same figure in auto and manual mode 
function warAdvance(){
    advanceBtn.removeEventListener('click', warAdvance)

    warsWagedCounter++
    cardsTurnedCounter += 2
    secondsElapsedCounter += 5

    let warCard1 = document.createElement('div')
    warCard1.innerHTML = "<img src='other/card-back.png'>"
    warCard1.classList.add('card-war-placeholder','card-from-deck-transition','player1-card-war-placeholder')
    playerAssets.appendChild(warCard1)
    existingCardEl.push(warCard1)

    let warCard2 = document.createElement('div')
    warCard2.innerHTML = "<img src='other/card-back.png'>"
    warCard2.classList.add('card-war-placeholder','card-from-deck-transition','player2-card-war-placeholder')
    playerAssets.appendChild(warCard2)
    existingCardEl.push(warCard2)

    setTimeout(() => {
        warCard1.classList.remove('card-from-deck-transition')
        warCard2.classList.remove('card-from-deck-transition')
        warCard1.style.zIndex = 1 
        warCard2.style.zIndex = 1
                    
        players.forEach(player => {
            player.currentCard = player.cards[0]
            player.cardsOnTheLine.push(player.currentCard)
            player.cards.shift()

            existingCardImg.push(`<img src='cards/${player.currentCard.color}_${player.currentCard.figure}.png'>`)
        })
        updateCardStack()

        if(!checkWin()){
            advanceBtn.addEventListener('click', normalAdvance)
            if (mode == 'auto'){
                setTimeout(() => {
                    advanceBtn.click()
                },100)
            }
        }
        
    },waitTime)
    
}

// displays the correct card stack image for the amount of cards the player has (in front of player head)
function updateCardStack(){
    players.forEach(player => {
        let imgNum = 0
        let n = player.cardsNum
        
        if (n == 1){
            imgNum = 1
        }else if (n <= 5){
            imgNum = 2
        }else if (n <= 10){
            imgNum = 3
        }else if (n <= 15){
            imgNum = 4
        }else if (n <= 20){
            imgNum = 5
        }else if (n <= 25){
            imgNum = 6
        }else if (n <= 30){
            imgNum = 7
        }else if (n <= 40){
            imgNum = 8
        }else if (n <= 60){
            imgNum = 9
        }else if (n <= 80){
            imgNum = 10
        }else if (n <= 100){
            imgNum = 11
        }else if (n <= 150){
            imgNum = 12
        }else if (n <= 200){
            imgNum = 13
        }else if (n <= 300){
            imgNum = 14
        }else if (n <= 400){
            imgNum = 15
        }else if (n <= 500){
            imgNum = 16
        }else if (n <= 650){
            imgNum = 17
        }else if (n <= 800){
            imgNum = 18
        }else if (n < 1000){
            imgNum = 19
        }else if (n >= 1000){
            imgNum = 20
        }
        player.cardStackImages[player.lastStackImg - 1].style.display = 'none'

        if(imgNum != 0){
            player.cardStackImages[imgNum-1].style.display = 'block'
            player.lastStackImg = imgNum
        }
        
    })
}

// begins player head idle animation
function gameSkullAnimation(player){
    
    let speed = 65
    
    let switchDirectionFlag = true
    let switchDirectionInitial = 2
    let switchDirectionWait = switchDirectionInitial
    
    let perFromBottom = 0
    let switchFloatDirectionFlag = true
    let switchFloatDirectionInitial = 5
    let switchFloatDirectionWait = switchFloatDirectionInitial

    let currentFrame = 0
    player.timerId = setInterval(()=>{        
        player.playerSkullImages[currentFrame].style.display = 'none'
        
        if (player.isAdvantageous){
            currentFrame = (currentFrame % 7) + 7
        }else if(player.isDisadvantageous){
            currentFrame = (currentFrame % 7) + 14
        }else{
            currentFrame = currentFrame % 7
        }
        
        if ((currentFrame % 7 == 0 && switchDirectionWait != 0) || (currentFrame % 7 == 6 && switchDirectionWait != 0)){
            switchDirectionWait--
        }else{
            switchDirectionWait = switchDirectionInitial
            if (currentFrame % 7 == 6){
                switchDirectionFlag = false
            }else if (currentFrame % 7 == 0){
                switchDirectionFlag = true
            }

            if(switchDirectionFlag){
                currentFrame++
            }else{
                currentFrame--
            }
        }

        player.playerSkullImages[currentFrame].style.bottom = `${perFromBottom}%`
        player.playerSkullImages[currentFrame].style.display = 'block'

        if ((perFromBottom <= 0 && switchFloatDirectionWait != 0) || (perFromBottom > 25 && switchFloatDirectionWait != 0)){
            switchFloatDirectionWait--
        }else{
            switchFloatDirectionWait = switchFloatDirectionInitial
            if (perFromBottom <= 0){
                switchFloatDirectionFlag = false
            }else if(perFromBottom >= 25){
                switchFloatDirectionFlag = true
            }

            if (switchFloatDirectionFlag){
                perFromBottom--
            }else{
                perFromBottom+=2
            }
        }
    },speed)
}

// updates the bar at the top
function updateAdvantageBar() {
    players.forEach(player => {
        player.allCardsPrecentage = percentage(player.cardsNum,numOfDecks*52)
    })

    updatePlayerState()

    cardsNumAdvBar1.textContent = players[0].cardsNum
    cardsNumAdvBar2.textContent = players[1].cardsNum

    advantageMeter1.style.width = `${players[0].allCardsPrecentage}%`
    advantageMeter2.style.width = `${players[1].allCardsPrecentage}%`
}

// changes state to display different player head effects
function updatePlayerState(){
    players.forEach(player => {
        if (player.allCardsPrecentage > 65){
            player.isAdvantageous = true
        }else if (player.allCardsPrecentage < 20){
            player.isDisadvantageous = true
        }else{
            player.isDisadvantageous = false
            player.isAdvantageous = false
        }
    })
}

// changes animation speed in css and js
function changeSpeed(divider){
    if(divider == 0){
        document.documentElement.style.setProperty('--fast-speed', `0s`)
        document.documentElement.style.setProperty('--medium-speed', `0s`)
        document.documentElement.style.setProperty('--slow-speed', `0s`)

        waitTime = 0
        longerWaitTime = 0
    }else{
        document.documentElement.style.setProperty('--fast-speed', `${1 / divider}s`)
        document.documentElement.style.setProperty('--medium-speed', `${2 / divider}s`)
        document.documentElement.style.setProperty('--slow-speed', `${0.5 / divider}s`)

        waitTime = (1.1 / divider) * 1000
        longerWaitTime = (2 / divider) * 1000

        speed = divider
        updateGameInfo()

        speedBtns.forEach(btn => {
            btn.classList.remove('active-speed-btn')
            if(btn.textContent == `x${divider}`){
                btn.classList.add('active-speed-btn')
            }
        })
    }
    
}

// updates info text at the bottom-left
function updateGameInfo(){
    gameInfoEl.textContent = `Mode: ${mode.toUpperCase()} | Decks: ${numOfDecks} | Speed: x${speed}`
}

//player head explodes
function explode(playerId){
    let explosionImgElements = []
    // container.style.zIndex = 100
    for (let i = 1; i <= 6; i++){
        const expImg = document.createElement('img')
        expImg.setAttribute('src', `explode/${i}.PNG`)
        expImg.style.height = '200%'
        expImg.style.width = '350%'
        expImg.style.maxWidth = 'none'
        expImg.style.marginBottom = '-70%'
        if(playerId == 0){
            expImg.style.marginLeft= '-50%'
        }else{
            expImg.style.marginLeft= '-210%'
        }
        
        
        players[playerId].skullPlaceholder.appendChild(expImg)
        explosionImgElements.push(expImg)
    }

    let time = 60

    explosionImgElements[0].style.display = 'block'

    setTimeout(()=>{
        explosionImgElements[0].style.display = 'none'
        explosionImgElements[1].style.display = 'block'
    },time)

    setTimeout(()=>{
        explosionImgElements[1].style.display = 'none'
        explosionImgElements[2].style.display = 'block'
    },time*2)

    setTimeout(()=>{
        explosionImgElements[2].style.display = 'none'
        explosionImgElements[3].style.display = 'block'
    },time*3)

    setTimeout(()=>{
        explosionImgElements[3].style.display = 'none'
        explosionImgElements[4].style.display = 'block'
    },time*4)

    setTimeout(()=>{
        explosionImgElements[4].style.display = 'none'
        explosionImgElements[5].style.display = 'block'
    },time*5)

    setTimeout(()=>{
        explosionImgElements[5].style.display = 'none'
        
        const lostImg = document.createElement('img')
        lostImg.setAttribute('src', 'skull-idle-x/3.PNG')
        lostImg.style.transform = 'rotate(110deg)'
        lostImg.style.display = 'block'
        
        players[playerId].skullPlaceholder.innerHTML = ''
        players[playerId].skullPlaceholder.appendChild(lostImg)
    },time*6)
    
}

// player head spins
function wonAnimation(player){
    let framesNum = 40

    players[player].skullPlaceholder.innerHTML = ''
    let spinImages = []

    for (let i = 1; i <= framesNum; i++){
        
        const frame = document.createElement('img');
        frame.setAttribute('src', `skull-horizontal-spin/${i}.PNG`)
        spinImages.push(frame)
        players[player].skullPlaceholder.appendChild(frame)
    }

    let frameCount = 0
    players[player].timerId = setInterval(()=>{
        spinImages[frameCount].style.display = 'none'
        
        if(frameCount == framesNum-1){
            frameCount = 0
        }

        frameCount++

        spinImages[frameCount].style.display = 'block'
    },20)
}

// controls what happens when the game ends
function checkWin(){
    if(players[0].cardsNum == 0 || players[1].cardsNum == 0){
        advanceBtn.removeEventListener('click', normalAdvance)
        advanceBtn.removeEventListener('click', warAdvance)
        
        let lost
        let won
        if(players[0].cardsNum == 0){
            lost = 0
            won = 1
        }else{
            lost = 1
            won = 0
        }
        players.forEach(player => clearInterval(player.timerId))

        explode(lost)
        wonAnimation(won)

        setTimeout(() => showEndScreen(won),1500)

        return true
    }
    return false
}

// shows end screen and plays it's animations
function showEndScreen(player){
    let skullNoddingImgs1 = []
    let skullNoddingImgs2 = []
    for (i = 1; i <= 15; i++){
        const skull1 = document.createElement('img')
        skull1.setAttribute('src', `skull-nodding/${i}.png`)
        skullNoddingImgs1.push(skull1)
        noddingHeadContainer1.appendChild(skull1)

        const skull2 = document.createElement('img')
        skull2.setAttribute('src', `skull-nodding/${i}.png`)
        skullNoddingImgs2.push(skull2)
        noddingHeadContainer2.appendChild(skull2)
    }

    let frame = 1
    let wait = 20
    let direction = true

    let nodding = setInterval(() => {
        skullNoddingImgs1[frame].style.display = 'none'
        skullNoddingImgs2[frame].style.display = 'none'

        if(frame == 0){
            direction = true
        }else if(frame == 14){
            direction = false
        }

        if((frame == 14 || frame == 0) && wait != 0){
            wait--
        }else{
            if(direction){
                frame++
            }else{
                frame--
            }
            wait = 20
        }
        
        skullNoddingImgs1[frame].style.display = 'block'
        skullNoddingImgs2[frame].style.display = 'block'
          
    },10)

    winnerName.innerHTML = `${players[player].name}</br>WON!!!`
    warsWagedDisplay.textContent = `Wars waged: ${warsWagedCounter}`
    totalCardsTurnedDisplay.textContent = `Cards turned: ${cardsTurnedCounter}`
    
    timeElapsed = ''

    let days = 0
    let hours = 0
    let minutes = 0
    let seconds = 0
    if (secondsElapsedCounter > 3600 * 24){
        days = Math.floor(secondsElapsedCounter / (3600 * 24))
        if(days > 1){
            timeElapsed += `${days} days `
        }else{
            timeElapsed += `${days} day `
        }
        
    }
    if (secondsElapsedCounter > 3600){
        hours = Math.floor((secondsElapsedCounter % (3600 * 24)) / 3600)
        if(hours > 1){
            timeElapsed += `${hours} hours `
        }else{
            timeElapsed += `${hours} hour `
        }
        
    }
    if(secondsElapsedCounter > 60){
        minutes = Math.floor((secondsElapsedCounter % 3600) / 60)
        if(minutes != 1){
            timeElapsed += `${minutes} minutes `
        }else{
            timeElapsed += `${minutes} minute `
        }
    }
    seconds = secondsElapsedCounter % 60
        if(seconds != 1){
            timeElapsed += `${seconds} seconds `
        }else{
            timeElapsed += `${seconds} second `
        }
    timeElapsedDisplay.textContent = timeElapsed

    endScreen.style.display = 'flex'
}

// called when auto mode is turned on
function autoOn() {
    autoBtn.removeEventListener('click', autoOn)
    autoBtn.classList.add('auto-on')
    advanceBtn.click()

    mode = 'auto'
    updateGameInfo()
    autoBtn.addEventListener('click', autoOff)
}

// called when auto mode is turned off
function autoOff(){
    autoBtn.removeEventListener('click', autoOff)
    autoBtn.classList.remove('auto-on')

    mode = 'manual'
    updateGameInfo()
    autoBtn.addEventListener('click', autoOn)
}

// called when 'play again' or 'leave game' button is clicked
function reset(){
    autoOff()

    homeScreen.style.left = '0'
    gameScreen.style.left = '100vw'
    endScreen.style.left = '100vw'

    noddingHeadContainer1.innerHTML = ''
    noddingHeadContainer2.innerHTML = ''
    endScreen.style.display = 'none'

    leaveGameBtn.removeEventListener('click', reset)
}

// gives glow effect to player on round win
function winFilter(player){
    let images = [...document.querySelectorAll(`#player${player + 1}-skull img`)]

    let frameLength = 55

    for (let one of images){
        one.classList.add('win-filter1')
    }

    setTimeout(() => {
        for (let one of images){
            one.classList.add('win-filter2')
        }
    },frameLength)

    setTimeout(() => {
        for (let one of images){
            one.classList.add('win-filter3')
        }
    },frameLength * 2)

    setTimeout(() => {
        for (let one of images){
            one.classList.remove('win-filter3')
        }
    },frameLength * 3)

    setTimeout(() => {
        for (let one of images){
            one.classList.remove('win-filter2')
        }
    },frameLength * 4)

    setTimeout(() => {
        for (let one of images){
            one.classList.remove('win-filter1')
        }
    },frameLength * 5)
}