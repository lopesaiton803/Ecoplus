
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do carrossel
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    // Configurações
    const slideCount = slides.length;
    const slideDuration = 3000; // 3 segundos
    let currentIndex = 0;
    let autoSlideInterval;
    
    // Função para mover o carrossel para um slide específico
    function goToSlide(index) {
        // Garante que o índice esteja dentro dos limites
        currentIndex = (index + slideCount) % slideCount;
        
        // Move o track para o slide atual
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Atualiza os dots
        updateDots();
        
        // Reinicia as animações do conteúdo
        resetContentAnimations();
    }
    
    // Função para atualizar os dots de navegação
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Função para reiniciar as animações do conteúdo
    function resetContentAnimations() {
        const activeSlide = slides[currentIndex];
        const contentElements = activeSlide.querySelectorAll('.carousel-content > *');
        
        contentElements.forEach((el, i) => {
            // Reinicia a animação
            el.style.animation = 'none';
            void el.offsetWidth; // Trigger reflow
            el.style.animation = null;
            
            // Aplica atrasos diferentes para cada elemento
            if (el.tagName === 'H2') {
                el.style.animation = 'fadeIn 1s ease forwards';
            } else if (el.tagName === 'H3') {
                el.style.animation = 'fadeIn 1s ease 0.3s forwards';
            } else if (el.tagName === 'P') {
                el.style.animation = 'fadeIn 1s ease 0.6s forwards';
            } else if (el.classList.contains('btn')) {
                el.style.animation = 'fadeIn 1s ease 0.9s forwards';
            }
        });
    }
    
    // Função para avançar para o próximo slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Função para voltar ao slide anterior
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Inicia o slideshow automático
    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, slideDuration);
    }
    
    // Pausa o slideshow automático
    function pauseAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', function() {
        pauseAutoSlide();
        nextSlide();
        startAutoSlide();
    });
    
    prevBtn.addEventListener('click', function() {
        pauseAutoSlide();
        prevSlide();
        startAutoSlide();
    });
    
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-index'));
            pauseAutoSlide();
            goToSlide(slideIndex);
            startAutoSlide();
        });
    });
    
    // Pausa quando o mouse está sobre o carrossel
    const carousel = document.querySelector('.carousel-container');
    carousel.addEventListener('mouseenter', pauseAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    
    // Suporte para touch (mobile)
    let touchStartX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        pauseAutoSlide();
    }, { passive: true });
    
    carousel.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (diff > 50) { // Swipe para esquerda
            nextSlide();
        } else if (diff < -50) { // Swipe para direita
            prevSlide();
        }
        
        startAutoSlide();
    }, { passive: true });
    
    // Inicializa o carrossel
    goToSlide(0);
    startAutoSlide();
    
    // Redimensionamento da janela
    window.addEventListener('resize', function() {
        track.style.transition = 'none';
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        void track.offsetWidth; // Trigger reflow
        track.style.transition = 'transform 0.8s ease-in-out';
    });
});










// ----------------------------------------------------------------- //

    document.addEventListener('DOMContentLoaded', function() {
        const sliderWrapper = document.querySelector('.slider-wrapper');
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.prev-slide');
        const nextBtn = document.querySelector('.next-slide');
        let currentIndex = 0;
        let slideInterval;
        const slideDuration = 6000; // 6 seconds
        
        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            currentIndex = index;
            sliderWrapper.style.transform = `translateX(-${currentIndex * 33.333}%)`;
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
            
            // Update slides
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentIndex);
            });
            
            // Reset timer
            resetInterval();
        }
        
        function nextSlide() {
            goToSlide(currentIndex + 1);
        }
        
        function prevSlide() {
            goToSlide(currentIndex - 1);
        }
        
        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, slideDuration);
        }
        
        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const slideIndex = parseInt(this.getAttribute('data-slide'));
                goToSlide(slideIndex);
            });
        });
        
        // Auto slide
        resetInterval();
        
        // Pause on hover
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', resetInterval);
        
        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(slideInterval);
        }, {passive: true});
        
        sliderContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            resetInterval();
        }, {passive: true});
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                nextSlide(); // Swipe left
            }
            if (touchEndX > touchStartX + 50) {
                prevSlide(); // Swipe right
            }
        }


        document.addEventListener('DOMContentLoaded', function() {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentIndex = 0;
    let slideInterval;
    const slideDuration = 4000; // 4 segundos

    // Função para avançar para o próximo slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length; // Volta para 0 quando chegar no último
        updateSlider();
    }

    // Função para voltar ao slide anterior
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length; // Volta para o último quando estiver no 0
        updateSlider();
    }

    // Atualiza a posição do slider e os indicadores
    function updateSlider() {
        sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Atualiza os dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Atualiza os slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });
    }

    // Inicia o intervalo automático
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, slideDuration);
    }

    // Pausa o intervalo automático
    function pauseAutoSlide() {
        clearInterval(slideInterval);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        pauseAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        pauseAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            pauseAutoSlide();
            currentIndex = parseInt(this.getAttribute('data-slide'));
            updateSlider();
            startAutoSlide();
        });
    });

    // Pausa quando o mouse está sobre o slider
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.addEventListener('mouseenter', pauseAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);

    // Touch events para mobile
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        pauseAutoSlide();
    }, {passive: true});

    sliderContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    }, {passive: true});

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide(); // Swipe para esquerda
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide(); // Swipe para direita
        }
    }

    // Inicia o slider
    updateSlider();
    startAutoSlide();
});
    });
 


    
// ----------------------------------------------------------------- //


    document.addEventListener('DOMContentLoaded', function() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const progressContainer = document.getElementById('progressContainer');
        const siteContent = document.getElementById('siteContent');
        
        // Tipos de folhas (emojis)
        const leafTypes = ['🍃', '🍃', '🍃', '🍃', '🍃'];
        
        // Criar folhas caindo
        function createLeaf() {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            leaf.textContent = leafTypes[Math.floor(Math.random() * leafTypes.length)];
            
            // Posição inicial aleatória
            leaf.style.left = Math.random() * 100 + 'vw';
            
            // Tamanho aleatório
            const size = Math.random() * 20 + 15;
            leaf.style.fontSize = size + 'px';
            
            // Duração e animação aleatória
            const duration = Math.random() * 3 + 2;
            leaf.style.animationDuration = duration + 's';
            leaf.style.animationName = 'falling';
            
            progressContainer.appendChild(leaf);
            
            // Remover folha após a animação
            setTimeout(() => {
                leaf.remove();
            }, duration * 1000);
        }
        
        // Adicionar animação de queda
        const style = document.createElement('style');
        style.textContent = `
            @keyframes falling {
                0% { 
                    transform: translateY(0) rotate(0deg) translateX(0); 
                    opacity: 1;
                }
                100% { 
                    transform: translateY(100vh) rotate(360deg) translateX(${Math.random() > 0.5 ? '' : '-'}50px); 
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Gerar folhas periodicamente
        setInterval(createLeaf, 300);
        
        // Simular progresso (substitua pelo carregamento real)
        let progress = 0;
        const messages = [
            { percent: 0, text: "Preparando o solo..." },
            { percent: 20, text: "Plantando sementes..." },
            { percent: 40, text: "Regando as plantas..." },
            { percent: 60, text: "Cultivando conhecimento..." },
            { percent: 80, text: "Colhendo resultados..." },
            { percent: 95, text: "Quase pronto..." }
        ];
        
        function updateProgress() {
            progress += Math.random() * 5;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = progress + '%';
            
            // Atualizar mensagem
            const currentMsg = messages.reduce((prev, curr) => 
                progress >= curr.percent ? curr : prev
            );
            progressText.textContent = currentMsg.text;
            
            // Finalizar quando completo
            if (progress >= 100) {
                progressText.textContent = "Pronto!";
                
                setTimeout(() => {
                    progressContainer.style.opacity = '0';
                    setTimeout(() => {
                        progressContainer.style.display = 'none';
                        siteContent.style.display = 'block';
                    }, 500);
                }, 500);
                return;
            }
            
            // Continuar atualizando
            requestAnimationFrame(updateProgress);
        }
        
        // Iniciar atualização de progresso
        updateProgress();
        
        // Para carregamento real, você pode usar:
        // window.addEventListener('load', function() {
        //     progressFill.style.width = '100%';
        //     // Resto do código para esconder o progress bar
        // });
    });





 //disable body scroll which navbar is in active -->
 $(function () {
           $('.navbar-toggler').click(function () {
               $('body').toggleClass('noscroll');
           })
       });  




       
//  disable body scroll which navbar is in active 
     


        $('.carousel').carousel({
            interval: 2000
        })



        


    //  MENU-JS
 
        $(window).on("scroll", function () {
            var scroll = $(window).scrollTop();

            if (scroll >= 80) {
                $("#site-header").addClass("nav-fixed");
            } else {
                $("#site-header").removeClass("nav-fixed");
            }
        });

        //Main navigation Active Class Add Remove
        $(".navbar-toggler").on("click", function () {
            $("header").toggleClass("active");
        });
        $(document).on("ready", function () {
            if ($(window).width() > 991) {
                $("header").removeClass("active");
            }
            $(window).on("resize", function () {
                if ($(window).width() > 991) {
                    $("header").removeClass("active");
                }
            });
        });





        // When the user scrolls down 20px from the top of the document, show the button

        window.onscroll = function () {
            scrollFunction()
        };

        function scrollFunction() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                document.getElementById("movetop").style.display = "block";
            } else {
                document.getElementById("movetop").style.display = "none";
            }
        }

        // When the user clicks on the button, scroll to the top of the document
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }


              //     // Remove o loading após 3 segundos (simulação)
    window.addEventListener('load', function() {
      setTimeout(function() {
        document.getElementById('agroLoader').style.display = 'none';
      }, 3000);
    });

    // Caso queira remover apenas quando tudo estiver carregado:
    // window.addEventListener('load', function() {
       // document.getElementById('agroLoader').style.display = 'none';
    //});




// 



    // Simula o carregamento e depois remove o preloader
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.querySelector('.agro-preloader').style.opacity = '0';
            setTimeout(function() {
                document.querySelector('.agro-preloader').style.display = 'none';
                document.querySelector('div[style="display: none;"]').style.display = 'block';
            }, 500);
        }, 2500); // Tempo total do preloader (2.5s)
    });







document.addEventListener('DOMContentLoaded', function() {
  const progressFill = document.querySelector('.agro-progress-fill');
  const percentage = document.querySelector('.agro-percentage');
  const marks = document.querySelectorAll('.agro-mark');
  
  // Reinicia animação
  progressFill.style.width = '0';
  percentage.textContent = '0%';
  marks.forEach(mark => mark.style.opacity = '0');
  
  // Inicia animação
  setTimeout(() => {
    progressFill.style.width = '100%';
    
    // Animação do porcentagem
    let percent = 0;
    const interval = setInterval(() => {
      percent++;
      percentage.textContent = percent + '%';
      
      // Mostra marcas em pontos específicos
      if (percent === 25) marks[0].style.opacity = '1';
      if (percent === 50) marks[1].style.opacity = '1';
      if (percent === 75) marks[2].style.opacity = '1';
      
      if (percent >= 100) clearInterval(interval);
    }, 30);
  }, 500);
  
  // Opcional: Click para recomeçar
  document.querySelector('.agro-progress-container').addEventListener('click', function() {
    progressFill.style.width = '0';
    percentage.textContent = '0%';
    marks.forEach(mark => mark.style.opacity = '0');
    
    setTimeout(() => {
      progressFill.style.width = '100%';
      let percent = 0;
      const interval = setInterval(() => {
        percent++;
        percentage.textContent = percent + '%';
        if (percent === 25) marks[0].style.opacity = '1';
        if (percent === 50) marks[1].style.opacity = '1';
        if (percent === 75) marks[2].style.opacity = '1';
        if (percent >= 100) clearInterval(interval);
      }, 30);
    }, 100);
  });
});
