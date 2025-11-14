let progress = 0;
let matchedPairs = 0;

function updateProgress(value) {
    if (value) {
        progress = value;
    } else {
        progress += 14;
    }
    document.getElementById('progressBar').style.width = Math.min(progress, 100) + '%';
}

function createParticleBurst(element, count = 12) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const particles = ['❤️', '💕', '💖', '💗', '💝', '✨', '⭐', '🌟'];
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-burst';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const angle = (i / count) * Math.PI * 2;
        const distance = Math.random() * 150 + 100;
        particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

document.getElementById('envelope').addEventListener('click', function() {
    this.classList.add('open');
    setTimeout(() => {
        document.getElementById('startScreen').classList.add('hidden');
        setTimeout(() => {
            const container = document.getElementById('storyContainer');
            container.classList.add('visible');
            document.getElementById('section1').classList.add('visible');
            updateProgress();
        }, 500);
    }, 1500);
});

document.getElementById('btn1').addEventListener('click', function() {
    createParticleBurst(this);
    const section = document.getElementById('section2');
    section.style.display = 'block';
    setTimeout(() => {
        section.classList.add('visible');
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    updateProgress();
});

document.getElementById('photo1').addEventListener('click', function() {
    if (!this.classList.contains('unlocked')) {
        this.classList.add('unlocked');
        createParticleBurst(this, 20);
        updateProgress();
    }
});

document.getElementById('btn2').addEventListener('click', function() {
    createParticleBurst(this);
    
    // Oculta la Section 2
    document.getElementById('section2').style.display = 'none';
    
    // Muestra la Section 5 directamente
    const section = document.getElementById('section5');
    section.style.display = 'block';
    
    setTimeout(() => {
        section.classList.add('visible');
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    updateProgress();
});

const choiceMessages = {
    1: '[Respuesta a opción 1: "Sabía que dirías eso..."]',
    2: '[Respuesta a opción 2: "Me encanta que valores eso..."]',
    3: '[Respuesta a opción 3: "Yo también amo todo de ti..."]'
};

['choice1', 'choice2', 'choice3'].forEach((id, index) => {
    // Solo 'choice1' existe en el HTML que me diste, pero mantengo el bucle si planeas añadir más.
    const choiceElement = document.getElementById(id);
    if (choiceElement) { // Verificamos que el elemento exista
        choiceElement.addEventListener('click', function() {
            createParticleBurst(this, 15);
            const result = document.getElementById('choiceResult');
            const section3 = document.getElementById('section3');
            const section5 = document.getElementById('section5');
            const choiceContainer = document.querySelector('.choice-container');

            // 1. Mostrar la respuesta temporal
            result.innerHTML = `
                <p style="font-size: 1.3em; line-height: 1.8;">${choiceMessages[index + 1].replace(/\[|\]/g, '')}</p>
                <p style="margin-top: 15px;">¡Excelente respuesta! Vamos a la sorpresa que sigue.</p>
            `;
            result.classList.add('visible');

            // 2. Ocultar las opciones de elección
            choiceContainer.style.display = 'none';

            // 3. Crear el nuevo botón para avanzar a Section 5
            let continueBtn5 = document.getElementById('continueBtn5_from_choice');
            if (!continueBtn5) {
                continueBtn5 = document.createElement('button');
                continueBtn5.id = 'continueBtn5_from_choice';
                continueBtn5.className = 'interactive-btn';
                // El texto del botón es similar al btn2, pero con una indicación clara.
                continueBtn5.innerHTML = '<span>💕 Seguir descubriendo...</span>';
                result.appendChild(continueBtn5);
            } else {
                continueBtn5.style.display = 'inline-block';
            }
            
            // 4. Lógica del nuevo botón (avanzar a Section 5)
            continueBtn5.addEventListener('click', function() {
                createParticleBurst(this);
                // Ocultar Section 3 y mostrar Section 5
                section3.style.display = 'none';
                section5.style.display = 'block';
                
                setTimeout(() => {
                    section5.classList.add('visible');
                    section5.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 10);
                updateProgress();
            }, { once: true });
            
            // Ocultar el botón de la sección 4 por si se mostró previamente
            document.getElementById('continueBtn4').style.display = 'none';
        }, { once: true }); // Para que solo se pueda hacer clic una vez en la opción
    }
});

// Nota: El código de 'initMemoryGame' y 'continueBtn4' se mantiene 
// pero ya no se activará desde Section 3.

function initMemoryGame() {
    const emojis = ['❤️', '💕', '💖', '💗', '🌹', '⭐'];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    const gameContainer = document.getElementById('memoryGame');
    gameContainer.innerHTML = '';
    
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    
    cards.forEach(emoji => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `
            <div class="card-front">❓</div>
            <div class="card-back">${emoji}</div>
        `;
        
        card.addEventListener('click', () => {
            if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;
            
            card.classList.add('flipped');
            
            if (!firstCard) {
                firstCard = card;
                return;
            }
            
            secondCard = card;
            lockBoard = true;
            
            const match = firstCard.querySelector('.card-back').textContent === 
                          secondCard.querySelector('.card-back').textContent;
            
            if (match) {
                firstCard.classList.add('matched');
                secondCard.classList.add('matched');
                matchedPairs++;
                
                createParticleBurst(card, 10);
                
                if (matchedPairs === emojis.length) {
                    setTimeout(() => {
                        document.getElementById('continueBtn4').style.display = 'inline-block';
                        createParticleBurst(gameContainer, 30);
                    }, 500);
                }
                
                firstCard = null;
                secondCard = null;
                lockBoard = false;
            } else {
                setTimeout(() => {
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                    firstCard = null;
                    secondCard = null;
                    lockBoard = false;
                }, 1000);
            }
        });
        
        gameContainer.appendChild(card);
    });
}

document.getElementById('continueBtn4').addEventListener('click', function() {
    createParticleBurst(this);
    const section = document.getElementById('section5');
    section.style.display = 'block';
    setTimeout(() => {
        section.classList.add('visible');
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    updateProgress();
});

document.getElementById('revealBtn').addEventListener('click', function() {
    document.getElementById('hiddenText1').classList.add('revealed');
    this.style.display = 'none';
    createParticleBurst(this);
    updateProgress();
});

document.getElementById('photo2').addEventListener('click', function() {
    if (!this.classList.contains('unlocked')) {
        this.classList.add('unlocked');
        createParticleBurst(this, 20);
        updateProgress();
    }
});

document.getElementById('btn5').addEventListener('click', function() {
    createParticleBurst(this);
    const section = document.getElementById('section6');
    section.style.display = 'block';
    setTimeout(() => {
        section.classList.add('visible');
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    updateProgress();
});

document.getElementById('photo3').addEventListener('click', function() {
    if (!this.classList.contains('unlocked')) {
        this.classList.add('unlocked');
        createParticleBurst(this, 20);
        updateProgress();
    }
});

document.getElementById('finalBtn').addEventListener('click', function() {
    const finalMsg = document.getElementById('finalMessage');
    finalMsg.style.display = 'block';
    setTimeout(() => {
        finalMsg.classList.add('visible');
        finalMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        updateProgress(100);
    }, 100);
});

document.getElementById('explosionBtn').addEventListener('click', function() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createParticleBurst({ 
                getBoundingClientRect: () => ({ 
                    left: x, 
                    top: y, 
                    width: 0, 
                    height: 0 
                }) 
            }, 8);
        }, i * 50);
    }
});