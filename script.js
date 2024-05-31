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

    function checkButtonState() {
        const lastClickTime = localStorage.getItem('lastClickTime');
        if (lastClickTime) {
            const lastClickDate = new Date(lastClickTime);
            const now = new Date();
            const oneDay = 24 * 60 * 60 * 1000;

            if (now - lastClickDate < oneDay) {
                getItemsButton.disabled = true;
                getItemsButton.textContent = '一日に一回のみ押せます';
            }
        }
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
