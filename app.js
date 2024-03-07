$(function () {
    $('input[type="text"],input[type="email"],select,textarea').on('blur', function () {
        // バリデーション実行
        validate(this);
    });
    // submit時フォームの要素数分、バリデーションを実行
    $('form').on('submit', function (e) {
        // submitキャンセルフラグ
        let preventSubmitFlag = false;
        $.each($('input[type="text"],input[type="email"],select,textarea'), function (_, element) {
            const isErrorNone = validate($(element));
            if (!isErrorNone) {
                // エラーがある場合
                // submitをキャンセル
                preventSubmitFlag = true;
            }
        });

        // 「得意な言語」用に別処理を用意
        const checkedLanguages = $('input[name="language"]').get().filter(data => $(data).prop('checked'));
        // divタグだが、valを設定（チェックされた要素の配列）
        $('#favoriteLanguage').val(checkedLanguages);
        // 「得意な言語」を指定してバリデーションを実行
        const isErrorNone = validate($('#favoriteLanguage'));
        if (!isErrorNone) {
            // エラーがある場合
            // submitをキャンセル
            preventSubmitFlag = true;
        }

        if (preventSubmitFlag) {
            // submitをキャンセル  
            e.preventDefault();
        }

    });

    // 得意な言語のエラー情報クリア
    // エラーになっている状態で、3つ以上の選択をするとエラー情報が消える
    $('input[name="language"]').on('click', function () {
        const checkedLanguages = $('input[name="language"]').get().filter(data => $(data).prop('checked'));
        if (checkedLanguages.length >= VALIDATION_TARGETS.favoriteLanguage.rules.minCheck) {
            clearError('#favoriteLanguage');
        }
    })
});

/**
 * バリデーションを実行する
 * @param validateTarget : バリデーション対象
 * @return バリデーション結果
 */
function validate(validateTarget) {
    // 対象項目のid
    const itemId = $(validateTarget).prop('id');
    // 対象項目のclassの一覧
    const classNameArray = $(validateTarget).prop('class').split(' ');
    // バリデーションルールの一覧
    const validateRules = VALIDATION_TARGETS[itemId].rules;
    // エラーなしかどうか
    let isErrorNone = true;
    // 取得したクラス数分、チェック処理を実施
    for (const className of classNameArray) {
        if (validateRules.hasOwnProperty(className)) {
            // ルールとclassが一致する場合
            // バリデーションチェック処理
            const validateAction = VALIDATE_ACTION[className];
            // バリデーションルール
            const rule = validateRules[className];
            // チェック結果
            const isValid = validateAction($(validateTarget).val(), rule);
            if (!isValid) {
                // チェック結果、エラーの場合
                isErrorNone = false;
                // エラー用スタイルを設定
                $(validateTarget).css('border', '3px solid #f00');
                $(validateTarget).css('background', '#fee');
                // エラーメッセージを出力
                const getErrorMessage = ERROR_MESSAGES[className];
                const errorMessage = getErrorMessage(VALIDATION_TARGETS[itemId].itemName, rule);
                const errorTag = `<div class="Validate-Error" style="color: #f00;margin-left:290px">${errorMessage}</div>`;
                $(validateTarget).closest('.Form-Item').next('.Validate-Error').remove();
                $(validateTarget).closest('.Form-Item').after(errorTag);
            }
        }
    }
    if (isErrorNone) {
        // バリデーションエラーなしの場合
        // エラー情報をクリア
        clearError(validateTarget);

    }

    return isErrorNone;
}

/**
 * エラー情報をクリアする。
 * @param validateTarget:バリデーション対象 
 */
function clearError(validateTarget) {
    $(validateTarget).closest('.Form-Item').next('.Validate-Error').remove();
    $(validateTarget).css('border', '');
    $(validateTarget).css('background', '');
}
/** バリデーションの対象 */
const VALIDATION_TARGETS = {
    fullName: {
        itemName: '氏名'
        , rules: {
            required: true
            , maxLength: 30
        }
    }
    , phoneNumber: {
        itemName: '電話番号'
        , rules: {
            tel: /^0[-\d]{11,12}$/
        }
    }
    , emailAddress: {
        itemName: 'メールアドレス'
        , rules: {
            required: true
            , email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }
    }
    , age: {
        itemName: '年代'
        , rules: {
            required: true
        }
    }
    , favoriteLanguage: {
        itemName: '得意な言語'
        , rules: {
            required: true
            , minCheck: 3
        }
    }
    , inquiryDetail: {
        itemName: 'お問い合わせ内容'
        , rules: {
            required: true
            , maxLength: 300
            , minLength: 5
        }
    }
};

/** エラーメッセージ返却用定数 */
const ERROR_MESSAGES = {
    /** 必須入力用メッセージ */
    required(itemName) { return `${itemName}は必須入力です。` }
    /** 最大入力文字数用メッセージ */
    , maxLength(itemName, maxLength) { return `${itemName}は${maxLength}文字以内で入力してください。` }
    /** 最小入力文字数用メッセージ */
    , minLength(itemName, minLength) { return `${itemName}は${minLength}文字以内で入力してください。` }
    /** 電話番号用メッセージ */
    , tel() { return `ハイフンを含む半角数字で入力してください。` }
    /** メールアドレス用メッセージ */
    , email() { return `メールアドレスの書式で入力してください。` }
    /** 最小選択数用メッセージ */
    , minCheck(itemName, minCheck) { return `${itemName}は少なくとも${minCheck}個以上選択してください。` }
};

/** バリデーションチェック処理返却用定数 */
const VALIDATE_ACTION = {
    /** 必須入力チェック
     * @param val:入力値
     * @return valが空でない場合true
     */
    required(val) { return $.trim(val); }
    /** 文字数上限チェック
     * @param val:入力値
     * @param maxLength:最大入力文字数
     * @return 入力値が最大入力文字数以下ならtrue
     */
    , maxLength(val, maxLength) { return val.length <= maxLength; }
    /** 文字数下限チェック
     * @param val:入力値
     * @param minLength:最小入力文字数
     * @return valが最小入力文字数以上ならtrue
     */
    , minLength(val, minLength) { return val.length >= minLength; }
    /** 電話番号チェック
     * @param val:入力値
     * @return ハイフン区切りの半角数字ならtrue（空文字ならtrue）
     */
    , tel(val, phoneRegex) { return $.trim(val) ? phoneRegex.test(val) : true; }
    /** メールアドレスチェック
     * @param val:入力値
     * @return メールアドレスの形式ならtrue（空文字ならtrue）
     */
    , email(val, emailRegex) { return $.trim(val) ? emailRegex.test(val) : true; }
    /** 選択数下限チェック
     * @param val:入力値
     * @param minCheck:最小選択数
     * @return 入力値の選択数が最小選択数以上ならtrue
     */
    , minCheck(val, minCheck) { return val.length >= minCheck; }
};