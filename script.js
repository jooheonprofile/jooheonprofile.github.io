// DOM 요소들
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.content-section');
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.querySelector('.modal-close');

// 음악 플레이어 기능
let isPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        isPlaying = false;
    } else {
        bgMusic.play().then(() => {
            musicToggle.classList.add('playing');
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        }).catch(error => {
            // 사용자 상호작용 후 재시도
            showMusicPrompt();
        });
    }
});

// 음악 재생 프롬프트 (자동재생 차단 시)
function showMusicPrompt() {
    const prompt = document.createElement('div');
    prompt.className = 'music-prompt';
    prompt.innerHTML = `
        <div class="music-prompt-content">
            <p>배경음악을 재생하시겠습니까?</p>
            <button onclick="startMusic()" class="music-prompt-btn">재생</button>
            <button onclick="closePrompt()" class="music-prompt-btn secondary">아니오</button>
        </div>
    `;
    prompt.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
    `;
    
    const content = prompt.querySelector('.music-prompt-content');
    content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    `;
    
    const buttons = prompt.querySelectorAll('.music-prompt-btn');
    buttons.forEach(btn => {
        btn.style.cssText = `
            margin: 10px;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
        `;
    });
    
    buttons[0].style.background = '#3498db';
    buttons[0].style.color = 'white';
    buttons[1].style.background = '#95a5a6';
    buttons[1].style.color = 'white';
    
    document.body.appendChild(prompt);
    
    window.startMusic = () => {
        bgMusic.play().then(() => {
            musicToggle.classList.add('playing');
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        });
        document.body.removeChild(prompt);
    };
    
    window.closePrompt = () => {
        document.body.removeChild(prompt);
    };
}

// 음악 종료 시 버튼 상태 리셋
bgMusic.addEventListener('ended', () => {
    musicToggle.classList.remove('playing');
    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    isPlaying = false;
});

// 네비게이션 스크롤 효과
function updateActiveNav() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
}

// 스크롤 이벤트
window.addEventListener('scroll', () => {
    updateActiveNav();
    
    // 패럴랙스 효과
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// 네비게이션 클릭 이벤트
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 갤러리 모달 기능
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.getAttribute('data-image');
        const imgAlt = item.querySelector('img').getAttribute('alt');
        
        modalImg.src = imgSrc;
        modalCaption.textContent = imgAlt;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // 모달 페이드인 애니메이션
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    });
});

// 모달 닫기
function closeModal() {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// 키보드 네비게이션 (갤러리)
let currentImageIndex = -1;
const galleryImages = Array.from(galleryItems);

document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    }
});

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateModalImage();
}

function showPrevImage() {
    currentImageIndex = currentImageIndex <= 0 ? galleryImages.length - 1 : currentImageIndex - 1;
    updateModalImage();
}

function updateModalImage() {
    const item = galleryImages[currentImageIndex];
    const imgSrc = item.getAttribute('data-image');
    const imgAlt = item.querySelector('img').getAttribute('alt');
    
    modalImg.src = imgSrc;
    modalCaption.textContent = imgAlt;
}

// 갤러리 아이템 클릭 시 인덱스 설정
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
    });
});

// 스크롤 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// 애니메이션 대상 요소들 관찰
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.info-card, .personality-card, .psychology-item, .char-item, ' +
        '.dialogue-item, .intimate-section, .gallery-item, .crisis-stage'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// 터치 제스처 지원 (모바일)
let touchStartX = 0;
let touchStartY = 0;

modal.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

modal.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // 수평 스와이프가 수직 스와이프보다 클 때만 처리
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            showPrevImage();
        } else {
            showNextImage();
        }
    }
});

// 성능 최적화: 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 스크롤 이벤트 디바운스
const debouncedScrollHandler = debounce(() => {
    updateActiveNav();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// 리사이즈 이벤트 처리
const debouncedResizeHandler = debounce(() => {
    // 모바일 뷰포트 높이 조정
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // 네비게이션 업데이트
    updateActiveNav();
}, 250);

window.addEventListener('resize', debouncedResizeHandler);

// 초기 뷰포트 높이 설정
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// 이미지 레이지 로딩
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 페이지 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // 초기 네비게이션 상태 설정
    updateActiveNav();
    
    // 레이지 로딩 초기화
    lazyLoadImages();
    
    // 스크롤 인디케이터 클릭 이벤트
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const firstSection = document.querySelector('#overview');
            if (firstSection) {
                firstSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // 다운로드 버튼 클릭 추적 (이미 a 태그이므로 별도 이벤트 불필요)
    
    // 폰트 로딩 최적화
    if ('fonts' in document) {
        document.fonts.ready.then(() => {
            document.body.classList.add('fonts-loaded');
        });
    }
});

// 에러 처리
window.addEventListener('error', (e) => {
    // 에러 발생 시 조용히 처리
});

// 음성 인식 지원 (실험적 기능)
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'ko-KR';
    
    // 음성 명령어 처리 (선택사항)
    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        
        if (command.includes('음악') || command.includes('브금')) {
            musicToggle.click();
        } else if (command.includes('갤러리')) {
            document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
        }
    };
}

// PWA 지원 준비
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 서비스 워커 등록 준비 (필요시 구현)
    });
}



// 접근성 개선: 키보드 네비게이션
document.addEventListener('keydown', (e) => {
    // Tab 키로 포커스 이동 시 스크롤 조정
    if (e.key === 'Tab') {
        setTimeout(() => {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.getBoundingClientRect) {
                const rect = focusedElement.getBoundingClientRect();
                if (rect.top < 100 || rect.bottom > window.innerHeight - 100) {
                    focusedElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            }
        }, 100);
    }
});

// 성능 모니터링
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            // 성능 데이터 수집 (필요시 활용)
        }, 0);
    });
}

// 사용자 경험 개선: 스크롤 위치 기억
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('scrollPosition', window.pageYOffset);
});

window.addEventListener('load', () => {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition) {
        setTimeout(() => {
            window.scrollTo(0, parseInt(savedPosition));
        }, 100);
    }
});

// 모바일 환경 최적화
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    // 모바일 특화 기능
    document.body.classList.add('mobile');
    
    // 터치 피드백 개선
    const touchElements = document.querySelectorAll('button, .nav-item, .gallery-item');
    touchElements.forEach(el => {
        el.addEventListener('touchstart', () => {
            el.style.transform = 'scale(0.98)';
        });
        el.addEventListener('touchend', () => {
            el.style.transform = '';
        });
    });
}

// 최종 초기화 완료 