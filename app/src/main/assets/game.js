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
                "Um jardim florido é o reflexo de um coração feliz. Parabéns por cuidar bem de si mesmo.",
                "A luz da sua felicidade ilumina o caminho de quem está perto.",
                "Floresça onde quer que a vida te plante, com um sorriso no rosto e paz no coração.",
                "Sua alma é um jardim secreto, repleto de flores de pura alegria e inspiração.",
                "Que a melodia da sua felicidade continue a embalar os seus dias com doçura.",
                "Sinta a brisa suave da alegria que abraça o seu espírito a cada amanhecer.",
                "A felicidade é um presente que você dá a si mesmo, colhendo o melhor da vida.",
                "Deixe sua alegria contagiar o mundo, como um sol que irradia em cada canto.",
                "A sua força interior é a nascente de toda a felicidade que você irradia.",
                "Regue sua alma com pensamentos positivos e veja a felicidade florescer sem parar.",
                "Desfrute da simplicidade, pois nela reside a mais pura e verdadeira felicidade.",
                "A gratidão é a chave que abre as portas para um jardim de felicidade sem fim.",
                "Sinta a leveza da alegria preencher seu ser, tornando cada dia uma celebração.",
                "Permita que a felicidade seja o seu guia, mostrando o caminho para novas descobertas.",
                "Celebre cada instante, pois a vida é uma festa e você é o convidado de honra.",
                "A sua risada é a mais linda canção que ecoa em seu jardim de emoções.",
                "Encontre a beleza em cada detalhe, e a felicidade se revelará em sua plenitude.",
                "Deixe o seu coração dançar ao ritmo da alegria, livre e leve como uma borboleta.",
                "A felicidade é a arte de viver com leveza, colorindo o mundo com suas cores.",
                "Que a paz e a alegria sejam as sementes que você planta em cada novo dia.",
                "Sua jornada é um poema de felicidade, escrito com cada passo e cada sorriso."
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
                "A dor de hoje pode se transformar na força de amanhã. Dê a si mesmo o espaço para respirar.",
                "Permita-se sentir a melancolia, ela também faz parte do seu jardim de emoções.",
                "Como a noite escura precede o amanhecer, a tristeza precede a nova esperança.",
                "Não se apresse em afastar a tristeza, às vezes ela traz mensagens importantes.",
                "Em meio à escuridão, pequenas luzes de esperança podem começar a brilhar.",
                "Suas lágrimas são como a chuva que rega a terra, preparando-a para novos brotos.",
                "Abrace sua vulnerabilidade, ela é uma parte essencial da sua jornada de crescimento.",
                "Mesmo no vazio, há espaço para a serenidade e para encontrar seu próprio ritmo.",
                "A tristeza não é o fim, mas um convite para olhar para dentro e se fortalecer.",
                "Assim como as estações, suas emoções mudam. A primavera virá novamente.",
                "Não carregue a dor sozinho. Compartilhar pode aliviar o peso e trazer conforto.",
                "Encontre refúgio na calma. A tristeza pode ser um momento de paz e introspecção.",
                "As sombras podem ser grandes mestras, ensinando sobre a luz que você carrega.",
                "Não ignore o que seu coração sussurra. Ele sabe o caminho para a cura e o renascimento.",
                "A dor não define quem você é, mas a forma como você a supera, sim.",
                "Pequenos gestos de autocuidado são como raios de sol em um dia cinzento.",
                "Mesmo com o coração pesado, você ainda tem a força para seguir em frente.",
                "A quietude da tristeza pode ser um portal para um profundo autoconhecimento.",
                "Dê a si mesmo o presente do tempo. A cura é um processo, não um evento.",
                "Sua resiliência é como uma árvore forte, que permanece de pé mesmo nas tempestades.",
                "Lembre-se que a vida tem ciclos, e a beleza está em aceitar cada um deles."
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
                "O estresse é apenas um visitante. Não o deixe se instalar. Respire fundo e convide a calma para ficar.",
                "Desconecte-se do barulho exterior e reconecte-se com a sua essência.",
                "Respire profundamente. Deixe o ar renovar sua mente e acalmar seu corpo.",
                "O excesso de pensamentos é como nuvens escuras. Deixe-os passar e o sol aparecerá.",
                "Priorize o que realmente importa e liberte-se do peso desnecessário.",
                "Encontre seu oásis de tranquilidade, mesmo que seja por poucos minutos.",
                "Não se exija demais. A perfeição é um ideal, não uma obrigação.",
                "O estresse é um sinal para desacelerar. Ouça seu corpo e sua mente.",
                "Pequenas pausas ao longo do dia são como regar sua alma. Não as negligencie.",
                "Imagine-se em um lugar de paz. Deixe essa imagem acalmar seus sentidos.",
                "Livre-se da necessidade de controlar tudo. Algumas coisas estão fora do seu alcance.",
                "Concentre-se no presente. O futuro ainda não chegou e o passado já se foi.",
                "Sua mente merece um jardim de paz, livre de preocupações e ansiedades.",
                "Aprenda a dizer 'não' quando for necessário. Seu bem-estar é prioridade.",
                "Deixe a natureza te abraçar. Um passeio pode renovar suas energias.",
                "A cada expiração, libere uma preocupação. A cada inspiração, receba calma.",
                "Não se afogue em um copo d'água. Encontre a perspectiva e respire fundo.",
                "Sua energia é preciosa. Use-a com sabedoria, sem desperdícios.",
                "O estresse é um sinal de alerta, não uma sentença. Reaja com autocuidado.",
                "Crie um santuário de paz em sua mente, onde você pode se refugiar.",
                "Lembre-se que você é capaz de superar qualquer desafio, com calma e foco."
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
                "Seja a terra que permite que as sementes descansem e se preparem para brotar.",
                "Sua energia é um recurso finito. Recarregue-a com carinho e sem culpa.",
                "Permita-se um sono reparador. Ele é o elixir para sua mente e corpo.",
                "O corpo fala quando está exausto. Ouça-o com atenção e dê o que ele precisa.",
                "Não se sinta na obrigação de estar sempre ativo. O repouso é produtivo.",
                "Como um rio que precisa de calmaria, sua alma anseia por momentos de paz.",
                "Desacelere. A vida não é uma corrida, mas uma jornada para ser apreciada.",
                "Seu bem-estar é o alicerce para tudo o mais. Cuide dele em primeiro lugar.",
                "Um bom livro ou uma melodia suave podem ser um abraço para sua alma cansada.",
                "O cansaço é um convite para o autocuidado. Não ignore esse chamado.",
                "Não se sinta culpado por tirar um tempo para si. Você merece esse carinho.",
                "A quietude do descanso é a fonte onde sua força interior se renova.",
                "Priorize o que nutre sua alma e descarte o que drena sua energia.",
                "Sua capacidade de florescer depende da sua capacidade de descansar.",
                "Dê um tempo para o corpo e a mente. Ambos precisam de pausas para prosperar.",
                "Não force a barra. A vida é um ritmo, e o descanso é parte da melodia.",
                "A exaustão é um sinal claro: pare, respire e permita-se recomeçar.",
                "Como a terra que repousa no inverno, você também precisa de seu tempo.",
                "Um banho quente, uma xícara de chá. Pequenos luxos para um corpo cansado.",
                "Sua paz interior é o maior presente que você pode dar a si mesmo.",
                "Relaxe. O mundo pode esperar um pouco enquanto você se reconecta com sua força."
            ]
        };
        this.counselorBackgrounds = [];
        for (let i = 1; i <= 15; i++) {
            this.counselorBackgrounds.push(`arquivos/Conselheiro${i}.jpg`);
        }
        this.bgMusic = null;
        this.plantSound = null;
        this.buttonSound = null;
        this.userId = null;

        this.plants = [
            { id: 'plant1', name: 'Planta1', src: 'arquivos/Planta1.png', drySrc: 'arquivos/PlantasSecas/Planta1.png', style: 'top: 70%; left: 4%; width: 15vw; height: 15vw;', isDry: false, lastInteraction: Date.now() },
            { id: 'plant2', name: 'Planta2', src: 'arquivos/Planta2.png', drySrc: 'arquivos/PlantasSecas/Planta2.png', style: 'top: 63%; left: 64%; width: 18vw; height: 18vw;', isDry: false, lastInteraction: Date.now() },
            { id: 'plant3', name: 'Planta3', src: 'arquivos/Planta3.png', drySrc: 'arquivos/PlantasSecas/Planta3.png', style: 'top: 56%; left: 25%; width: 13vw; height: 13vw;', isDry: false, lastInteraction: Date.now() },
            { id: 'plant4', name: 'Planta4', src: 'arquivos/Planta4.png', drySrc: 'arquivos/PlantasSecas/Planta4.png', style: 'top: 58%; left: 10%; width: 13vw; height: 13vw;', isDry: false, lastInteraction: Date.now() },
            { id: 'plant5', name: 'Planta5', src: 'arquivos/Planta5.png', drySrc: 'arquivos/PlantasSecas/Planta5.png', style: 'top: 73%; left: 35%; width: 15vw; height: 15vw;', isDry: false, lastInteraction: Date.now() },
            { id: 'plant6', name: 'Planta6', src: 'arquivos/Planta6.png', drySrc: 'arquivos/PlantasSecas/Planta6.png', style: 'top: 63%; left: 3%; width: 15vw; height: 15vw;', isDry: false, lastInteraction: Date.now() },
            { id: 'plant7', name: 'Planta7', src: 'arquivos/Planta7.png', drySrc: 'arquivos/PlantasSecas/Planta7.png', style: 'top: 53%; left: 70%; width: 23vw; height: 23vw;', isDry: false, lastInteraction: Date.now() },
            { id: 'plant8', name: 'Planta8', src: 'arquivos/Planta8.png', drySrc: 'arquivos/PlantasSecas/Planta8.png', style: 'top: 66%; left: 83%; width: 15vw; height: 15vw;', isDry: false, lastInteraction: Date.now() },
            { id: 'plant9', name: 'Planta9', src: 'arquivos/Planta9.png', drySrc: 'arquivos/PlantasSecas/Planta9.png', style: 'top: 68%; left: 23%; width: 10vw; height: 10vw;', isDry: false, lastInteraction: Date.now() },
            { id: 'plant10', name: 'Planta10', src: 'arquivos/Planta10.png', drySrc: 'arquivos/PlantasSecas/Planta10.png', style: 'top: 69%; left: 48%; width: 10vw; height: 10vw;', isDry: false, lastInteraction: Date.now() },
            { id: 'plant11', name: 'Planta11', src: 'arquivos/Planta11.png', drySrc: 'arquivos/PlantasSecas/Planta11.png', style: 'top: 74%; left: 70%; width: 10vw; height: 10vw;', isDry: false, lastInteraction: Date.now() }
        ];
        this.currentPage = '';
        this.navigationHistory = [];
        this.isFirstLoad = true;
        this.happinessLevel = 0.5;
        this.happinessDecayInterval = null;
    }

    playMusic() {
        if (!this.bgMusic) return;

        localStorage.setItem('bgMusicState', 'playing');
        const playPromise = this.bgMusic.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Autoplay bloqueado. A música começará na primeira interação do usuário.", error);
                const playOnFirstInteraction = () => {
                    if (localStorage.getItem('bgMusicState') === 'playing') {
                        this.bgMusic.play().catch(err => {
                            console.error("Não foi possível tocar a música mesmo após interação.", err);
                        });
                    }
                };
                document.body.addEventListener('click', playOnFirstInteraction, { once: true });
                document.body.addEventListener('touchstart', playOnFirstInteraction, { once: true });
            });
        }
    }

    openPsychologistLink() {
        console.log("Abrindo link da psicóloga via Interface...");
        const url = 'https://psicologathaynamacedolunz.com.br/blog-psicologia-analitica/';
        window.open(url, '_blank');
    }


    openONGLink() {
        console.log("Abrindo link da ONG via Interface...");
        const url = 'https://docs.google.com/forms/d/e/1FAIpQLSciGRVrjJ0k6LljShTtOsjRC9fwb8ngxVQA2opYG0sG_JbNnA/viewform';
        window.open(url, '_blank');
    }

    pauseMusic() {
        if (!this.bgMusic) return;
        localStorage.setItem('bgMusicState', 'paused');
        this.bgMusic.pause();
    }

    executePageScripts(pageUrl) {
        const params = new URLSearchParams(pageUrl.split('?')[1]);
        const cleanPageUrl = pageUrl.split('?')[0];

        const backgrounds = {
            'splashScreen.html': "url('arquivos/splashScreen.png')",
            'mainScreen.html': "url('arquivos/background.png')",
            'diaryScreen.html': "url('arquivos/telaDiario.png')",
            'toolScreen.html': "url('arquivos/telaFerramentas.png')",
            'presentationScreen.html': "url('arquivos/telaApresentacao.png')",
            'psicologiaLinks.html': 'none',
            'privacidade.html': 'none',
            'conselourScreen.html': 'dynamic'
        };

        const backgroundStyle = backgrounds[cleanPageUrl];

        if (backgroundStyle) {
            if (backgroundStyle === 'dynamic') {
                const randomIndex = Math.floor(Math.random() * this.counselorBackgrounds.length);
                const randomBackground = this.counselorBackgrounds[randomIndex];
                document.body.style.backgroundImage = `url('${randomBackground}')`;
            } else {
                document.body.style.backgroundImage = backgroundStyle;
            }
        }

        switch (cleanPageUrl) {
            case 'mainScreen.html':
                let musicState = localStorage.getItem('bgMusicState');
                if (musicState === null) {
                    localStorage.setItem('bgMusicState', 'playing');
                    musicState = 'playing';
                }
                if (musicState === 'playing') {
                    this.playMusic();
                }
                if (this.isFirstLoad) {
                    this.isFirstLoad = false;
                }
                this.currentTool = params.get('tool');
                this.renderPlants('mainScreen');
                if (!window.plantDryInterval) {
                    window.plantDryInterval = setInterval(() => this.checkAndDryPlants(), 30000);
                }
                document.getElementById('presentationBtn').addEventListener('click', () => this.navigate('presentationScreen'));
                document.getElementById('diaryCornerBtn').addEventListener('click', () => this.navigate('privacidade'));
                document.getElementById('toolButton').addEventListener('click', () => this.navigate('toolScreen'));
                document.getElementById('counselorButton').addEventListener('click', () => this.openCounselorScreen());
                document.getElementById('diaryButton').addEventListener('click', () => this.navigate('diaryScreen'));
                document.getElementById('mainScreen').addEventListener('click', (e) => {
                    if (e.target.classList.contains('plant')) {
                        this.interactWithPlant(e);
                    }
                });
                this.loadHappinessLevel();
                setTimeout(() => this.updateHappinessMeter(), 100);
                this.startHappinessDecay();
                break;

            case 'diaryScreen.html':
                this.stopHappinessDecay();
                this.loadDiary();
                document.getElementById('diaryTextarea').addEventListener('input', () => this.saveDiary());
                document.querySelectorAll('.mood-btn').forEach(button => {
                    button.addEventListener('click', (e) => this.setMood(e.currentTarget.dataset.mood));
                });
                break;

            case 'toolScreen.html':
                this.stopHappinessDecay();
                document.getElementById('waterToolBtn').addEventListener('click', (e) => this.selectTool(e.currentTarget.dataset.tool));
                document.getElementById('pruneToolBtn').addEventListener('click', (e) => this.selectTool(e.currentTarget.dataset.tool));
                document.getElementById('fertilizeToolBtn').addEventListener('click', (e) => this.selectTool(e.currentTarget.dataset.tool));
                break;

            case 'conselourScreen.html':
                this.stopHappinessDecay();
                const mood = params.get('mood');
                let message = "Olá, como você se sente hoje?";
                if (mood && this.conselheiroMessages[mood]) {
                    const messages = this.conselheiroMessages[mood];
                    message = messages[Math.floor(Math.random() * messages.length)];
                } else {
                    const allMessages = Object.values(this.conselheiroMessages).flat();
                    message = allMessages[Math.floor(Math.random() * allMessages.length)];
                }
                document.getElementById('counselorMessage').textContent = message;
                break;

            case 'presentationScreen.html':
                this.stopHappinessDecay();
                document.getElementById('psychologistBtn').addEventListener('click', () => this.openPsychologistNavigate());
                break;

            case 'psicologiaLinks.html':
                this.stopHappinessDecay();
                document.getElementById('psychologistPageBtn1').addEventListener('click', () => this.openPsychologistLink());
                document.getElementById('psychologistPageBtn2').addEventListener('click', () => this.openONGLink());
                break;

            case 'privacidade.html':
                this.stopHappinessDecay();
                document.getElementById('backToGameBtn').addEventListener('click', (e) => {e.preventDefault();this.navigate('mainScreen');});
                break;
        }
    }

    async loadPage(pageUrl) {
        if (!this.userId && pageUrl !== 'splashScreen.html') {
            console.error("User ID não encontrado. Navegação abortada.");
            return;
        }

        try {
            const pageName = pageUrl.split('?')[0].split('.')[0];
            const fragmentUrl = `${pageName}.html`;

            const response = await fetch(fragmentUrl);
            if (!response.ok) {
                throw new Error(`Erro ao carregar o fragmento: ${response.statusText}`);
            }
            const pageContent = await response.text();
            const container = document.getElementById('app-container');
            container.innerHTML = pageContent;

            container.style.backgroundImage = '';

            const oldStylesheet = document.getElementById('page-stylesheet');
            if (oldStylesheet) {
                oldStylesheet.remove();
            }

            const newStylesheet = document.createElement('link');
            newStylesheet.id = 'page-stylesheet';
            newStylesheet.rel = 'stylesheet';
            newStylesheet.href = `styles/${pageName}.css`;
            document.head.appendChild(newStylesheet);

            this.currentPage = pageUrl;
            this.executePageScripts(pageUrl);

        } catch (error) {
            console.error('Falha ao carregar a página:', error);
        }
    }

    handleBackPress() {
        if (this.currentPage.includes('mainScreen.html')) {
            return false;
        }
        if (this.navigationHistory.length > 1) {
            return true;
        }
        this.navigate('mainScreen');
        return true;
    }

    initializeAudioControl() {
        this.bgMusic = document.getElementById('bgMusic');
        this.plantSound = document.getElementById('plantSound');
        this.buttonSound = document.getElementById('buttonSound');

        const audioOnBtn = document.getElementById('audioOnBtn');
        const audioOffBtn = document.getElementById('audioOffBtn');

        if (audioOnBtn) {
            audioOnBtn.addEventListener('click', () => this.playMusic());
        }

        if (audioOffBtn) {
            audioOffBtn.addEventListener('click', () => this.pauseMusic());
        }

        if (this.bgMusic) {
            const musicState = localStorage.getItem('bgMusicState');
            this.bgMusic.currentTime = parseFloat(localStorage.getItem('bgMusicTime')) || 0;

            if (musicState === 'playing') {
                this.playMusic();
            }
        }

        window.addEventListener('beforeunload', () => this.saveMusicState());
        setInterval(() => this.saveMusicState(), 500);
    }

    saveMusicState() {
        if (this.bgMusic) {
            localStorage.setItem('bgMusicTime', this.bgMusic.currentTime);
        }
    }

    playButtonSound() {
        if (this.buttonSound) {
            this.buttonSound.currentTime = 0;
            this.buttonSound.play().catch(e => console.error("Falha ao tocar som de botão:", e));
        }
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
                    // Adiciona lastInteraction ao carregar, se existir
                    plant.lastInteraction = data[plant.id].lastInteraction || Date.now();
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
            statesToSave[plant.id] = { isDry: plant.isDry, lastInteraction: plant.lastInteraction };
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
        const now = Date.now();
        const dryTimeThreshold = 30000;

        this.plants.forEach(plant => {
            if (!plant.isDry && (now - plant.lastInteraction > dryTimeThreshold)) {
                plant.isDry = true;
                const plantElement = document.getElementById(plant.id);
                if (plantElement) {
                    plantElement.src = plant.drySrc;
                }
                changed = true;
                this.happinessLevel = Math.max(0, this.happinessLevel - 0.05);
                this.updateHappinessMeter();
            }
        });

        const dryPlantsCount = this.plants.filter(p => p.isDry).length;
        if (dryPlantsCount < 3) {
            const healthyPlants = this.plants.filter(p => !p.isDry && (now - p.lastInteraction <= dryTimeThreshold)); // Considera apenas plantas que não secaram naturalmente ainda
            if (healthyPlants.length > 0) {
                const randomIndex = Math.floor(Math.random() * healthyPlants.length);
                const plantToDry = healthyPlants[randomIndex];
                plantToDry.isDry = true;
                const plantElement = document.getElementById(plantToDry.id);
                if (plantElement) {
                    plantElement.src = plantToDry.drySrc;
                }
                changed = true;
                this.happinessLevel = Math.max(0, this.happinessLevel - 0.05);
                this.updateHappinessMeter();
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
        const targetUrl = `${screenId}.html`;
        this.loadPage(targetUrl);
    }

    startAndNavigate() {
        this.navigate('mainScreen');
    }

    openPsychologistNavigate() {
        this.navigate('psicologiaLinks');
    }

    selectTool(tool) {
        if (!this.userId) return;
        this.loadPage(`mainScreen.html?tool=${tool}`);
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
            plantData.lastInteraction = Date.now();
            if (plantData.isDry) {
                if (['water', 'prune', 'fertilize'].includes(this.currentTool)) {
                    plantElement.src = plantData.src;
                    plantData.isDry = false;
                    message = "A planta está saudável novamente!";
                    stateChanged = true;
                    this.happinessLevel = Math.min(1, this.happinessLevel + 0.05);
                    this.updateHappinessMeter();
                    if (this.plantSound) this.plantSound.play().catch(e => console.error("Falha ao tocar som de interação:", e));
                }
            } else {
                if (this.currentTool === 'water') {
                    message = "A planta foi regada!";
                    this.happinessLevel = Math.min(1, this.happinessLevel + 0.01);
                    this.updateHappinessMeter();
                    if (this.plantSound) this.plantSound.play().catch(e => console.error("Falha ao tocar som de interação:", e));
                } else if (this.currentTool === 'prune') {
                    message = "A planta foi podada!";
                    this.happinessLevel = Math.min(1, this.happinessLevel + 0.015);
                    this.updateHappinessMeter();
                    if (this.plantSound) this.plantSound.play().catch(e => console.error("Falha ao tocar som de interação:", e));
                } else if (this.currentTool === 'fertilize') {
                    message = "A planta foi adubada!";
                    this.happinessLevel = Math.min(1, this.happinessLevel + 0.02);
                    this.updateHappinessMeter();
                    if (this.plantSound) this.plantSound.play().catch(e => console.error("Falha ao tocar som de interação:", e));
                }
            }
            if (stateChanged) this.savePlantStates();
        } else {
            message = "Erro: Planta não encontrada!";
        }

        if (feedbackEl && message) {
            feedbackEl.textContent = message;
            feedbackEl.classList.remove('fade-out');
            feedbackEl.classList.add('fade-in');
            setTimeout(() => {
                feedbackEl.classList.remove('fade-in');
                feedbackEl.classList.add('fade-out');
                setTimeout(() => feedbackEl.classList.remove('fade-out'), 500);
            }, 1500);
        }

        this.currentTool = null;
    }

    setMood(mood) {
        if (!this.userId) return;
        this.lastMood = mood;
        this.loadPage(`conselourScreen.html?mood=${mood}`);
    }

    openCounselorScreen() {
        if (!this.userId) return;
        this.navigate('conselourScreen');
    }

    saveHappinessLevel() {
        if (this.userId) {
            localStorage.setItem('happinessLevel_' + this.userId, this.happinessLevel.toString());
        }
    }

    loadHappinessLevel() {
        if (this.userId) {
            const savedLevel = localStorage.getItem('happinessLevel_' + this.userId);
            if (savedLevel !== null) {
                this.happinessLevel = parseFloat(savedLevel);
            } else {
                this.happinessLevel = 0.5;
            }
        }
    }

    updateHappinessMeter() {
        const fillElement = document.getElementById('happinessMeterFill');
        const indicatorElement = document.getElementById('happinessLevelIndicator');

        if (fillElement && indicatorElement) {
            const meterBar = fillElement.parentElement;
            const meterHeight = meterBar.offsetHeight;
            const fillHeight = this.happinessLevel * meterHeight;

            fillElement.style.height = `${fillHeight}px`;

            const indicatorCenter = meterHeight - fillHeight;
            const indicatorHalfHeight = indicatorElement.offsetHeight / 2;

            indicatorElement.style.top = `${indicatorCenter - indicatorHalfHeight}px`;

            indicatorElement.style.transition = 'top 0.5s ease-out';
        }
        this.saveHappinessLevel();
    }

    startHappinessDecay() {
        if (this.happinessDecayInterval) return;

        this.happinessDecayInterval = setInterval(() => {
            const healthyPlantsCount = this.plants.filter(p => !p.isDry).length;
            const totalPlants = this.plants.length;
            const healthyRatio = healthyPlantsCount / totalPlants;

            let decayRate = 0.0002;

            if (healthyRatio < 0.8) {
                decayRate = 0.0005;
            }

            this.happinessLevel = Math.max(0, this.happinessLevel - decayRate);
            this.updateHappinessMeter();

            if (this.happinessLevel <= 0) {
                this.stopHappinessDecay();
            }
        }, 30000);
    }

    stopHappinessDecay() {
        if (this.happinessDecayInterval) {
            clearInterval(this.happinessDecayInterval);
            this.happinessDecayInterval = null;
        }
    }
}

window.game = new GameManager();
