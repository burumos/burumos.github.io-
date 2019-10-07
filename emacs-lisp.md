# emacs lisp

# start
## 参考
- (Programming in Emacs Lisp: Table of Contents)
  [http://www.math.s.chiba-u.ac.jp/~matsu/lisp/emacs-lisp-intro-jp_toc.html]
- ([Home] Emacsビギナー)
  [https://www.emacswiki.org/emacs/Emacs%E3%83%93%E3%82%AE%E3%83%8A%E3%83%BC]])
- (Elisp Programming)[https://caiorss.github.io/Emacs-Elisp-Programming/Elisp_Programming.html]

## 用語
- リージョン
    選択範囲・選択部分
- ポイント
    リージョンの端でカーソルの方
- マーク
    リージョンの端のもう一方
- キル kill
    切り取り
- ヤンク yank
    貼り付け
- キルリング
    killしたリスト
- キーシーケンス
    ショートカット
- フレーム
    ウィンドウ
- ウィンドウ
    フレームの中の区画(サブフレーム)
- モードライン
    ウィンドウ下のテキスト
- ミニバッファ
    コマンドを入力するフレーム一番下の特殊なバッファ
- テキストカーソル
    テキストが挿入される位置
- アボート
    アクションのキャンセル。C-g

## help command
- describe-key
    キーバインドに紐付く動作内容を説明
- where-is
    コマンドに紐付くキーバインド等を表示
- describe-function
    コマンドやその他の機能についての説明
- apropos
    指定された文字列を含むコマンドの一覧を表示
- describe-mode
    カレントバッファのモードを表示
- info
    インフォページを表示

# 構文
## 変数定義
- `(set 'VAR VALUE)`
- `(setq VAR VALUE)`
    - 第1引数に'がいらない
    - 複数の値をそれぞれのシンボルに束縛できる
      ```lisp
      (setq var1 "val1"
            var2 "val2")
      ```
- `(defvar SYMBOl VALUE "DESCRIBE")`
    変数が未束縛の場合のみ束縛する. `describe`が`*`から始まると
    `edit-options`で設定できる
- `(defconst SYMBOL INITVALUE [DOCSTRING])`
- `(let VARLIST BODY...)`

## 関数定義
```lisp
(defun 関数名 (引数...)
    "オプションの説明文字列..."
    (interactive 引数情報) ;; 省略可能
    本体...)
```
`&optional`以降の引数は省略可能になる

- `(lambda ARGS [DOCSTRING] [INTERACTIVE] BODY)`
    無名関数

### interactiveの引数
コマンド実行時の引数をどのような値かを指定
- `B` バッファ(存在しなくてもよい)
- `b` バッファ(存在しないとエラー)
- `p` 前置引数.C-uまたはM-に続く値を渡す
- `*` read-only時にエラー
- `c` プロンプトに1文字を入力させる

### 高階関数
- `(funcall FUNCTION &rest ARGUMENTS)`
  - 例1
    ```lisp
    (let ((fu (lambda(x) (message "message: '%s'" x))))
        (funcall fu "www"))
    ```
  - 例2 `((lambda (func) (funcall func "eee")) 'print)`
- `(apply FUNCTION &rest ARGUMENTS)`
    ```lisp
    function fun1(arg1) {
        let x = 1;
        if (arg1) {
            return;
        }
    }
    ```
- `(eval FORM &optional LEXICAL)`
    S式(`'(+ 1 1)`等)を評価する

### 別名定義
```lisp
(require 'cl)
(defalias 'map 'mapcar) ;; 別名で定義できる
```
## 分岐
- `(if COND THEN ELSE...)`
    CONDが非nilの場合はTHENを実行し、nilの場合はELSEを実行する
- `(when COND BODY...)`
    CONDが非nilの場合はBODYを実行する
- `(cond (TEST EXP) (TEST EXP)...)`
     TESTが非nilを返すまで順にチェックし、非nilを返したTESTのEXPを実行
     する
- `(cl-case EXPR (KEYLIST BODY...)...)`
    switch文. EXPRと等しいKEYLISTのBODYを実行する

## loop
- `(while TEST BODY)`
    TESTが`nil`を返すまでBODYを繰替えす
- `(dolist (VAR LIST [RESULT]) BODY...)`
    LISTの各要素でVARを束縛しBODYをそれぞれ実行する
- `(dotimes (VAR COUNT [RESULT]) BODY...)`
    COUNT分、実行する
- `(loop CLAUSE...)`
    `(return)`で抜けるまで繰替えす
- `(loop for VAR from FROM to To BODY...)`
- do
    ```lisp
    (do ((i 0 (1+ i)))
        ((>= i 4))
        (print 1))
    ```
## 他
- `(prog1 本体...)`
    本体の式をすべて評価し、最初に評価した式の結果を返す

# リテラル・オブジェクト
## リテラル・オブジェクト一覧
- Pair/cons cell `'(a .  b)`
- List `'(1 2 3)`
- Vector `[1 2 3]`
- Nil `nil`
- Number `1`
- String `"a"`
- Symbol `'a :a`
- Atom listとpair以外のリテラル
- Buffer
- Window
- Frame
- Process

## 等価比較関数
- `(= NUMBER-OR-MARKER &rest NUMBERS-OR-MARKERS)`
    数値の等価
- `(eq OBJ1 OBJ2)`
    数値またはシンボルの等価
- `(equal O1 O2)`
    リストの等価
- `string=`
    文字列の等価

## List
- `(length SEQUENCE)`
    長さ
- `(nth N LIST)`
    N番目の値
- `(member ELT LIST)`
    LISTにELTが含まれるかtest
- `(position ITEM SEQ [KEYWORD VALUE]...)`
    ITEMが何番目の値か(1start)
- `(cl-position ITEM SEQ [KEYWORD VALUE]...)`
    ITEMが何番目の値か(0start)
- `(car LIST)`
- `(cdr LIST)`
- `(cons CAR CDR)`
- `(reverse SEQ)`
- `(append &rest SEQUENCES)`
    複数のリストを結合したリストを返す
- `(remove-if-not PREDICATE SEQ [KEYWORD VALUE]...)`
    filter
- `(mapcar FUNCTION SEQUENCE)`
    SEQUENCEの各要素にFUNCTIONを適用した結果を返す
- `(null OBJECT)`
    空チェック
- `(nthcdr N LIST)`
    N番目以降のリスト
- `(delq ELT LIST)`
    ELTをLISTから削除する破壊関数(sublistは削除できない=>deleteを使え)
- `(coerce VECTOR 'list)`
    ベクトルをリストに変換('vectorを指定するば逆変換)
- `(number-sequence FROM &optional TO INC)`
    FROMからTOまでINC刻みのリストを作成
- `(push NEWELT PLACE)`
    NEWELTを先頭に追加(破壊関数)
- `(pop PLACE)`
    先頭の値を返し、PLACEから削除する(破壊関数)
- `(setcdr cell new-cdr)`
    cdrを付け替え(破壊関数)
- `(sort SEQ PREDICATE)`
    並び換え

## 文字列
- `(split-string STRING &optional SEPARATORS OMIT-NULLS TRIM)`
    文字列を分割(SEPARATORSのデフォルトはスペース)
- `(format-time-string FORMAT-STRING &optional TIME ZONE)`
    時間をフォーマットして表示 (ex `%Y/%m/%d %H:%M:%S`)
- `(concat &rest SEQUENCES)`
    連結
- `(mapconcat FUNCTION SEQUENCE SEPARATOR)`
    SEQUENCEの各要素にFUNCTIONを適用してSEPARATORを挟んで連結
    (identity関数を使えばSEPARATORで挟むだけもできる)
- `(substring STRING &optional FROM TO)`
    部分文字列の取得
- `(string-width STRING)`
    文字列長
- `(string-match REGEXP STRING &optional START)`
    正規表現でマッチした文字列の1文字目の位置を返す
- `(make-string LENGTH INIT)`
    文字列を作成. INITは文字(`?x`など)
- `(replace-regexp-in-string REGEXP REP STRING &optional FIXEDCASE
    LITERAL SUBEXP START)`
    STRING内で置き換え
- `(read-from-string STRING &optional START END)`
    STRINGをS式に変換する
- `(read &optional STREAM)`
    S式としてパース
- `(prin1-to-string OBJECT &optional NOESCAPE)`
    S式を文字列に変換

## シンボル
- `(symbol-name SYMBOL)`
    シンボルを文字列に変換
- `(intern STRING &optional OBARRAY)`
    文字列をシンボルに変換
- `(boundp SYMBOL)`
    シンボルが値で束縛されているかテスト
- `(symbol-value SYMBOL)`
    シンボルの値を返す
- `(symbol-function SYMBOL)`
    シンボルの関数を返す
- `(symbol-plist SYMBOL)`
    シンボルのplistを返す


## 未判別
- `(type-of OBJECT)`
    OBJECTのタイプを返す(stringとかintegerとか)
- `(numberp OBJECT)`
- `(stringp OBJECT)`
- `(symbolp OBJECT)`
- `(listp OBJECT)`
- `(vectorp OBJECT)`
- `(number-to-string NUMBER)`
    数値->文字列に変換する
- `(string-to-number STRING)`
    文字列->数値
- `(prefix-numeric-value arg)`
    argを数値に変換する(interactiveで"p"を指定したときに使用)

# データ構造
## plist
`'(key1 value1 key2 value2 ...)`

- `(plist-get PLIST KEY)`
    値を取得
- `(plist-put PLIST KEY VAL)`
    設定
- `(plist-member PLIST KEY)`
    指定したKEYで値が設定されているか

## clist
`'((key1 . value1) (key1 .  value2) ...)`
連想配列(Asscociation List)で使用する

- `(assoc KEY LIST &optional TESTFN)`
    KEYをキーとするペアを返す
- `(mapcar #'car LIST)`
    全てのキーを取得

## plist<->alist
```lisp
(defun plist->alist (plist)
  (if (null plist)
      '()
      (cons
       (list (car plist) (cadr plist))
       (plist->alist (cddr plist)))))

(defun alist->plist (assocl)
  (if (null assocl)
      '()
    (let
    ((hd (car assocl))
     (tl (cdr assocl)))
      (cons (car hd)
        (cons (cadr hd)
          (alist->plist tl))))))
```


## 構造体
### 定義関数
`(defstruct NAME SLOTS...)`

### 使い方
```lisp
(defstruct account id name)
(setq user1 (make-account :id 123 :name "Taro"))
(account-id user1) ;; =123
(account-p user1) ;; =t
(setf (account-id user1) 10) ;; set
```
# buffer
## buffer情報
- `(buffer-size)`
    文字数を返す
- `(buffer-list &optional FRAME)`
    開いているバッファを全て取得
- `(current-buffer)`
    今のバッファを取得
- `(buffer-name &optional BUFFER)`
    バッファ名を取得
- `(buffer-file-name &optional BUFFER)`
    ファイル名を取得

## buffer操作
- `(get-buffer BUFFER-OR-NAME)`
    名前からbufferを取得. なければnil
- `(get-buffer-create BUFFER-OR-NAME)`
    名前からbufferを取得. なければ作成
- `(find-file FILENAME &optional WILDCARDS)`
    ファイルを開いてbufferを返す
- `(other-buffer)`
    最近行って戻って来たバッファを返す
- `(switch-buffer buffer)`
    表示しているバッファをbufferに切り替える
- `(set-buffer buffer)`
    プログラムの立場でバッファをbufferに切り替える
- `(switch-to-buffer-other-window BUFFER-OR-NAME &optional NORECORD)`
    指定バッファを別ウィンドウに表示
- `(kill-buffer &optional BUFFER-OR-NAME)`
    bufferを閉じる

## mini-buffer
- `(query-replace-read-args PROMPT REGEXP-FLAG &optional NOERROR)`
    mini bufferでreplace-stringみたいな感じで尋ねる
- `(message FORMAT-STRING &rest ARGS)`
    mini bufferに出力

## ナローイング
バッファの指定部分以外を編集不可にし、非表示にする
- `(save-restriction 本体...)`
    ナローイングの状態を保持. `save-excursion`と共に使う場合は
    `(save-excursion (save-restriction 本体...))`でなければ失敗する
- `(widen)`
    ナローイングの状態の解除
- `(narrow-to-regin start end)`
    選択範囲をナローイングする

# point/mark/region
## 位置情報
- `(point-min)`
    現在のbufferでポイントが移動できる最小の位置
- `(point-max)`
    現在のbufferでポイントが移動できる最大の位置
- `(line-beginning-position)`
    ポイントがある行の行頭の位置
- `(line-end-position)`
    ポイントがある行の行末の位置
- `(region-beginning)`
    リージョンの開始位置
- `(region-end)`
    リージョンの終了位置
- `(bounds-of-thing-at-point THING)`
    指定した対象の始まりと終りの位置のペア
- `(eodp)`
    ポイントがそのバッファのアクセス可能な最大位置にある場合`t`を返す.
    ナローイングがかかっていた場合はその範囲内で最大範囲かテストする.

## 操作
- `(goto-char POSITION)`
    pointを移動
- `(beginning-of-buffer &optional ARG)`
    カーソルをバッファの先頭に移動させ、以前の位置にマークを置く
- `(push-mark number)`
    numberの位置をマークに設定する(nilでカーソル位置)
- `(beginning-of-line number)`
    行頭にカーソルを移動.2以上が指定されていればその分下の行頭に
- `(search-forward STRING &optional BOUND NOERROR COUNT)`
    STRINGを探しその文字列の最初の文字にポイントを移動させ,移動後のポ
    インを返す
    - BOUND 検索範囲
    - NOERROR 非nilでエラーを出さない
    - COUNT 何回目に表われたSTRINGにポイントを移すか(負だとback)

## contentsに対する操作
### 取得
- `(buffer-substring-no-properties START END)`
    バッファ内の内容を取得
- `(thing-at-point THING &optional NO-PROPERTIES)`
    THINGで指定し内容を取得
- `(buffer-substring START END)`
    STARTからENDまでのテキストを取得
- `(buffer-substring-no-properties START END)`
    STARTからENDまでのテキストを取得(2点間の大小関係でエラーにならない)

### 挿入
- `(insert &rest ARGS)`
    point後に文字列を挿入
- `(insert-buffer BUFFER-NAME)`
    指定したbufferの内容をpoint後に挿入
- `(insert-buffer-substring BUFFER START END)`
    カーソル位置にbufferのstartからendまでの文字列を挿入

### 削除
- `(erase-buffer)`
    今開いているバッファの全内容を削除する
- `(delete-region START END)`
    指定範囲を削除

### 維持
- `(with-current-buffer BUFFER-OR-NAME &rest BODY)`
    指定したバッファでBODYを評価する
- `(with-temp-buffer &rest BODY)`
    一時的なバッファを作成しBODYを実行
- `(save-excursion &rest BODY)`
    ポイントと今のバッファを保存し、値を返すときに元に戻す


# system変数・関数
## kill
- `kill-ring`
    - キルリングが格納されている変数
    - 操作例
      ```lisp
      (setq kill-ring
          (cons (buffer-substring beg end) kill-ring))
      (if (> (length kill-ring) kill-ring-max)
          (setcdr (nthcdr (1- kill-ring-max) kill-ring) nil))
      ```
- `(kill-region START END (&optional REGION))`
    STARTからENDまでキル(切り取り)する。
- `(char-to-string CHAR)`
    文字を文字列に変換する
- `(copy-region-as-kill BEG END &optional REGION)`
    BEGからENDまでをキルリングに入れる
- `kill-ring-yank-pointer`
    次にヤンクされる文字列を差すポインタ
- `(kill-append STRING BEFORE-P)`
    STRINGをキルリングの最新の文字列の後部に追加する
    - BEFORE-P 非nilで前部に追加
## message-box
- `(message-box FORMAT-STRING &rest ARGS)`
    可能であればダイアログ

## file, directory
- `(pwd)`
- `(cd DIR)`
- `(file-name-directory FILENAME)`
    パスを取得
- `(file-name-nondirectory FILENAME)`
    ファイル名だけ取得
- `(file-name-base &optional FILENAME)`
    ディレクトリ、拡張子なしファイル名を取得
- `(expand-file-name NAME &optional DEFAULT-DIRECTORY)`
    ファイル名を展開(`., ~, ..`など)
- `(mkdir DIR &optional PARENTS)`
    ディレクトリを作成
- `(directory-files DIRECTORY &optional FULL MATCH NOSORT)`
    指定したディレクトリのファイル名を全て取得

### read/write
- `(insert-file-contents FILENAME &optional VISIT BEG END REPLACE)`
    ファイルの内容をポイント以降に挿入
- `(append-to-file START END FILENAME)`
    指定範囲をファイルに追記する

## window
- `(split-window-horizontally &optional SIZE)`
    window横2つに分割
- `(split-window-vertically &optional SIZE)`
    縦2つに分割
- `(delete-other-windows &optional WINDOW)`
    他のwindowを閉じる
- `(switch-to-buffer-other-window BUFFER-OR-NAME &optional NORECORD)`
    他のwindowに指定したbufferを開く
- `(delete-window &optional WINDOW)`
    今のwindowまたは指定したwindowを閉じる
- `(window-list &optional FRAME MINIBUF WINDOW)`
    windowのリストを取得
- `(window-buffer &optional WINDOW)`
    windowに開いているbufferを取得
- `(current-window-configuration &optional FRAME)`
    window-configurationオブジェクトを取得
- `(set-window-configuration CONFIGURATION)`
    今のwindowにwindow-configurationを設定
- `(balance-windows &optional WINDOW-OR-FRAME)`
    文字サイズを拡大
- `(delete-windows-on &optional BUFFER-OR-NAME FRAME)`
    表示されているwindowを全て閉じる
- `(display-buffer BUFFER-OR-NAME &optional ACTION FRAME)`
    指定したbufferを表示させる?(switch-to-bufferとの違いは?)
- `(shrink-window-if-larger-than-buffer &optional WINDOW)`
    高さを縮める?
- `(other-window-for-scrolling)`
    `scroll-other-window`でスクロールされるwindowを返す
- `(enlarge-window DELTA &optional HORIZONTAL)`
    他のwindowからDELTA分奪ってサイズを大きくする. HORIZONTALが非nilで
    あれば横、nilであれば縦(default nil)
## frame
ー `(make-frame &optional PARAMETERS)`
    新たなframeを立ち上げる
- `(delete-frame &optional FRAME FORCE)`
    frameを閉じる
- `(x-display-pixel-width &optional FRAME)`
    frameの横幅を返す
- `(x-display-pixel-height &optional FRAME)`
    frameの縦幅を返す
- `(set-frame-width FRAME WIDTH &optional PRETEND PIXELWISE)`
    frameの横幅を設定
- `(set-frame-height FRAME HEIGHT &optional PRETEND PIXELWISE)`
    frameの縦幅を設定
- `(set-frame-position FRAME X Y)`
    frameの位置を設定
- `(selected-frame)`
    今のframeを返す

## system
- `system-type`
    OS名を返す
    (gnu, gnu/linux, gnu/kfreebsd, darwin, ms-dos, windows-nt, cygwin)
- `(current-time)`
    時間
- `(shell-command-to-string COMMAND)`
    シェルコマンドを実行
- `(getenv VARIABLE &optional FRAME)`
    環境変数を取得
- `(setenv VARIABLE &optional VALUE SUBSTITUTE-ENV-VARS)`
    環境変数を設定
- `(run-with-timer SECS REPEAT FUNCTION &rest ARGS)`
    delay実行

### process
- `(call-process PROGRAM &optional INFILE DESTINATION DISPLAY &rest
  ARGS)`
      プロセス呼び出し
- `(get-process NAME)`
    プロセスオブジェクト取得
- `(process-name PROCESS)`
    プロセス名を取得
- `(process-command PROCESS)`
    実行したときのプロセスコマンドを取得
- `(process-id PROCESS)`
    プロセスIDを取得
- `(process-buffer PROCESS)`
    プロセスに関連したbufferを取得する
- `(start-process NAME BUFFER PROGRAM &rest PROGRAM-ARGS)`
    プロセスをスタート
- `(process-send-eof &optional PROCESS)`
    入力がend-of-fileを返すまで監視するプロセスを作る
- `(process-send-string PROCESS STRING)`
    ?


# 正規表現
- `(re-search-forward REGEXP &optional BOUND NOERROR COUNT)`
    正規表現REGEXPでポイント以降を検索し、ヒットした文字列の最初の文字
    にポイントを設定する
- `(match-beginning SUBEXP)`
    最後の正規表現で見つかったテキストの始まりの位置
- `(looking-at REGEXP)`
    ポイントに続くテキストが引数の正規表現にマッチした場合に`t`を返す
- `(match-end SUBEXP)`
- `(re-search-forward REGEXP &optional BOUND NOERROR COUNT)`
- `(replace-regexp-in-string REGEXP REP STRING &optional FIXEDCASE
LITERAL SUBEXP START)`
- `(replace-string FROM-STRING TO-STRING &optional DELIMITED START END
BACKWARD)`
- `(re-builder)`
    build regex interactively
- `(query-replace-regexp)`
    build regex interactively

## special characters
| .       | 改行以外のすべての文字              |
| *       | 直前の文字グループを0回以上繰り返す |
| ?       | 直前の文字グループを0か1回          |
| ^       | 行頭                                |
| $       | 行末                                |
| [...]   | 何れかの文字                        |
| [^...]  | 指定した文字以外                    |
| [a-z]   | a~z                                 |
| \       | 直後の文字は特別な意味を持たない    |
| \｜     | or                                  |
| \w      | 単語の構成文字                      |
| \b      | 単語の境界文字                      |
| \(\)    | グループ                            |
| \<\>    | 単語                                |
| \`\'    | buffer                              |
| \1      | 最初のグループにマッチした文字列    |
| \n      | n番目のグループにマッチした文字列   |
| \{3\}   | 3回繰り返す                         |
| \{4,\}  | 4回以上繰り返す                     |
| \{3,5\} | 3回以上5回以下の繰り返し            |

## POSIX Character classes
| [:digit:]  | 数値[0-9]と同じ                  |
| [:upper:]  | 大英字                           |
| [:space:]  | syntax tableで定義される空白文字 |
| [:xdigit:] | 16進数                           |
| [cntrl]    | control character                |
| [:ascii]   | ascii文字                        |

## Syntax Classes
| \s-  | 空白文字                  |
| \sw  | 単語の構成文字            |
| \s_  | シンボルの構成文字        |
| \s.  | 句読文字                  |
| \s(  | 開きカッコ                |
| \s)  | 閉じカッコ                |
| \s"  | 文字列quote               |
| \s\  | エスケープ                |
| \s/  | 文字quote                 |
| \s$  | paird delimiter           |
| \s'  | 接頭式                    |
| \s<  | コメントの始まり          |
| \s>  | コメントの始まり(終り?)   |
| \s!  | generic comment delimiter |
| \s｜ | generic string delimiter  |


# major-mode
## 変数
- `auto-mode-alist`
    ファイル名とメジャーモードとの関連情報
- `major-mode`
    メジャーモード

## 関連付け
```lisp
(add-to-list 'auto-mode-alist '("\\.md\\'" . markdown-mode))
```

## モード特有キーバインド
```lisp
(define-key emacs-lisp-mode-map (kbd "<f5>") #'show-message)
```

# 特別変数
- `emacs-major-mode`
- `load-path`
- `window-system`
- `system-type`
- `system-configuration`
- `shell-file-name`
- `user-full-name`
- `user-mail-address`
- `user-init-file`
- `user-emacs-directory`
- `exec-directory`
