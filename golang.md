# first
## command
- 実行 `go run FILE-NAME`
- ビルド `go build [OPTION] FILE-NAME`
- フォーマット `go fmt [PACKAGES]`
- ドキュメント参照 `go doc PACKAGE`
- テスト `go test [PACKAGES]`
    - `-cover` テストカバレッジ率を表示

## go fileの骨組み
```go
// 所属するパッケージ宣言
package main

// 使用するパッケージを指定
import (
    "fmt"
)

// エントリーポイント
func main() { ... }
```

- 1つのディレクトリには1つのパッケージ定義のみ

## test
- `_test.go`はパッケージをテストするためのファイルとして特別扱い

## ベンダリング機能
- 外部パッケージのバージョンを固定する機能
- venderディレクトリ

# 構文
## コメント
- `// comment`
- `/* comment */`

## 文
- 文はセミコロンによって区切られるが省略可能
- `}`や`,`以外で終る場合は文の終端と判断されセミコロンが挿入される

## 変数
### 宣言
```golang
// 明示的
var n int
var (
    x, y int
    name string
)

// 暗黙的
n := 1
```
- ローカル変数： 関数内で定義
- パッケージ変数： 関数定義外で定義

### 代入
```golang
x = 1
x, y = 1, 2
```

### 定数
- `const X = 1`
- `const (X=1; Y=2)`
- `const (X=1; Y, Z=3)` x=1, y=1, z=3
- `const int64 N = 1` 型あり定数
- `const N = int64(1)` 型あり定数
- `const (A=iota; B; C)` A=1. B=2, C=3
### 論理値(bool型)
`true` / `false`

### 数値型(int8, int16, int32, uint8, int, uint, uintptr, float32...)
- int 符号あり
- uint 符号なし
- float32, float64 浮動小数点
- complex64, float128 複素数型

リテラル
- `123` // 10進数
- `0751` // 8進数
- `0xAFF` // 16進数
- `1.0e3` // 0.001 浮動小数点数リテラル
- `4i` // 虚数

### rune型
- 文字(Unicodeコードポイントを表わす特殊な整数型int32の別名)
- `'a'` // リテラル

### 文字列型(string)
- `"string"` // リテラル
- `"abcあいう"[2:8]` のように取り出せるが文字単位ではなくbyte単位。そ
  して返り値は[]byte型

RAW文字列リテラル
```go
`
aaa\n
`
```
- 改行がそのまま出力される
- 改行文字`\n`がそのまま\nで出力される

### 配列型
- `[4]int{1, 2, 3, 4}`
- `[...]int{1, 2}` // 要素数は2になる
- 初期化しなかった場合は数値型であれば`0`、文字列型は`""`、
  論理値は`false`になる
- 要素数と型が同じでなければ配列同士の代入はエラー
- 配列型の代入はコピーになる

### スライス
- 可変長配列。要素数と容量の2つの属性を持つ
- `[]T`
- 生成方法
  - `make([]T, NUMBER)` `T`は型名, `NUMBER`は要素数で容量
  - `make([]T, LEN, CAP)` `LEN`が要素数、`CAP`が容量
  - `[]int{1, 2, 3}` 要素数 = 容量
  - `SLICE[N:M]` 元のスライスのNからM-1までのスライス。Nがなければ0,M
    がなければ最後の要素まで(簡易スライス式と呼ばれる)
- 参照や代入の方法は配列と一緒
- `len(SLICE)`で要素数、`cap(SLICE)`で容量を参照可能
- `append(SLICE, VAL1, VAL2...)`
    - 要素を末尾に追加
    - 要素数が容量を越える場合は容量を増やして確保し直す(容量が0であれ
      ば要素数=容量)
    - 初期化や代入が伴わなければコンパイルエラー
    - `append(slice1, slice2...)` でスライス同士の連結
    - `append(BYTE_SLICE, "STRING"...)`
- `copy(DIST_SLICE, SRC_SLICE)`
    - `SRC_SLICE`の内容を`DIST_SLICE`にコピーする
    - `DIST_SLICE`の範囲外はコピーされない
    - コピーが実行された要素数を返す
    - `copy([]byte, string)`もあり
- `S[LOW: HIGH: MAX]`
    - 完全スライス式
    - `s`は配列かスライス
    - `LOW`から`HIGH-1`までを要素とする容量`MAX-LOW`のスライスを新規作成
- 参照型なので関数で渡した先で値を変更すると変更元のスライスも変更され
  る


### マップ
- 参照型
- `map[KEY_TYPE]VALUE_TYPE`
- 生成方法
  - `make(map[KEY_TYPE]VALUE_TYPE)`
  - `make(map[KEY_TYPE]VALUE_TYPE, NUM)` NUMは初期スペース(容量のよう
    なもの)
  - `make(map[KEY_TYPE]VALUE_TYPE){key1: val1, key2: val2,...,}`
  - sliceを値とする場合は`[]VALUE_TYPE`か各要素をスライスリテラルに
  - mapを値とする場合は`map[KEY_TYPE1]map[KEY_TYPE2]VALUE_TYPE`
    値は`{KEY1_1: {KEY1_2: VAL1}...}`
- set `map_variable[KEY] = VALUE`
- get `val, ok := map_variable[KEY]` `ok`はキーが存在した場合に`true`
- delete `delete(MAP, KEY)`
- 繰り返しには`for~range`で有効(順番は不定)
- `len(MAP)`で要素数を取得

### チャンネル
- 参照型
- ゴルーチンとのデータの受け渡しのに使う
- 型
    - `chan TYPE` TYPE型のチャンネル
    - `<-chan TYPE` 受信専用
    - `chan<- TYPE` 送信専用
- 生成
    - `make(chan TYPE)`
    - `make(chan TYPE, BUFFER_SIZE)`
- データ構造はキュー
- 送信 `ch <- VALUE`
- 受信 `<-ch`
- ゴルーチンがチャンネル操作で停止する条件
    - バッファサイズ0またはバッファ内が空のチャンネルから受信
    - バッファサイズ0またはバッファ内に空きがないチャンネルに送信
- `len(CHANNEL)` バッファ内に溜められているデータの個数
- `cap(CHANNEL)` バッファサイズ
- `close(CHANNEL)` チャンネルをクローズ
    - 送信するとランタイムパニック
    - 受信はok。空になっても型の初期値を受信する
- 受信したときに第2の返り値は「チャンネルのバッファ内が空かつクローズ」
  されていれば`false`を返す
- `select`構文
    複数のチャンネルを扱うための構文
    ```golang
    select {
    case e1 := <-ch1:
        // 処理
    case e2 := <-ch2:
        // 処理
    default:
        // 処理
    }
    ```
    - どのcase節が実行されるかランダムに選択される
    - default節は全てのcase節が処理の継続が不可能である場合に実行され
      る

### interface型
- あらゆる型と互換性のある特殊な型
- 初期値はnil

### キャスト
- 数値型
    - `byte(x)`
        引数に256以上を指定するとラップアラウンド(桁溢れ)が発生する。
        コンパイル時に検出されなかった場合は実行にエラーにならず正しくない値になる。
    - `int64(x)`
    - `uint32(x)`

## 関数
```golang
func funcName(x, y int) int { ... }
```
- 連続する同じ型の引数は末尾の1箇所にまとめられる
- `変数名 ...型`で可変長引数が入ったスライスになる
- 戻り値がない場合は戻り値の型を定義しない(voidじゃないよ)
- 複数の値を返す場合は`(int, int)`のように書く。受けとる場合は
`x, y = funcName()`。 破棄する場合は`_`を使う
- 戻り値を`(x int)`の様に書くと「変数を`x`の値を返す」となる
- 無名関数
    ```golang
    f := func(x int) int { return x }
    f(3)
    ```
- 関数も変数と同じ名前空間上にある
- `SLICE...`で可変引数として渡せる

### defer式
- `defer`に続く式が関数が値を返すときに実行される
- 何個でも登録できる
- 後で登録された式から実行される
- 複数の式を登録したいときは`defer func() {...}()`


## スコープ
- パケージ
    - 識別子の1文字目が大文字 => パッケージ外から参照可能
    - `import (f "fmt")` fmtパッケージを`f`で参照
    - `import {. "math"}` mathパッケージをパッケージ名なしで参照
- ファイル
    - 同一パケージ内の変数や関数は参照できる
    - インポート宣言はファイル毎に個別
- 関数
    - 引数と戻り値の変数含めて同じスコープ
- プロック
    - `{}`で区切られた範囲
    - ブロック内で宣言した変数は変数内でのみ使える
## アサーション
`value, isType := variable.(T)`
    - 例 `val, isInt := num.(int)` `val`にnumをintに変換した値、
      `isInt`は変換できかどうかが代入される

## 制御構造
### 繰り返し
- `for {}` 無限ループ
    - `break`で脱出。ラベルを指定した場合はそのラベルを抜ける
    - `continue`でプロック内の残処理をスキップ。ラベルを指定した場合は
      そのラベル直後の繰り返し処理先頭へスキップする
- `for i := 0; i < 10; i++ {}`
- `for i < 100 {}`
- `for index, content := range someArray {}`
    - index: 添字
    - content: 内容


### 分岐
- `if i >= 0 {} else if i == 0 {} else {}`
    - ブロックは省略できない
    - 条件式は必ず真理値でなければならない
- `if x = 1; x > arg {}`
    - `if 簡易式; 条件式 {}`
    - 簡易式のスコープはifの条件式とブロックのみで有効
- 式による`switch`
    ```golang
    switch n {
    case 1, 2:
        // 処理
    case 3:
        // 処理
    ...
    default:
        // 処理
    }
    ```
    - 他言語みたいに`break`はいらない。代りに処理を続ける場合は
    `fallthrough`が必要
    - `switch`の直後に簡易式が書ける
- 式を伴なう`case`
    ```golang
    switch {
    case n > 0:
        // 処理
    case n == 0:
        // 処理
    }
    ```
- 型による`switch`
    ```golang
    switch x.(type) {
    case int:
        // 処理
    case bool:
        // 処理
    }
    ```
    - `v = x.(type)`でその型の値を利用できる(`case`で複数列挙すること
        ができない)
### goto
- `goto LABEL_NAME`で`LABEL_NAME:`まで飛ぶ
- 同関数内のラベルのみ有効

### panic
- `panic(value)`
- ランタイムエラーを起こし、関数の実行を中断する
- 回復不能な自体を表す
- `defer`で登録された式はすべて実行される

### recover
- ランタイムパニックによるプログラムの中断を回復
- `defer`文の中でしか使われない

### go
- ゴルーチン(サブルーチン)の実行
- `go 関数呼び出し`
- runtimeパッケージを主に使って便利に使う

### init
- パッケージの初期化を行なう関数の名前
- メインルーチンが実行される前に実行される
- 複数のinitを定義できる。ソースコードに出現した順番に実行される


# ポインタ
- 型 `*TYPE`
- 参照型
- `& i` ポインタ生成(デリファレンス dereference)
- `* POINTER` でポインタが指す値を参照
- 配列のポインタ
    ```go
    ary := [3]string{"A", "B", "C"}
    ptr := & ary
    ary[1] // "B"
    ptr[1] // "B"
    ```
- string型からの変数からポインタは取れない(string型の値は不変だから)

# 構造体
## type
`type NEW_TYPE TYPE` 別名で型を定義(エイリアス)
- エイリアスと元の型との互換性はあるが、エイリアス同士はない

## 構造体
```go
type Point struct {
    X int
    Y int
    Z, W double
}

var p Point
p.x = 1
```

- 値型(参照型ではない)なので代入するとコピーされた値が代入される
- 複合リテラル `p := Point{x: 1, y: 2}`
- フィールド名を省略すると「型名=フィールド名」
    - ポインタ型の修飾子やパッケージのプリフィックスは無視されたフィー
      ルド名になる
- フィールド名が`_`だと無名フィールドとなり、指定や参照ができない
- 構造体をフィールドに持つ場合、そのフィールドは埋め込み構造体
    - フィールド名を省略した埋め込みは構造体名を省略して埋め込み構造体
      のフィールドにアクセスできる
- `new(T)`で指定の型で値の生成を行い、その値のポインタを返す
- 慣例的に`New型名`の関数はコンストラクタ的に使われる初期化関数
- フィールドとメソッドのパッケージ外からの参照可否は「最初が大文字か」
  どうか
- 構造体定義時にフィールドの型の後に文字列かRAW文字列でメタ情報を付与
  できる

### メソッド
- 任意の型に特化した関数
- 関数定義時に`func`とメソッド名の間に「レシーバー(Receiver)」である型
  を定義するとメソッド定義完了
- `レシーバー.関数名`で使用できる
- レシーバーが異なれば同じ関数名でも定義できる
- 指定がポインタでもレシーバーはポインタと値の区別なく呼べる

# interface
```go
type INTERFACE_NAME interface {
    FIELD_NAME TYPE
    METHOD_NAME(TYPE...) [RETURN_TYPE]
}
```
- 共通するインターフェイスを実装する型の値を同じスライスやマップに一纏
  めにできる

# パッケージ
## fmt
- `fmt.Println( STRING ...)`
    文字列の最後に改行を付与した内容を標準出力に出力
- `fmt.Printf( FORMAT ...)`
    書式指定子を含んだフォーマット文字列と、可変長引数を与えて生成した
    文字列を標準出力に出力する(`%#v`はリテラル表現, `%T`は型情報)
- `print()`, `println()`
    標準エラー出力に出力

## os
OSに依存した機能群のAPIを提供
- `os.Exit(STATUS)`
- `os.Args` コマンドライン引数
- `os.Open(FILE_NAME)`
    ファイルストリーム
- `os.Create(FILE_NAME)`
    ファイル作成

## flag
コマンドラインのオプションを扱いやすく

## log
- `log.Fatal(MESSAGE)`
- `log.Print(MEAAGE)`

## time
- `time.now()` 現在時刻

## math
- `math.Pi`
- `math.Abs(NUMBER)` 絶対値

## math/rand
- `rand.Seed(NUMBER)` シード値を設定
- `rand.Float64()` 乱数生成

## strconv
基本的なデータ型とstring型の相互変換をサポート
- `strconv.FormatBool(BOOLEAN)`
- `strconv.FormatInt(NUMBER, BASE)`

## unicode
- `unicode.IsDigit(RUNE)` 数字か
- `unicode.IsLetter(RUNE)` 文字か(英文字、平仮名...)

## strings
- `strings.Join([]STRING, [SEPARATOR])` 文字列を連結
- `strings.Index(STRING, NEEDLE)`
- `strings.HasPrefix(STRING, HEAD_STRING)`
- `strings.Contains(TARGET_STRING, SEARCH_STRING)`
- `strings.Count()`
- `strings.Replace()`
- `strings.Split()`
- `strings.ToLower()`
- `strings.ToUpper()`
- `strings.TrimSpace()`
- `strings.Fields()`

## io
入出力インターフェイス

## io/ioutil
入出力処理をサポート
- `ioutil.ReadAll()`
- `ioutil.ReadFile()`

## bufio
バッファ処理付きの入出力処理

- `bufio.NewScanner()`

## regexp
正規表現
- `regexp.MatchString(PATTERN_STRING, TARGET_STRING)`
- `regexp.Compile(PATTERN_STRING)` 正規表現をコンパイル
    - `RE.MatchString(TARGET_STRING)` パターンマッチ

## net/url
- `url.Parse(URL)`

## net/http
リクエスト送信、webサーバ
- `http.Get(URL)`

## sync
非同期処理

## crypto/*
ハッシュ値の生成

