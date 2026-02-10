document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const stage1 = document.getElementById('stage-1');
    const stage2 = document.getElementById('stage-2');
    const stage3 = document.getElementById('stage-3');
    const stage4 = document.getElementById('stage-4');
    const nextBtn1 = document.getElementById('next-btn-1');
    const finalBtn = document.getElementById('final-btn');
    const backTo1 = document.getElementById('back-to-1');
    const backTo2 = document.getElementById('back-to-2');
    const backTo3 = document.getElementById('back-to-3');
    const voucherOptions = document.querySelectorAll('.voucher-option');
    const voucherDisplay = document.getElementById('voucher-display');
    const heartsBg = document.getElementById('hearts-bg');
    let noMoveCount = 0;
    const MAX_NO_MOVES = 4; // Moves 3 times, disappears on 4th

    // Floating Hearts Generation
    function createHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.classList.add('heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        if (heartsBg) heartsBg.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 6000);
    }

    setInterval(createHeart, 300);

    // Snappy No Button Logic
    function moveNoBtn(e) {
        if (e) e.preventDefault();

        noMoveCount++;

        if (noMoveCount >= MAX_NO_MOVES) {
            noBtn.style.display = 'none';
            return;
        }

        // Move button to body to escape parent stacking contexts (transforms/filters)
        if (noBtn.parentElement !== document.body) {
            document.body.appendChild(noBtn);
        }

        // Snappy teleportation
        noBtn.style.transition = 'none';
        noBtn.style.position = 'fixed';
        noBtn.style.zIndex = '99999';

        const padding = 80;
        const maxX = window.innerWidth - noBtn.offsetWidth - padding;
        const maxY = window.innerHeight - noBtn.offsetHeight - padding;

        const newX = Math.max(padding, Math.random() * maxX);
        const newY = Math.max(padding, Math.random() * maxY);

        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;

        // Random rotation and scale for "teasing" look
        const randomRotate = (Math.random() - 0.5) * 40;
        const randomScale = 0.8 + Math.random() * 0.4;
        noBtn.style.transform = `rotate(${randomRotate}deg) scale(${randomScale})`;

        const cheekyTexts = ["Nice try!", "Nope!", "Try again!", "Catch me!", "Zero chance!", "Too slow!", "Not today!"];
        noBtn.textContent = cheekyTexts[Math.floor(Math.random() * cheekyTexts.length)];
    }

    noBtn.addEventListener('mouseenter', moveNoBtn);
    noBtn.addEventListener('click', moveNoBtn);

    // Navigation and Logic
    yesBtn.addEventListener('click', () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF4D6D', '#FF758F', '#C9184A']
        });

        transitionStages(stage1, stage2);
    });

    nextBtn1.addEventListener('click', () => {
        transitionStages(stage2, stage3);
    });

    voucherOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            voucherOptions.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            opt.classList.remove('btn-secondary');
            opt.classList.add('btn-primary');
            finalBtn.classList.remove('hidden');
            window.selectedVoucher = opt.getAttribute('data-value');
        });
    });

    finalBtn.addEventListener('click', () => {
        voucherDisplay.textContent = `🎟️ ${window.selectedVoucher}`;
        transitionStages(stage3, stage4);

        // Extra celebration
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 160,
                origin: { y: 1 }
            });
        }, 500);
    });

    // Back Navigation Logic
    backTo1.addEventListener('click', () => {
        transitionStages(stage2, stage1);
    });

    backTo2.addEventListener('click', () => {
        transitionStages(stage3, stage2);
    });

    backTo3.addEventListener('click', () => {
        transitionStages(stage4, stage3);
    });

    function resetNoBtn() {
        noMoveCount = 0;
        noBtn.style.display = 'block';

        // Return to original container if not already there
        const container = document.querySelector('#stage-1 .btn-container');
        if (container && noBtn.parentElement !== container) {
            container.appendChild(noBtn);
        }

        noBtn.style.position = 'relative';
        noBtn.style.left = 'auto';
        noBtn.style.top = 'auto';
        noBtn.style.transform = 'none';
        noBtn.style.transition = 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        noBtn.textContent = 'No 😢';
    }

    function transitionStages(from, to) {
        from.classList.remove('active');
        setTimeout(() => {
            from.classList.add('hidden');
            to.classList.remove('hidden');

            // Special case: if we go back to stage 1, reset the no button
            if (to === stage1) resetNoBtn();

            setTimeout(() => {
                to.classList.add('active');
            }, 50);
        }, 500);
    }
});
