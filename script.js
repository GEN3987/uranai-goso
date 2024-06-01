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

    function calculateResetTime() {
        const now = new Date();
        const resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 0, 0, 0);
        if (now >= resetTime) {
            resetTime.setDate(resetTime.getDate() + 1);
        }
        return resetTime;
    }

    function startCountdown() {
        const resetTime = calculateResetTime();
        const interval = setInterval(() => {
            const now = new Date();
            const timeDifference = resetTime - now;
            if (timeDifference <= 0) {
                clearInterval(interval);
                countdownSpan.textContent = '';
                getItemsButton.disabled = false;
                getItemsButton.textContent = 'アイテムを取得';
                localStorage.removeItem('lastClickTime');
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
            const lastClickDate = new Date(lastClickTime);
            const now = new Date();
            const resetTime = calculateResetTime();

            if (lastClickDate >= resetTime) {
                getItemsButton.disabled = true;
                getItemsButton.textContent = '一日に一回のみ押せます';
            } else {
                getItemsButton.disabled = false;
                getItemsButton.textContent = 'アイテムを取得';
            }
        }
        startCountdown(); // 常にカウントダウンを開始
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
                localStorage.setItem('lastClickTime', now.toISOString());
                getItemsButton.disabled = true;
                getItemsButton.textContent = '一日に一回のみ押せます';

                startCountdown(); // カウントダウンを再開始
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

    function submitPassword() {
        const password = passwordInput.value;
        // パスワードの検証
        if (password === 'goso-goat') {
            localStorage.removeItem('lastClickTime');
            getItemsButton.disabled = false;
            getItemsButton.textContent = 'アイテムを取得';
            closeModal();
            countdownSpan.textContent = ''; // カウントダウンをクリア
        } else {
            alert('パスワードが違います');
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
