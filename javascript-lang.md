# javascript

# 関数、メソッド
```javascript
let user = {
    name: 'user-name',
    sayHi: function() { // function
        return 'Hi! ' + this.name; // 動く
    },
    sayHi2() { // 短縮形
        return 'Hi! ' + this.name; // 動く
    },
    sayHi3: () => {// アロー関数
        return 'Hi! ' + this.name; // エラー(thisを持たないため)
    }
}

let hi = user.sayHi;
hi() // エラー(javascriptはthisをバインドしないため)

let hi2 = user.sayHi.bind(user);
hi2() // 動く
```
`this`は実行時に決定する

## パラメータ
- rest parameters
  ```
  functino sum(...rest) {
      // restはArray
      return rest.reduce((p, n) => p + n);
  }
  ```
- arguments
  引数値を持つArray likeなオブジェクト
- スプレッド演算子
  ```
  sum(...[1, 2, 3...]) // = sum(1, 2, 3 ...)
  ```
  iterableだったら何でも使える(ex.文字列)が、Array linkなオブジェクト
  では使えない

## アロー関数の特徴
- `this`を持たない
- `arguments`を持たない
- `new`で呼び出すことができない

# オブジェクトのプロパティ
## プロパティフラグ
- writable true=変更可能、false=読み取り専用
- enumerable true=ループで列挙される、false=列挙されない
- configurable true=削除または属性の変更が可能

デフォルトで全てtrue

### 取得
- `Object.getOwnPropertyDescriptor(obj, propertyName)`
`obj`の`propertyName`プロパティのプロパティフラグ(プロパティディスクリ
プタ)を取得
- `Object.getOwnPropertyDescriptors(obj)`
すべてのプロパティディスクリプタを取得

### 設定
- `Object.defineProperty(obj, propertyName, descriptor)`
  `obj`の`propertyName`プロバティに`descriptor`を設定.
  `descriptor`は`{writable: false}`などのようなオブジェクト

- `Object.defineProperties(obj, descriptors)`
  ```javascript
  let descriptors = {
      propery: {value: ooo, writable: true ...}
      ...
  }
  ```
- `Object.preventExtensions(obj)`
  オブジェクトにプロパティを追加するのを禁止

- `Object.seal(obj)`
  プロパティの追加、削除を禁止

- `Object.freeze(obj)`
  プロパティの追加、削除、変更を禁止

## アクセサプロパティ
``` javascript
let obj = {
  get propName() {
    // getter, obj.propName を取得するときにコードが実行されます
  },

  set propName(value) {
    // setter, obj.propName = value 時にコードが実行されます
  }
};
```
- アクセスプロパティはget/setでのみアクセス可能
- `get/set プロパティ名()`または`Object.defineProperty(obj, name,
  descriptor)`で定義

### アクセサディスクリプタ
- get – 引数なしの関数で、プロパティが読まれたときに動作します。
- set – 1つの引数をもつ関数で、プロパティがセットされたときに呼ばれます。
- enumerable – データプロパティと同じです。
- configurable – データプロパティと同じです。

# プロトタイプ
- オブジェクトは特別な隠しプロパティ`[[Prototype]]`を持つ
- `[[Prototype]]`は`null`または別のオブジェクト(プロトタイプ)を参照

## 継承
継承方法
```javascript
let objA = {
    name: 'a'
}
let objB = {
    text: 'b',
    __proto__: objA, // objAを継承
}
// または
function ObjC() {}
ObjC.protptype = objA; // objAを継承
```

関数も`prototype`を持つ
```
function Rabbit() {}
// Rabbit.constructor === { constructor: Rabbit }
```

## プロトタイプのためのメソッド
- `Object.create(proto[, descriptors])`
  与えられた`proto`を`[[Prototype]]`として、まは任意のプロパティディス
  クリプタで空のオブジェクトを作る

- `Object.getPrototypeOf(obj)`
  `obj`の`[[Prototype]]`を返す

- `Object.setPrototypeOf(obj, proto)`
  `obj`の`[[Prototype]]`に`proto`をセットする

## すべてのプロパティを取得する
- `Object.keys(obj) / Object.values(obj) / Object.entries(obj)`
  列挙可能な プロパティ名 / 値 / キー値のペア の配列を返す

- `Object.getOwnPropertySymbols(obj)`
  シンボリックプロパティ名の配列を返す

- `Object.getOwnPropertyNames(obj)`
  すべての非列挙型のプロパティを含めてプロパティ名を返す

- `Reflect.ownKeys(obj)`
  すべてのプロパティ名を返す

- `for...in`
  継承されたプロパティ含めて列挙。非継承プロパティは
  `obj.hasOwnProperty(key)===false`で区別できる

# クラス
## プロトタイプベースのクラス
- コンストラクタは現在のオブジェクトの状態のみ初期化
- メソッドはプロトタイプに追加
```javascript
function User(name) {
    this._name = name;
}
User.prototype.sayHi = function() {
    console.log(this._name);
}

const user = new User('Taro');
user.sayHi();
```

## クラス構文

```javascript
class User {
    constructor(name) {
        this._name = name;
    }

    sayHi = function() {
        console.log(this._name);
    }

    get name() {
        return this._name;
    }

    static staticMethod() {...}
}
```

## 継承
```javascript
class ClassB extends classA {
    constructor(props) {
        // 継承元のconsutructorを呼ぶ
        // この前にthisを使うとエラーになる
        super(props);
    }

    methodA() {
        // 継承元のメソッド呼び出し
        super.methodA();
    }
}

```


# promise
## 基本

```javascript
let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(new Error("success")), 1000)
})
promise.then(
    (result) => console.log(result), // result = "success"
    (error) => console.warn(error))
    .finally(() => console.log('かならず実行される!!'));
```
catchハンドラー次のthenハンドラーを探す
thenハンドラーでエラーを返したときは`throw new Error()`を使えばよい

## Promise API
- Promise.resolve()
  `new Promise(resolve => resolve(value))`と同じ
- Promise.reject()
  `new Promise((resolve, reject) => reject(value))`と同じ
- Promise.all(iterable)
  並列に複数のpromiseを実行し、すべて準備できるまで待つ
  ```javascript
  const wait = (sec, val) =>
      new Promise((resolve) => setTimeout(() => resolve(val), sec));
  Promise.all([
      wait(1000, 1),
      wait(2000, 2),
      wait(500, 3)
  ])
  .then(result => console.log(result)) // [1, 2, 3]
  ```
- Promise.race(iterable)
  iterableの中で最初に結果を返すまで待つ

## async/await
- async
  - 関数の前に置いて使う
  - asyncを付けた関数はPromiseを返すことを保証する
- await
  - async関数の中で使える。
  - promiseの前に置いて使う
  - promieが確定するまで待つ

async/awaitのエラー処理はtry..catchで行なう
