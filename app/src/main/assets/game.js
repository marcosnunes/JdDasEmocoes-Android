// web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDfrqME4RYWwXyR-GbtAOl6TPvGjZvC4V8",
    authDomain: "jardim-das-emocoes.firebaseapp.com",
    databaseURL: "https://jardim-das-emocoes-default-rtdb.firebaseio.com",
    projectId: "jardim-das-emocoes",
    storageBucket: "jardim-das-emocoes.firebasestorage.app",
    messagingSenderId: "18349891056",
    appId: "1:18349891056:web:659fcf4bc363d4fadd1135",
    measurementId: "G-CKWYYHY9X4"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.database();

class GameManager {
    constructor() {
        this.currentTool = null;
        this.lastMood = null;
        this.conselheiroMessages = {
            "Feliz": [
                "A alegria é como uma flor que você pode cultivar. Espalhe sementes de felicidade por onde for.",
                "Encontre a alegria nas pequenas coisas. Ela está sempre esperando para florescer dentro de você.",
                "Seu jardim está florescendo com luz e alegria. Continue cultivando essa beleza interior.",
                "A felicidade é o melhor adubo para o seu jardim. O que te fez sorrir hoje?",
                "Quando você se sente feliz, seu jardim inteiro brilha. Compartilhe sua luz.",
                "Cada momento de alegria é uma semente que você planta para um futuro mais radiante.",
                "Sua alegria é o sol que nutre o crescimento de todo o seu jardim.",
                "Cultivar a felicidade não é uma tarefa, é uma recompensa. Aproveite este momento.",
                "Lembre-se de todas as pequenas vitórias que te levaram a este estado de paz e felicidade.",
                "Um jardim florido é o reflexo de um coração feliz. Parabéns por cuidar bem de si mesmo."
            ],
            "Triste": [
                "É normal se sentir triste às vezes. Permita-se sentir e saiba que, como a chuva para as flores, a tristeza nutre a sua força.",
                "Lembre-se que depois da tempestade, o sol sempre volta a brilhar. Respeite seu tempo e se cuide.",
                "A tristeza pode ser um rio de reflexão. Deixe-o fluir para que novas sementes possam brotar.",
                "O inverno emocional faz parte do ciclo da vida. Permita-se murchar um pouco para florescer com mais força depois.",
                "Não tenha medo da escuridão. Às vezes, as raízes mais profundas crescem em tempos de silêncio e introspecção.",
                "Cuide da sua dor como se fosse uma planta delicada. Regue-a com gentileza e dê tempo para ela se curar.",
                "A tristeza é um sinal de que algo precisa de sua atenção. O que seu coração está tentando te dizer?",
                "Pequenas sementes de esperança podem ser plantadas mesmo em solo triste. O que você pode fazer por si mesmo hoje?",
                "Seja gentil consigo mesmo. Ninguém espera que você floresça o tempo todo.",
                "A dor de hoje pode se transformar na força de amanhã. Dê a si mesmo o espaço para respirar."
            ],
            "Estressado": [
                "O estresse pode ser um espinho, mas você é mais forte do que ele. Respire fundo e plante um momento de paz.",
                "Como a água para uma planta, a calma é o que você precisa para crescer e florescer. Encontre um tempo para relaxar.",
                "Pequenos momentos de paz são os melhores fertilizantes para um dia agitado. Permita-se ter um.",
                "Ervas daninhas crescem rápido. Seus pensamentos ansiosos também. Podá-los com a respiração profunda é o primeiro passo.",
                "A pressa é a inimiga da jardinagem. Desacelere e foque em uma coisa de cada vez. A colheita será mais gratificante.",
                "Não se sinta sobrecarregado pelas ervas daninhas. Apenas comece a podar uma por uma.",
                "O vento forte do estresse pode balançar suas plantas. Segure-se firme, você é a raiz mais forte do seu jardim.",
                "Lembre-se de que a perfeição não é um requisito para florescer. Relaxe um pouco e as coisas se ajustarão.",
                "Seu jardim precisa de tranquilidade para florescer. Encontre um momento só seu para restaurar a paz interior.",
                "O estresse é apenas um visitante. Não o deixe se instalar. Respire fundo e convide a calma para ficar."
            ],
            "Cansado": [
                "O cansaço é um sinal de que você se dedicou. Descanse, recarregue as energias e volte a florescer amanhã.",
                "Dê a si mesmo a chance de descansar. Você é um jardim que precisa de cuidado e tranquilidade para continuar a crescer.",
                "A pausa não é fraqueza, mas sim o solo fértil de onde a resiliência irá brotar.",
                "As plantas precisam de descanso para crescer. Seu corpo e sua mente também. Não se culpe por precisar de uma pausa.",
                "Se sentir exausto, é porque você se esforçou. Celebre seu esforço e permita-se um descanso merecido.",
                "Um jardim florido não pode existir sem a terra que o nutre. Volte à sua base, descanse e se nutra.",
                "O cansaço é um lembrete de que você é humano. Seja gentil consigo e priorize sua paz.",
                "Dormir é como regar o seu jardim interior. Quanto mais você descansa, mais suas emoções podem florescer.",
                "Um momento de silêncio e um bom descanso podem fazer maravilhas. Dê esse presente a si mesmo.",
                "Seja a terra que permite que as sementes descansem e se preparem para brotar."
            ]
        };
        this.counselorBackgrounds = [];
        for (let i = 1; i <= 15; i++) {
            this.counselorBackgrounds.push(`arquivos/Conselheiro${i}.jpg`);
        }
        this.bgMusic = document.getElementById('bgMusic');
        this.plantSound = document.getElementById('plantSound');
        this.buttonSound = document.getElementById('buttonSound');
        this.userId = null;

        this.plants = [
            { id: 'plant1', name: 'Planta1', src: 'arquivos/Planta1.png', drySrc: 'arquivos/PlantasSecas/Planta1.png', style: 'top: 70%; left: 4%; width: 15vw; height: 15vw;', isDry: false },
            { id: 'plant2', name: 'Planta2', src: 'arquivos/Planta2.png', drySrc: 'arquivos/PlantasSecas/Planta2.png', style: 'top: 63%; left: 64%; width: 18vw; height: 18vw;', isDry: false },
            { id: 'plant3', name: 'Planta3', src: 'arquivos/Planta3.png', drySrc: 'arquivos/PlantasSecas/Planta3.png', style: 'top: 56%; left: 25%; width: 13vw; height: 13vw;', isDry: false },
            { id: 'plant4', name: 'Planta4', src: 'arquivos/Planta4.png', drySrc: 'arquivos/PlantasSecas/Planta4.png', style: 'top: 58%; left: 10%; width: 13vw; height: 13vw;', isDry: false },
            { id: 'plant5', name: 'Planta5', src: 'arquivos/Planta5.png', drySrc: 'arquivos/PlantasSecas/Planta5.png', style: 'top: 73%; left: 35%; width: 15vw; height: 15vw;', isDry: false },
            { id: 'plant6', name: 'Planta6', src: 'arquivos/Planta6.png', drySrc: 'arquivos/PlantasSecas/Planta6.png', style: 'top: 63%; left: 3%; width: 15vw; height: 15vw;', isDry: false },
            { id: 'plant7', name: 'Planta7', src: 'arquivos/Planta7.png', drySrc: 'arquivos/PlantasSecas/Planta7.png', style: 'top: 53%; left: 70%; width: 23vw; height: 23vw;', isDry: false },
            { id: 'plant8', name: 'Planta8', src: 'arquivos/Planta8.png', drySrc: 'arquivos/PlantasSecas/Planta8.png', style: 'top: 66%; left: 83%; width: 15vw; height: 15vw;', isDry: false },
            { id: 'plant9', name: 'Planta9', src: 'arquivos/Planta9.png', drySrc: 'arquivos/PlantasSecas/Planta9.png', style: 'top: 68%; left: 23%; width: 10vw; height: 10vw;', isDry: false },
            { id: 'plant10', name: 'Planta10', src: 'arquivos/Planta10.png', drySrc: 'arquivos/PlantasSecas/Planta10.png', style: 'top: 69%; left: 48%; width: 10vw; height: 10vw;', isDry: false },
            { id: 'plant11', name: 'Planta11', src: 'arquivos/Planta11.png', drySrc: 'arquivos/PlantasSecas/Planta11.png', style: 'top: 74%; left: 70%; width: 10vw; height: 10vw;', isDry: false }
        ];
    }

    signInAnonymously(callback) {
        auth.signInAnonymously()
            .then(() => {
                const user = auth.currentUser;
                if (user) {
                    console.log("Login anônimo bem-sucedido. UID:", user.uid);
                    this.userId = user.uid;
                    if (callback) callback(this.userId);
                }
            })
            .catch((error) => {
                console.error("Erro no login anônimo:", error);
                if (callback) callback(null);
            });
    }

    getUserIdFromUrl() {
        if (this.userId) return;
        const urlParams = new URLSearchParams(window.location.search);
        const uidFromUrl = urlParams.get('uid');
        if (uidFromUrl) {
            this.userId = uidFromUrl;
            console.log("User ID recebido da URL:", this.userId);
            this.initializePlantPersistence();
        } else {
            console.warn("UID não encontrado na URL. A tela de splash deve lidar com isso.");
        }
    }

    initializePlantPersistence() {
        if (this.userId) {
            this.loadPlantStates();
        }
    }

    loadPlantStates() {
        const savedStates = localStorage.getItem('plantStates_' + this.userId);
        if (savedStates) {
            const data = JSON.parse(savedStates);
            this.plants.forEach(plant => {
                if (data[plant.id]) {
                    plant.isDry = data[plant.id].isDry || false;
                }
            });
        }
        if (document.getElementById('mainScreen')) {
            this.renderPlants('mainScreen');
        }
    }

    savePlantStates() {
        if (!this.userId) return;
        const statesToSave = {};
        this.plants.forEach(plant => {
            statesToSave[plant.id] = { isDry: plant.isDry };
        });
        localStorage.setItem('plantStates_' + this.userId, JSON.stringify(statesToSave));
    }

    renderPlants(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const existingPlants = container.querySelectorAll('.plant');
        existingPlants.forEach(plantEl => plantEl.remove());

        this.plants.forEach(plant => {
            const img = document.createElement('img');
            img.id = plant.id;
            img.src = plant.isDry ? plant.drySrc : plant.src;
            img.className = 'plant';
            img.style.cssText = plant.style;
            container.appendChild(img);
        });
    }

    checkAndDryPlants() {
        if (!this.userId) return;
        let changed = false;
        const dryPlantsCount = this.plants.filter(p => p.isDry).length;
        if (dryPlantsCount < 3) {
            const healthyPlants = this.plants.filter(p => !p.isDry);
            if (healthyPlants.length > 0) {
                const randomIndex = Math.floor(Math.random() * healthyPlants.length);
                const plantToDry = healthyPlants[randomIndex];
                plantToDry.isDry = true;
                const plantElement = document.getElementById(plantToDry.id);
                if (plantElement) {
                    plantElement.src = plantToDry.drySrc;
                }
                changed = true;
            }
        }
        if (changed) {
            this.savePlantStates();
        }
    }

    loadDiary() {
        if (!this.userId) return;
        const diaryRef = db.ref('diaries/' + this.userId);
        const diaryTextarea = document.getElementById('diaryTextarea');

        diaryRef.once('value', (snapshot) => {
            if (diaryTextarea) {
                const data = snapshot.val();
                diaryTextarea.value = (data && data.entry) ? data.entry : "";
                diaryTextarea.placeholder = "Escreva sobre suas emoções hoje...";
                diaryTextarea.disabled = false;
            }
        }).catch(error => {
            console.error("Erro ao carregar diário:", error);
            if (diaryTextarea) {
                diaryTextarea.placeholder = "Erro ao carregar. Clique para escrever.";
                diaryTextarea.disabled = false;
            }
        });
    }

    saveDiary() {
        if (!this.userId) return;
        const diaryTextarea = document.getElementById('diaryTextarea');
        const textToSave = diaryTextarea.value;
        const diaryRef = db.ref('diaries/' + this.userId);
        const feedbackEl = document.getElementById('diarySaveFeedback');

        diaryRef.set({
            entry: textToSave,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            if (feedbackEl) {
                feedbackEl.textContent = "Diário salvo!";
                feedbackEl.style.backgroundColor = '#22c55e';
                feedbackEl.classList.add('show');
                setTimeout(() => feedbackEl.classList.remove('show'), 2000);
            }
        }).catch((error) => {
            console.error("Erro ao salvar o diário:", error);
            if (feedbackEl) {
                feedbackEl.textContent = "Erro ao salvar!";
                feedbackEl.style.backgroundColor = '#ef4444';
                feedbackEl.classList.add('show');
                setTimeout(() => feedbackEl.classList.remove('show'), 2000);
            }
        });
    }

    navigate(screenId) {
        if (!this.userId) {
            window.location.href = 'splashScreen.html';
            return;
        }
        window.location.href = `${screenId}.html?uid=${this.userId}`;
    }

    startAndNavigate() {
        this.navigate('mainScreen');
    }

    selectTool(tool) {
        if (!this.userId) return;
        window.location.href = `mainScreen.html?uid=${this.userId}&tool=${tool}`;
    }

    interactWithPlant(event) {
        const plantElement = event.target;
        const plantId = plantElement.id;
        const plantData = this.plants.find(p => p.id === plantId);
        const feedbackEl = document.getElementById('plantFeedback');
        let message = '';
        let stateChanged = false;

        if (!this.currentTool) {
            message = "Selecione uma ferramenta primeiro!";
        } else if (plantData) {
            if (plantData.isDry) {
                if (['water', 'prune', 'fertilize'].includes(this.currentTool)) {
                    plantElement.src = plantData.src;
                    plantData.isDry = false;
                    message = "A planta está saudável novamente!";
                    stateChanged = true;
                }
            } else {
                if (this.currentTool === 'water') {
                    message = "A planta já está regada!";
                } else if (this.currentTool === 'prune') {
                    message = "A planta foi podada!";
                } else if (this.currentTool === 'fertilize') {
                    message = "A planta foi adubada!";
                }
            }
            if (stateChanged) this.savePlantStates();
        } else {
            message = "Erro: Planta não encontrada!";
        }

        if (feedbackEl && message) {
            feedbackEl.textContent = message;
            feedbackEl.classList.add('fade-in');
            setTimeout(() => {
                feedbackEl.classList.remove('fade-in');
                feedbackEl.classList.add('fade-out');
                setTimeout(() => feedbackEl.classList.remove('fade-out'), 500);
            }, 1500);
        }

        if (this.plantSound && stateChanged) this.plantSound.play();
        this.currentTool = null;
    }

    setMood(mood) {
        if (!this.userId) return;
        this.lastMood = mood;
        window.location.href = `conselourScreen.html?uid=${this.userId}&mood=${mood}`;
    }

    openCounselorScreen() {
        if (!this.userId) return;
        this.navigate('conselourScreen');
    }
}

const game = new GameManager();

document.addEventListener('DOMContentLoaded', () => {
    game.getUserIdFromUrl();

    if (document.getElementById('mainScreen')) {
        setInterval(() => {
            game.checkAndDryPlants();
        }, 30000);
    }

    const audioOnBtn = document.getElementById('audioOnBtn');
    const audioOffBtn = document.getElementById('audioOffBtn');
    const bgMusic = document.getElementById('bgMusic');

    if (audioOnBtn && bgMusic) {
        audioOnBtn.addEventListener('click', () => {
            bgMusic.play().catch(e => console.error("Música falhou:", e));
        });
    }

    if (audioOffBtn && bgMusic) {
        audioOffBtn.addEventListener('click', () => {
            bgMusic.pause();
        });
    }
});