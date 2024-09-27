const { createApp } = Vue;

createApp({
    data() {
        return {
            hero: { life: 100, name: "BB-8", gif: "assets/giphy.gif" },
            villain: { life: 100, name: "R2-D", gif: "assets/r2-cropped.gif" },
            isHeroDefending: false,
            isVillainDefending: false,
            villainChose: "",
            gameOver: false,
            gameMessage: ""
        };
    },
    methods: {
        playSound(soundId) {
            const sound = document.getElementById(soundId);
            sound.currentTime = 0;
            sound.play();
        },
        attack(isHero) {
            if (isHero) {
                if (this.hero.name == "BB-8")
                    this.playSound('attackSound');
                else {
                    this.playSound('attackSoundR2');
                }
            }
            const attacker = isHero ? this.hero : this.villain;
            const defender = isHero ? this.villain : this.hero;

            let attackValue = Math.floor(Math.random() * 30);
            if ((isHero && this.isVillainDefending) || (!isHero && this.isHeroDefending)) {
                attackValue = Math.floor(attackValue / 2);
            }

            defender.life -= attackValue;
            if (defender.life <= 0) {
                defender.life = 0;
                this.endGame(attacker.name);
            }

            this.isHeroDefending = false;
            this.isVillainDefending = false;

            if (isHero) {
                this.villainAction();
            }
        },
        defend(isHero) {
            if (isHero) {
                if (this.hero.name == "BB-8")
                    this.playSound('defenseSound');
                else {
                    this.playSound('defenseSoundR2');
                }
            }

            if (isHero) {
                this.isHeroDefending = true;
            } else {
                this.isVillainDefending = true;
            }

            if (isHero) {
                this.villainAction();
            }
        },
        usePotion(isHero) {
            if (isHero) {
                if (this.hero.name == "BB-8")
                    this.playSound('potionSound');
                else {
                    this.playSound('potionSoundR2');
                }
            }

            const user = isHero ? this.hero : this.villain;

            if (user.life <= 0) return;
            user.life += 20;
            if (user.life > 100) user.life = 100;

            if (isHero) {
                this.villainAction();
            }
        },
        flee(isHero) {
            const fleeingCharacter = isHero ? this.hero : this.villain;
            fleeingCharacter.life = 0;
            if (isHero) {
                if (this.hero.name == "BB-8"){
                    this.playSound('fleeSound');
                }
                else {
                    this.playSound('fleeSoundR2');
                }
                this.gameOver = true;
                this.gameMessage = `${winner} venceu!`;
            }
        },
        villainAction() {
            const actions = ['attack', 'defend', 'usePotion'];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            if (randomAction == "attack") this.villainChose = "Atacou!";
            else if(randomAction == "defend")this.villainChose = "Defendeu!";
            else if(randomAction == "usePotion")this.villainChose = "Usou poção!";
            this[randomAction](false);
        },
        endGame(winner) {
            const soundToPlay = this.hero.name === "BB-8" ? 'fleeSoundR2' : 'fleeSound';
            setTimeout(() => {
                this.playSound(soundToPlay);
            }, 500);
            this.gameOver = true;
            this.gameMessage = `${winner} venceu!`;
        },
        lifeBarStyle(character) {
            let color = "green";
            if (character.life < 50) color = "yellow";
            if (character.life < 20) color = "red";
            return {
                width: character.life + '%',
                backgroundColor: color,
            };
        },
        changeCharacter() {
            const previousCharacter = this.hero;
            this.hero = this.villain;
            this.villain = previousCharacter;
        },
        resetGame() {
            this.hero.life = 100;
            this.villain.life = 100;
            this.gameOver = false;
            this.gameMessage = "";
            this.isHeroDefending = false;
            this.isVillainDefending = false;
        },
    }
}).mount("#app");
