class FlyerChatBot {
    constructor() {
        this.questions = [
            {
                id: 'purpose',
                text: '【目的・ゴール】\n\nこのチラシで何を達成したいですか？\n（例：問い合わせ／資料請求／申込／来店／商品購入）\n\nチラシを見た人に、どんな行動をしてほしいですか？',
                key: '目的・ゴール'
            },
            {
                id: 'target',
                text: '【ターゲット（届けたい相手）】\n\n想定している顧客像は？\n（例：個人／法人、年齢層、職種、地域など）\n\nその相手はどんな悩みや課題を抱えていると考えていますか？',
                key: 'ターゲット'
            },
            {
                id: 'service',
                text: '【紹介したい商品・サービスの内容】\n\n商品またはサービスの名称と簡単な説明をお願いします。\nその商品・サービスが「誰のどんな悩みをどう解決するか」を教えてください。\n他社と比べた強み・差別化ポイントも含めてお答えください。',
                key: '商品・サービス内容'
            },
            {
                id: 'pricing',
                text: '【料金・提供条件】\n\n価格や料金プラン、購入・利用の流れを教えてください。\n（例：定額制、初期費用、無料体験あり、申込→訪問→作業 など）',
                key: '料金・提供条件'
            },
            {
                id: 'trust',
                text: '【信頼性・安心感の裏付け】\n\n実績（導入数、創業年数、継続率など）はありますか？\n利用者の声や事例、レビューで使えるものがあれば教えてください。',
                key: '信頼性・実績'
            },
            {
                id: 'cta',
                text: '【行動導線（CTA）】\n\nお客様がすぐにアクションできる連絡方法・申込方法を教えてください。\n（例：電話番号、QRコード、WebサイトURL など）',
                key: '連絡先・申込方法'
            },
            {
                id: 'design',
                text: '【デザイン・雰囲気の希望】\n\nこのチラシはどんな印象にしたいですか？\n（例：安心感がある／元気／上品／親しみやすい）\n強調したいキーワードも教えてください。',
                key: 'デザイン・雰囲気'
            },
            {
                id: 'event',
                text: '【イベント情報（任意）】\n\n商品・サービスのPRイベントを予定していますか？\nある場合は、日時・場所・内容・申込方法を教えてください。\n（ない場合は「なし」と入力してください）',
                key: 'イベント情報'
            }
        ];
        
        this.currentQuestionIndex = -1;
        this.answers = {};
        this.started = false;
        this.isProcessing = false;
        this.conversationHistory = [];
        
        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');
        this.downloadContainer = document.getElementById('download-container');
        this.downloadButton = document.getElementById('download-button');
        this.restartButton = document.getElementById('restart-button');
    }
    
    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleUserInput());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserInput();
            }
        });
        this.downloadButton.addEventListener('click', () => this.downloadFlyer());
        this.restartButton.addEventListener('click', () => this.restart());
    }
    
    async handleUserInput() {
        const input = this.userInput.value.trim();
        if (!input || this.isProcessing) return;
        
        this.addMessage(input, 'user');
        this.userInput.value = '';
        this.isProcessing = true;
        this.toggleInput(false);
        
        if (!this.started) {
            if (input.toLowerCase().includes('開始')) {
                this.started = true;
                await this.sendToAI('開始', true);
            } else {
                this.addMessage('チラシ作成を開始するには「開始」と入力してください。', 'bot');
                this.isProcessing = false;
                this.toggleInput(true);
            }
        } else {
            await this.sendToAI(input);
        }
    }
    
    async sendToAI(message, isStart = false) {
        try {
            const context = {
                currentQuestionIndex: this.currentQuestionIndex,
                answers: this.answers,
                questions: this.questions,
                isStart: isStart,
                allQuestionsAnswered: this.currentQuestionIndex >= this.questions.length - 1
            };
            
            const response = await fetch('chat.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    context: context
                })
            });
            
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました');
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            this.addMessage(data.response, 'bot');
            
            // AIの応答に基づいて質問の進行を管理
            if (isStart) {
                this.currentQuestionIndex++;
                if (this.currentQuestionIndex < this.questions.length) {
                    const question = this.questions[this.currentQuestionIndex];
                    setTimeout(() => {
                        this.addMessage(question.text, 'bot');
                        this.isProcessing = false;
                        this.toggleInput(true);
                    }, 1000);
                }
            } else {
                // ユーザーの回答を保存
                if (this.currentQuestionIndex >= 0 && this.currentQuestionIndex < this.questions.length) {
                    const currentQuestion = this.questions[this.currentQuestionIndex];
                    this.answers[currentQuestion.key] = message;
                    
                    // AIの応答を待って、次の質問に進むかどうか判断
                    setTimeout(() => {
                        // ユーザーが「次へ」「OK」「はい」などの肯定的な返答をした場合、次の質問へ
                        if (data.response.includes('次の質問') || 
                            data.response.includes('それでは次') || 
                            data.response.includes('承知しました') ||
                            data.response.includes('理解しました')) {
                            this.currentQuestionIndex++;
                            if (this.currentQuestionIndex < this.questions.length) {
                                const nextQuestion = this.questions[this.currentQuestionIndex];
                                setTimeout(() => {
                                    this.addMessage(nextQuestion.text, 'bot');
                                    this.isProcessing = false;
                                    this.toggleInput(true);
                                }, 1000);
                            } else {
                                // 全質問終了
                                this.generateFlyer();
                            }
                        } else {
                            // 追加の質問や確認がある場合は、そのまま会話を継続
                            this.isProcessing = false;
                            this.toggleInput(true);
                        }
                    }, 500);
                } else {
                    this.isProcessing = false;
                    this.toggleInput(true);
                }
            }
            
        } catch (error) {
            console.error('AI通信エラー:', error);
            this.addMessage('エラーが発生しました: ' + error.message, 'bot');
            this.isProcessing = false;
            this.toggleInput(true);
        }
    }
    
    toggleInput(enabled) {
        this.userInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
        if (enabled) {
            this.userInput.focus();
        }
    }
    
    showDownloadOptions() {
        this.downloadContainer.style.display = 'block';
        this.scrollToBottom();
        this.isProcessing = false;
        this.toggleInput(true);
    }
    
    async generateFlyer() {
        this.addMessage('回答ありがとうございました！AIがチラシ案を生成しています...', 'bot');
        
        try {
            const finalContext = {
                currentQuestionIndex: this.questions.length,
                answers: this.answers,
                questions: this.questions,
                isGeneratingFlyer: true
            };
            
            const response = await fetch('chat.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'すべての質問への回答が集まりました。これらの情報を基に、魅力的なチラシ案を作成してください。',
                    context: finalContext
                })
            });
            
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました');
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            this.addMessage('チラシ案が完成しました！', 'bot');
            this.addMessage(data.response, 'bot', 'flyer-content');
            this.flyerContent = data.response;
            this.showDownloadOptions();
            
        } catch (error) {
            console.error('チラシ生成エラー:', error);
            this.addMessage('チラシ生成中にエラーが発生しました。', 'bot');
            // フォールバックとして従来の生成方法を使用
            const flyerContent = this.createFlyerContent();
            this.addMessage(flyerContent, 'bot', 'flyer-content');
            this.flyerContent = flyerContent;
            this.showDownloadOptions();
        }
    }
    
    createFlyerContent() {
        const answers = this.answers;
        
        let content = `【チラシ案】\n\n`;
        content += `===============================\n`;
        content += `■ キャッチコピー案\n`;
        content += `===============================\n\n`;
        
        const target = answers['ターゲット'] || '';
        const service = answers['商品・サービス内容'] || '';
        const purpose = answers['目的・ゴール'] || '';
        
        content += `「${this.generateCatchCopy(target, service, purpose)}」\n\n`;
        
        content += `===============================\n`;
        content += `■ チラシ構成案\n`;
        content += `===============================\n\n`;
        
        content += `【1. ヘッダー部分】\n`;
        content += `- メインキャッチコピー（上記）\n`;
        content += `- サービス名・商品名を大きく配置\n`;
        content += `- ${answers['デザイン・雰囲気']}な雰囲気のビジュアル\n\n`;
        
        content += `【2. 問題提起・共感部分】\n`;
        content += `ターゲット：${answers['ターゲット']}\n`;
        content += `「こんなお悩みありませんか？」\n`;
        content += `- ${this.extractProblem(answers['ターゲット'])}\n\n`;
        
        content += `【3. 解決策の提示】\n`;
        content += `${answers['商品・サービス内容']}\n\n`;
        
        content += `【4. 料金・サービス詳細】\n`;
        content += `${answers['料金・提供条件']}\n\n`;
        
        content += `【5. 信頼性・実績】\n`;
        content += `${answers['信頼性・実績']}\n\n`;
        
        if (answers['イベント情報'] && answers['イベント情報'].toLowerCase() !== 'なし') {
            content += `【6. イベント情報】\n`;
            content += `${answers['イベント情報']}\n\n`;
        }
        
        content += `【7. お問い合わせ・行動喚起（CTA）】\n`;
        content += `${answers['連絡先・申込方法']}\n`;
        content += `※${purpose}のために、明確で目立つCTAボタンを配置\n\n`;
        
        content += `===============================\n`;
        content += `■ デザインの方向性\n`;
        content += `===============================\n\n`;
        content += `雰囲気：${answers['デザイン・雰囲気']}\n`;
        content += this.getDesignRecommendation(answers['デザイン・雰囲気']);
        
        return content;
    }
    
    generateCatchCopy(target, service, purpose) {
        const templates = [
            `${target}の皆様へ。${service}で新しい毎日を`,
            `もう悩まない。${service}があなたの味方です`,
            `${target}のための、確かな解決策`,
            `今すぐ始める、${service}という選択`
        ];
        return templates[Math.floor(Math.random() * templates.length)];
    }
    
    extractProblem(target) {
        if (target.includes('悩み') || target.includes('課題')) {
            return target.split('悩み')[1] || target.split('課題')[1] || '日々の課題を解決したい';
        }
        return '現状をもっと良くしたいとお考えの方';
    }
    
    getDesignRecommendation(design) {
        const recommendations = {
            '安心感': '- 青や緑を基調とした落ち着いた配色\n- 余白を活かしたゆったりとしたレイアウト\n- 明朝体などの品格のあるフォント',
            '元気': '- オレンジや黄色などの明るい配色\n- 動きのあるデザイン要素\n- ゴシック体などの力強いフォント',
            '上品': '- 白やグレーを基調としたミニマルな配色\n- シンプルで洗練されたレイアウト\n- 細めの上品なフォント',
            '親しみやすい': '- 暖色系の優しい配色\n- 手書き風の要素やイラスト\n- 丸みのある親しみやすいフォント'
        };
        
        for (const [key, value] of Object.entries(recommendations)) {
            if (design.includes(key)) {
                return value;
            }
        }
        return '- ターゲットに合わせた配色とレイアウト\n- 読みやすさを重視したフォント選び';
    }
    
    addMessage(text, sender, additionalClass = '') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = `message-content ${additionalClass}`;
        contentDiv.innerHTML = text.replace(/\n/g, '<br>');
        
        messageDiv.appendChild(contentDiv);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    downloadFlyer() {
        const flyerContent = this.flyerContent || this.createFlyerContent();
        const formData = new FormData();
        formData.append('content', flyerContent);
        
        fetch('download.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'チラシ案_' + new Date().toISOString().slice(0, 10) + '.txt';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Download error:', error);
            alert('ダウンロードに失敗しました。');
        });
    }
    
    restart() {
        this.currentQuestionIndex = -1;
        this.answers = {};
        this.started = false;
        this.isProcessing = false;
        this.flyerContent = null;
        this.conversationHistory = [];
        this.chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-content">
                    こんにちは！チラシ作成をお手伝いします。<br>
                    これから8つの質問をさせていただきます。<br>
                    準備ができたら「開始」と入力してください。
                </div>
            </div>
        `;
        this.downloadContainer.style.display = 'none';
        this.toggleInput(true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FlyerChatBot();
});