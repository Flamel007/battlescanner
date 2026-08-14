document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // ELEMENTOS
    // =========================================================

    const loadingScreen =
        document.getElementById("loading-screen");

    const loadingProgress =
        document.getElementById("loading-progress");

    const loadingPercent =
        document.getElementById("loading-percent");

    const mainContent =
        document.getElementById("main-content");

    const systemTime =
        document.getElementById("system-time");

    const visitorID =
        document.getElementById("visitor-id");

    const buttons =
        document.querySelectorAll(".menu-button");

    const sections =
        document.querySelectorAll(".content-section");

    const openFile =
        document.getElementById("open-file");

    const secretOverlay =
        document.getElementById("secret-overlay");

    const closeSecret =
        document.getElementById("close-secret");

    const secretCode =
        document.getElementById("secret-code");

    const submitCode =
        document.getElementById("submit-code");

    const codeMessage =
        document.getElementById("code-message");

    const secretContent =
        document.getElementById("secret-content");



    // =========================================================
    // TELA DE CARREGAMENTO
    // =========================================================

    let progress = 0;

    const loading = setInterval(function () {

        progress += Math.floor(Math.random() * 4) + 1;

        if (progress > 100) {
            progress = 100;
        }

        if (loadingProgress) {

            loadingProgress.style.width =
                progress + "%";

        }

        if (loadingPercent) {

            loadingPercent.textContent =
                progress + "%";

        }


        if (progress >= 100) {

            clearInterval(loading);

            setTimeout(function () {

                if (loadingScreen) {

                    loadingScreen.style.opacity = "0";

                    loadingScreen.style.visibility =
                        "hidden";

                }


                if (mainContent) {

                    mainContent.classList.add(
                        "visible"
                    );

                }

            }, 600);

        }

    }, 45);



    // =========================================================
    // RELÓGIO DO SISTEMA
    // =========================================================

    function updateClock() {

        if (!systemTime) {
            return;
        }

        const now = new Date();

        const hours =
            String(now.getHours()).padStart(2, "0");

        const minutes =
            String(now.getMinutes()).padStart(2, "0");

        const seconds =
            String(now.getSeconds()).padStart(2, "0");


        systemTime.textContent =
            hours + ":" +
            minutes + ":" +
            seconds;

    }

    updateClock();

    setInterval(updateClock, 1000);



    // =========================================================
    // MENU LATERAL
    // =========================================================

    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const target =
                    button.getAttribute(
                        "data-section"
                    );


                buttons.forEach(function (btn) {

                    btn.classList.remove(
                        "active"
                    );

                });


                sections.forEach(function (section) {

                    section.classList.remove(
                        "active-section"
                    );

                });


                button.classList.add(
                    "active"
                );


                const selected =
                    document.getElementById(
                        target
                    );


                if (selected) {

                    selected.classList.add(
                        "active-section"
                    );

                }

            }
        );

    });



    // =========================================================
    // ARQUIVO PCL VERMELHO
    // =========================================================

    if (openFile && secretOverlay) {

        openFile.addEventListener(
            "click",
            function () {

                secretOverlay.classList.add(
                    "visible"
                );

                glitch();

            }
        );

    }


    if (closeSecret && secretOverlay) {

        closeSecret.addEventListener(
            "click",
            function () {

                secretOverlay.classList.remove(
                    "visible"
                );

            }
        );

    }


    /*
        Fecha a janela clicando fora dela.
    */

    if (secretOverlay) {

        secretOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    secretOverlay
                ) {

                    secretOverlay.classList.remove(
                        "visible"
                    );

                }

            }
        );

    }



    // =========================================================
    // ID DO VISITANTE
    // =========================================================

    /*
        O ID do visitante é independente da investigação.

        Portanto, ele pode continuar salvo entre sessões.
    */

    if (visitorID) {

        let id =
            localStorage.getItem(
                "archiveVisitorID"
            );


        if (!id) {

            id =
                Math.floor(
                    100000 +
                    Math.random() * 900000
                );


            localStorage.setItem(
                "archiveVisitorID",
                id
            );

        }


        visitorID.textContent =
            "ID: " + id;

    }



    // =========================================================
    // SISTEMA DE CÓDIGOS
    // =========================================================

    /*
        PRIMEIRO CÓDIGO DA INVESTIGAÇÃO

        170487

        Representa:

        17.04.1987

        IMPORTANTE:

        Este código NÃO é salvo.

        O acesso é exclusivamente temporário.

        Atualizou a página?
        Fechou o navegador?
        Entrou novamente?

        O arquivo volta a ficar bloqueado.
    */

    const ARCHIVE_CODES = {

        first: "170487"

    };



    // =========================================================
    // VERIFICAÇÃO DO CÓDIGO
    // =========================================================

    function checkSecretCode() {

        if (
            !secretCode ||
            !codeMessage
        ) {

            return;

        }


        const enteredCode =
            secretCode.value
                .trim()
                .toUpperCase();



        // -----------------------------------------------------
        // CAMPO VAZIO
        // -----------------------------------------------------

        if (!enteredCode) {

            codeMessage.textContent =
                "ОШИБКА: ВВЕДИТЕ КОД.";

            codeMessage.style.color =
                "#666";

            return;

        }



        // -----------------------------------------------------
        // CÓDIGO CORRETO
        // -----------------------------------------------------

        if (
            enteredCode ===
            ARCHIVE_CODES.first
        ) {

            unlockFirstArchive();

            return;

        }



        // -----------------------------------------------------
        // CÓDIGO ERRADO
        // -----------------------------------------------------

        codeMessage.textContent =
            "ОШИБКА: КОД НЕВЕРЕН.";

        codeMessage.style.color =
            "#555";


        glitch();

    }



    // =========================================================
    // PRIMEIRO DESBLOQUEIO
    // =========================================================

    function unlockFirstArchive() {

        /*
            ====================================================
            IMPORTANTE
            ====================================================

            NÃO existe localStorage aqui.

            O modo corrompido existe somente nesta sessão.

            Ao recarregar a página:

            .corrupted-mode desaparece
            secretContent volta a ficar escondido
            formulário volta a aparecer
            título volta ao original
            ====================================================
        */


        // -----------------------------------------------------
        // PRIMEIRA FASE DA AUTENTICAÇÃO
        // -----------------------------------------------------

        codeMessage.textContent =
            "ПРОВЕРКА...";

        codeMessage.style.color =
            "#888";


        /*
            Pequena demora para criar a sensação
            de autenticação do sistema.
        */

        setTimeout(function () {


            // -------------------------------------------------
            // ACESSO CONCEDIDO
            // -------------------------------------------------

            codeMessage.textContent =
                "ДОСТУП ПРИНЯТ.";

            codeMessage.style.color =
                "#b52a2a";



            // -------------------------------------------------
            // ATIVA A CORRUPÇÃO GLOBAL
            // -------------------------------------------------

            activateCorruptedMode();



            // -------------------------------------------------
            // REVELA O DOCUMENTO
            // -------------------------------------------------

            if (secretContent) {

                secretContent.style.display =
                    "block";

            }



            // -------------------------------------------------
            // REMOVE O FORMULÁRIO
            // -------------------------------------------------

            if (secretCode) {

                secretCode.style.display =
                    "none";

            }


            if (submitCode) {

                submitCode.style.display =
                    "none";

            }



            // -------------------------------------------------
            // ALTERA O TÍTULO
            // -------------------------------------------------

            const restrictedTitle =
                document.querySelector(
                    "#restricted h2"
                );


            if (restrictedTitle) {

                restrictedTitle.textContent =
                    "АРХИВ — УРОВЕНЬ 1 // CORRUPTED";

            }



            // -------------------------------------------------
            // MARCA O PAINEL COMO LIBERADO
            // -------------------------------------------------

            const restrictedPanel =
                document.getElementById(
                    "restricted-panel"
                );


            if (restrictedPanel) {

                restrictedPanel.classList.add(
                    "access-granted"
                );

            }


        }, 1200);

    }



    // =========================================================
    // MODO CORROMPIDO
    // =========================================================

    function activateCorruptedMode() {

        /*
            Esta é a principal mudança visual.

            O CSS possui regras específicas para:

            .corrupted-mode

            Ao adicionar essa classe ao BODY,
            toda a página muda de comportamento.
        */

        document.body.classList.add(
            "corrupted-mode"
        );


        /*
            Glitch inicial mais forte.
        */

        glitch();


        setTimeout(function () {

            glitch();

        }, 180);


        setTimeout(function () {

            glitch();

        }, 350);


        /*
            Pequena alteração no título do sistema.
        */

        const headerTitle =
            document.querySelector(
                ".header-center h1"
            );


        if (headerTitle) {

            headerTitle.setAttribute(
                "data-original-title",
                headerTitle.textContent
            );

        }


        /*
            Status do sistema.
        */

        const statusText =
            document.querySelector(
                ".header-left"
            );


        if (
            statusText &&
            !statusText.querySelector(
                ".corruption-status"
            )
        ) {

            const corruption =
                document.createElement(
                    "span"
                );


            corruption.className =
                "corruption-status";


            corruption.textContent =
                " // SYSTEM INTEGRITY: 17%";


            statusText.appendChild(
                corruption
            );

        }

    }



    // =========================================================
    // BOTÃO DE CÓDIGO
    // =========================================================

    if (submitCode) {

        submitCode.addEventListener(
            "click",
            checkSecretCode
        );

    }



    // =========================================================
    // ENTER NO CAMPO DE CÓDIGO
    // =========================================================

    if (secretCode) {

        secretCode.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    checkSecretCode();

                }

            }
        );

    }



    // =========================================================
    // GLITCH
    // =========================================================

    function glitch() {

        if (!document.body) {
            return;
        }


        document.body.classList.add(
            "glitching"
        );


        setTimeout(function () {

            document.body.classList.remove(
                "glitching"
            );

        }, 150);

    }



    // =========================================================
    // GLITCHES ALEATÓRIOS
    // =========================================================

    setInterval(function () {

        /*
            Antes do código:
            glitch normal e relativamente raro.

            Depois do código:
            glitch mais frequente.
        */

        const corrupted =
            document.body.classList.contains(
                "corrupted-mode"
            );


        const chance =
            corrupted
                ? 0.38
                : 0.15;


        if (Math.random() < chance) {

            glitch();

        }

    }, 5000);



    // =========================================================
    // PEQUENAS FALHAS NOS TEXTOS
    // =========================================================

    setInterval(function () {

        const classified =
            document.querySelectorAll(
                ".classified-text"
            );


        if (
            classified.length > 0 &&
            Math.random() < 0.25
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    classified.length
                );


            const element =
                classified[randomIndex];


            element.style.opacity =
                "0.35";


            setTimeout(function () {

                element.style.opacity =
                    "1";

            }, 180);

        }

    }, 3500);



    // =========================================================
    // REGISTRO CORROMPIDO
    // =========================================================

    const corruptedRecord =
        document.querySelector(
            ".corrupted-record"
        );


    if (corruptedRecord) {

        setInterval(function () {

            const corruptedMode =
                document.body.classList.contains(
                    "corrupted-mode"
                );


            /*
                Antes do desbloqueio:
                20% de chance.

                Depois:
                45% de chance.
            */

            const chance =
                corruptedMode
                    ? 0.45
                    : 0.20;


            if (
                Math.random() <
                chance
            ) {

                corruptedRecord.classList.add(
                    "glitching"
                );


                setTimeout(function () {

                    corruptedRecord.classList.remove(
                        "glitching"
                    );

                }, 200);

            }

        }, 4000);

    }



    // =========================================================
    // CORRUPÇÃO VERMELHA — INTERFERÊNCIA
    // =========================================================

    setInterval(function () {

        /*
            Só acontece depois do código.

            Cria pequenas interferências temporárias
            em elementos da página.
        */

        if (
            !document.body.classList.contains(
                "corrupted-mode"
            )
        ) {

            return;

        }


        const elements =
            document.querySelectorAll(
                ".project, .terminal-box, .document, .person-card"
            );


        if (
            elements.length === 0 ||
            Math.random() > 0.30
        ) {

            return;

        }


        const randomIndex =
            Math.floor(
                Math.random() *
                elements.length
            );


        const element =
            elements[randomIndex];


        element.classList.add(
            "red-interference"
        );


        setTimeout(function () {

            element.classList.remove(
                "red-interference"
            );

        }, 250);

    }, 3000);



    // =========================================================
    // PRIMEIRA EXECUÇÃO
    // =========================================================

    setTimeout(function () {

        document.body.classList.add(
            "system-ready"
        );

    }, 2500);



    // =========================================================
    // GARANTIA DE RESET
    // =========================================================

    /*
        NÃO usamos localStorage/sessionStorage
        para o desbloqueio.

        Portanto, cada carregamento do documento
        começa obrigatoriamente no estado normal.

        Esta parte apenas garante que, caso algum
        navegador preserve alguma alteração visual,
        ela seja removida durante a inicialização.
    */

    document.body.classList.remove(
        "corrupted-mode"
    );


    if (secretContent) {

        secretContent.style.display =
            "none";

    }


    if (secretCode) {

        secretCode.style.display =
            "";

    }


    if (submitCode) {

        submitCode.style.display =
            "";

    }

});