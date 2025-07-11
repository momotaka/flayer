class FlyerChatBot {
    constructor() {
        this.questions = [
            {
                id: 'overview',
                text: '【1/8 サービス概要】\n\nどんなサービス・商品のチラシを作りたいですか？\n簡単で構いませんので教えてください。',
                key: 'サービス概要',
                isInitial: true
            },
            {
                id: 'purpose',
                text: '【2/8 目的】\n\nこのチラシで何を達成したいですか？\n例：問い合わせ、申込、来店など',
                key: '目的・ゴール',
                subQuestions: [
                    'チラシを見た人にどんな行動をしてほしいですか？'
                ]
            },
            {
                id: 'target',
                text: '【3/8 ターゲット】\n\n誰に向けたチラシにしますか？\n例：30代主婦、中小企業の経営者など',
                key: 'ターゲット',
                subQuestions: [
                    'その方々はどんな悩みを抱えていると思いますか？'
                ]
            },
            {
                id: 'service_detail',
                text: '【4/8 詳細】\n\nさらに詳しく教えてください。',
                key: '商品・サービス詳細',
                isDynamic: true,
                subQuestions: [
                    'どんな悩みを解決できますか？',
                    '他社と比べた強みは何ですか？'
                ]
            },
            {
                id: 'pricing',
                text: '【5/8 料金】\n\n価格や料金プランを教えてください。',
                key: '料金・提供条件',
                subQuestions: [
                    '購入・利用の流れはどうなりますか？'
                ]
            },
            {
                id: 'trust',
                text: '【6/8 実績】\n\n実績や数字はありますか？\n例：創業10年、導入500社など',
                key: '信頼性・実績',
                subQuestions: [
                    'お客様の声や成功事例はありますか？'
                ]
            },
            {
                id: 'cta',
                text: '【7/8 連絡先】\n\n連絡方法を教えてください。\n例：電話番号、メール、LINEなど',
                key: '連絡先・申込方法'
            },
            {
                id: 'design',
                text: '【8/8 デザイン】\n\nどんな印象のチラシにしたいですか？\n例：親しみやすい、高級感など',
                key: 'デザイン・雰囲気',
                subQuestions: [
                    '強調したいキーワードはありますか？'
                ]
            }
        ];
        
        this.currentSubQuestionIndex = 0;
        
        this.currentQuestionIndex = -1;
        this.answers = {};
        this.started = false;
        this.isProcessing = false;
        this.conversationHistory = [];
        
        this.initializeElements();
        this.setupEventListeners();
        
        // 自動で最初の質問を表示
        setTimeout(() => {
            this.showFirstQuestion();
        }, 500);
    }
    
    initializeElements() {
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');
        this.downloadContainer = document.getElementById('download-container');
        this.downloadButton = document.getElementById('download-button');
        this.restartButton = document.getElementById('restart-button');
        this.questionArea = document.getElementById('question-area');
        this.currentQuestionEl = document.getElementById('current-question');
        this.answerArea = document.getElementById('answer-area');
        this.aiResponseEl = document.getElementById('ai-response');
        this.thinkingArea = document.getElementById('thinking-area');
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
    
    showFirstQuestion() {
        this.started = true;
        this.currentQuestionIndex = 0;
        const firstQuestion = this.questions[0];
        this.displayQuestion(firstQuestion.text);
        this.questionArea.style.display = 'block';
    }
    
    displayQuestion(questionText) {
        this.currentQuestionEl.innerHTML = questionText.replace(/\n/g, '<br>');
        console.log('質問を表示:', questionText);
    }
    
    async handleUserInput() {
        const input = this.userInput.value.trim();
        if (!input || this.isProcessing) return;
        
        this.userInput.value = '';
        this.isProcessing = true;
        this.toggleInput(false);
        
        // 回答エリアをクリア
        this.answerArea.style.display = 'none';
        
        await this.sendToAI(input);
    }
    
    showThinkingIndicator() {
        this.thinkingArea.style.display = 'flex';
    }
    
    hideThinkingIndicator() {
        this.thinkingArea.style.display = 'none';
    }
    
    async sendToAI(message, isStart = false) {
        try {
            // 考え中表示を追加
            this.showThinkingIndicator();
            const context = {
                currentQuestionIndex: this.currentQuestionIndex,
                answers: this.answers,
                questions: this.questions,
                isStart: isStart,
                allQuestionsAnswered: this.currentQuestionIndex >= this.questions.length - 1,
                serviceOverview: this.answers['サービス概要'] || null
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
            
            // 考え中表示を削除
            this.hideThinkingIndicator();
            
            if (data.error) {
                // デバッグ情報を含むエラー
                let errorMsg = data.error;
                if (data.file && data.line) {
                    console.error(`PHPエラー: ${data.file}:${data.line}`);
                }
                throw new Error(errorMsg);
            }
            
            // AIの応答を表示
            this.aiResponseEl.innerHTML = data.response.replace(/\n/g, '<br>');
            this.answerArea.style.display = 'block';
            
            // AIの応答に基づいて質問の進行を管理
            if (false) { // isStartは不要になったため
                // この部分は使用しない
            } else {
                // ユーザーの回答を保存
                if (this.currentQuestionIndex >= 0 && this.currentQuestionIndex < this.questions.length) {
                    const currentQuestion = this.questions[this.currentQuestionIndex];
                    this.answers[currentQuestion.key] = message;
                    
                    // 常に次の質問へ進む（AIは確認と補足のみ）
                    this.currentQuestionIndex++;
                    console.log('次の質問へ進む: ', this.currentQuestionIndex);
                    
                    if (this.currentQuestionIndex < this.questions.length) {
                        const nextQuestion = this.questions[this.currentQuestionIndex];
                        setTimeout(() => {
                            // 動的な質問の場合、サービスに合わせてカスタマイズ
                            if (nextQuestion.isDynamic && this.answers['サービス概要']) {
                                const serviceInfo = this.answers['サービス概要'];
                                const customQuestion = `【4/8 詳細】\n\n${serviceInfo}についてさらに詳しく教えてください。`;
                                this.displayQuestion(customQuestion);
                                console.log('カスタム質問を表示:', customQuestion);
                            } else {
                                this.displayQuestion(nextQuestion.text);
                                console.log('通常の質問を表示:', nextQuestion.text);
                            }
                            this.isProcessing = false;
                            this.toggleInput(true);
                        }, 1000);
                    } else {
                        // 全質問終了
                        console.log('全質問終了、チラシ生成へ');
                        setTimeout(() => {
                            this.generateFlyer();
                        }, 1000);
                    }
                } else {
                    this.isProcessing = false;
                    this.toggleInput(true);
                }
            }
            
        } catch (error) {
            // エラー時も考え中表示を削除
            this.hideThinkingIndicator();
            
            console.error('AI通信エラー:', error);
            let errorMessage = 'エラーが発生しました: ' + error.message;
            
            // より親切なエラーメッセージ
            if (error.message.includes('.env')) {
                errorMessage = 'APIの設定が必要です。\n\n1. .env.exampleを.envにコピー\n2. APIキー、モデル名、エンドポイントを設定\n3. ページを再読み込み';
            } else if (error.message.includes('429')) {
                errorMessage = 'OpenAI APIの利用制限に達しました。\n\n対処法：\n1. https://platform.openai.com/usage で利用状況を確認\n2. 支払い情報を更新するか、別のAPIキーを使用\n3. モデル名を確認（gpt-3.5-turbo または gpt-4o-mini）';
            } else if (error.message.includes('quota')) {
                errorMessage = 'APIクォータを超過しました。\n\n対処法：\n1. OpenAIアカウントの支払い設定を確認\n2. 無料枠を使い切った可能性があります\n3. README_ALTERNATIVES.mdで代替案を確認';
            }
            
            this.aiResponseEl.innerHTML = errorMessage.replace(/\n/g, '<br>');
            this.answerArea.style.display = 'block';
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
        this.questionArea.style.display = 'none';
        this.answerArea.style.display = 'none';
        this.showThinkingIndicator();
        
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
                // デバッグ情報を含むエラー
                let errorMsg = data.error;
                if (data.file && data.line) {
                    console.error(`PHPエラー: ${data.file}:${data.line}`);
                }
                throw new Error(errorMsg);
            }
            
            this.hideThinkingIndicator();
            this.aiResponseEl.innerHTML = `<h2>チラシ案が完成しました！</h2><br><div class="flyer-content">${data.response.replace(/\n/g, '<br>')}</div>`;
            this.answerArea.style.display = 'block';
            this.flyerContent = data.response;
            this.showDownloadOptions();
            
        } catch (error) {
            console.error('チラシ生成エラー:', error);
            this.hideThinkingIndicator();
            // フォールバックとして従来の生成方法を使用
            const flyerContent = this.createFlyerContent();
            this.aiResponseEl.innerHTML = `<h2>チラシ案</h2><br><div class="flyer-content">${flyerContent.replace(/\n/g, '<br>')}</div>`;
            this.answerArea.style.display = 'block';
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
    
    // チャット関連のメソッドは不要なので削除
    
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
        this.aiResponseEl.innerHTML = '';
        this.answerArea.style.display = 'none';
        this.downloadContainer.style.display = 'none';
        this.questionArea.style.display = 'none';
        this.toggleInput(true);
        
        // 自動で最初の質問を表示
        setTimeout(() => {
            this.showFirstQuestion();
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FlyerChatBot();
});