const API_BASE_URL = 'https://nengajo-api.ataro-999-qqq.workers.dev';
    const answers = {
        accept: null,
        name: null,
        design: null,
        delivery: null,
        digitalType: null,
        addressConfirmed: null
    };
    function showStep(stepId) {
        const steps = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'stepEnd'];
        steps.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = (id === stepId) ? 'block' : 'none';
        });
    }
    async function submitData() {
        try {
            await fetch(`${API_BASE_URL}/api/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(answers)
            });
        } catch (e) {
            alert('送信時にエラーが発生しました。');
        }
        showStep('stepEnd');
    }
    function answerQ1(val) {
        answers.accept = val;
        if (val === 'はい') {
            showStep('step2');
        } else {
            submitData();
        }
    }
    function answerQ2() {
        const nameVal = document.getElementById('inputName').value.trim();
        if (!nameVal) {
            alert('氏名を入力してください。');
            return;
        }
        answers.name = nameVal;
        showStep('step3');
    }
    function answerQ3(val) {
        answers.design = val;
        showStep('step4');
    }
    function answerQ4(val) {
        answers.delivery = val;
        if (val === '郵送') {
            showStep('step6');
        } else if (val === 'デジタル送信') {
            showStep('step5');
        } else if (val === '手渡し') {
            submitData();
        }
    }
    function answerQ5(val) {
        answers.digitalType = val;
        submitData();
    }
    function answerQ6(val) {
        answers.addressConfirmed = val;
        submitData();
    }
    async function loadResults() {
        const container = document.getElementById('resultsContainer');
        container.innerText = 'データ取得中...';
        try {
            const res = await fetch(`${API_BASE_URL}/api/results`);
            if (res.status === 401 || res.status === 403) {
                container.innerText = '認証が必要です。認証用ページを開きます...';
                window.location.href = `${API_BASE_URL}/api/results`;
                return;
            }
            if (!res.ok) {
                throw new Error('取得失敗');
            }
            const data = await res.json();
            if (!data || data.length === 0) {
                container.innerText = '回答データはまだありません。';
                return;
            }
            let html = '<table border="1" cellpadding="5" cellspacing="0">';
            html += '<tr><th>ID</th><th>日時</th><th>受け取り</th><th>氏名</th><th>図柄</th><th>お届け方法</th><th>デジタル種別</th><th>住所伝達確認</th></tr>';
            data.forEach(row => {
                html += `<tr>
                    <td>${row.id || ''}</td>
                    <td>${row.created_at || ''}</td>
                    <td>${row.accept || ''}</td>
                    <td>${row.name || ''}</td>
                    <td>${row.design || ''}</td>
                    <td>${row.delivery || ''}</td>
                    <td>${row.digital_type || ''}</td>
                    <td>${row.address_confirmed || ''}</td>
                </tr>`;
            });
            html += '</table>';
            container.innerHTML = html;
        } catch (e) {
            container.innerText = 'データの取得に失敗しました。';
        }
    }
