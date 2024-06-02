document.addEventListener('DOMContentLoaded', () => {
    const getItemsButton = document.getElementById('getItemsButton');
    const resetButton = document.getElementById('resetButton');
    const shareButton = document.getElementById('shareButton');
    const luckySpan = document.getElementById('lucky');
    const deathSpan = document.getElementById('death');
    const passwordModal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('passwordInput');
    const submitButton = document.getElementById('submitButton');
    const closeModalButton = document.querySelector('.close');
    const countdownSpan = document.getElementById('countdown');

    const encryptedPassword = "Z29zby1nb2F0LmNvbQ=="; // pass

    function calculateResetTime() {
        const now = new Date();
        let resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 0, 0, 0);
        if (now >= resetTime) {
            resetTime.setDate(resetTime.getDate() + 1);
        }
        return resetTime;
    }

    function startCountdown() {
        const resetTime = new Date(localStorage.getItem('nextResetTime'));
        const interval = setInterval(() => {
            const now = new Date();
            const timeDifference = resetTime - now;
            if (timeDifference <= 0) {
                clearInterval(interval);
                countdownSpan.textContent = '';
                getItemsButton.disabled = false;
                getItemsButton.textContent = 'うらなう';
                localStorage.removeItem('lastClickTime');
                localStorage.removeItem('nextResetTime');
                localStorage.removeItem('luckyItem');
                localStorage.removeItem('deathItem');
                luckySpan.textContent = '';
                deathSpan.textContent = '';
                shareButton.style.display = 'none';
            } else {
                const hours = Math.floor(timeDifference / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
                countdownSpan.textContent = `次の更新まで: ${hours}時間${minutes}分${seconds}秒`;
            }
        }, 1000);
    }

    function checkButtonState() {
        const lastClickTime = localStorage.getItem('lastClickTime');
        if (lastClickTime) {
            const resetTime = calculateResetTime();
            const now = new Date();
            if (now < resetTime) {
                getItemsButton.disabled = true;
                getItemsButton.textContent = 'またあした！';
                localStorage.setItem('nextResetTime', resetTime.toISOString());
                // 保存されたアイテムを表示
                luckySpan.textContent = localStorage.getItem('luckyItem');
                deathSpan.textContent = localStorage.getItem('deathItem');
                shareButton.style.display = 'block';
            }
        }
        startCountdown(); // cd-s
    }

    function setItems() {
        fetch('items.json')
            .then(response => response.json())
            .then(items => {
                const luckyItem = items[Math.floor(Math.random() * items.length)];
                let deathItem;
                do {
                    deathItem = items[Math.floor(Math.random() * items.length)];
                } while (deathItem === luckyItem);

                luckySpan.textContent = luckyItem;
                deathSpan.textContent = deathItem;
                shareButton.style.display = 'block';

                const now = new Date();
                const resetTime = calculateResetTime();
                localStorage.setItem('lastClickTime', now.toISOString());
                localStorage.setItem('nextResetTime', resetTime.toISOString());
                localStorage.setItem('luckyItem', luckyItem);
                localStorage.setItem('deathItem', deathItem);
                getItemsButton.disabled = true;
                getItemsButton.textContent = 'またあした！';

                startCountdown(); // cd
            })
            .catch(error => {
                console.error('Error fetching items:', error);
            });
    }

    function resetItems() {
        passwordModal.style.display = 'block';
    }

    function closeModal() {
        passwordModal.style.display = 'none';
    }

    function encodeBase64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    function submitPassword() {
        const password = passwordInput.value;
        // pass-c
        if (encodeBase64(password) === encryptedPassword) {
            localStorage.removeItem('lastClickTime');
            localStorage.removeItem('nextResetTime');
            localStorage.removeItem('luckyItem');
            localStorage.removeItem('deathItem');
            getItemsButton.disabled = false;
            getItemsButton.textContent = 'うらなう';
            closeModal();
            countdownSpan.textContent = ''; // cd-clear
        } else {
            alert("( 'ω')🖕");
        }
    }

    getItemsButton.addEventListener('click', setItems);
    resetButton.addEventListener('click', resetItems);
    shareButton.addEventListener('click', () => {
        const luckyItem = luckySpan.textContent;
        const deathItem = deathSpan.textContent;
        const tweetText = `今日のラッキーアイテム: ${luckyItem}\nデスアイテム: ${deathItem}\n\n#ｺﾞｿ占い\nhttps://bit.ly/uranai-goso`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(twitterUrl, '_blank');
    });

    submitButton.addEventListener('click', submitPassword);
    closeModalButton.addEventListener('click', closeModal);

    checkButtonState();
});
