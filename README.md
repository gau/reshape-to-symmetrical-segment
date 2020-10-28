# README

アンカーポイントの方向線（ハンドル）を対称にするIllustrator用スクリプトです。

<div class="fig center" style="margin-bottom: 20px;"><img src="https://www.graphicartsunit.com/saucer/images/reshape-to-symmetrical-segment/cover.png" alt="イメージ" class="noshadow"></div>


### 更新履歴

* **0.6.0：スクリプト名変更／テキストパスに対応／連続しないアンカーポイントの選択に対応／複数セグメントの選択を禁止**
* 0.5.3：ロックされたレイヤーがある場合にエラーが出るのを修正
* 0.5.2：対応バージョンをCS6以降に変更／CMYKモードでのプレビューカラーを修正
* 0.5.1：必要なオブジェクトが見つからないときの処理を修正
* 0.5.0：新規作成（公開）

----

### 対応バージョン

* Illustrator CS6 〜 2021

----

### ダウンロード

* [スクリプトをダウンロードする](https://github.com/gau/reshape-to-symmetrical-segment/archive/master.zip)

----

### インストール方法

1. ダウンロードしたファイルを解凍します。
2. 所定の場所に「方向線を対称にする.jsx」をコピーします。Windows版ではお使いのIllustratorの種類によって保存する場所が異なりますのでご注意ください。
3. Illustratorを再起動します。
4. `ファイル > スクリプト > 方向線を対称にする`と表示されていればインストール成功です。

#### ファイルをコピーする場所

| OS | バージョン | フォルダの場所 |
|:-----|:-----|:-----|
| Mac | 全 | /Applications/Adobe Illustrator *(ver)*/Presets/ja_JP/スクリプト/ |
| 32bit Win | CS5まで | C:\Program Files\Adobe\Adobe Illustrator *(ver)*\Presets\ja_JP\スクリプト\ |
| 64bit Win | CS5, CS6（32bit版） | C:\Program Files (x86)\Adobe\Adobe Illustrator *(ver)*\Presets\ja_JP\スクリプト\ |
| 64bit Win | CS6（64bit版）以降 | C:\Program Files\Adobe\Adobe Illustrator *(ver)* (64 Bit)\Presets\ja_JP\スクリプト\ |

* *(ver)*にはお使いのIllustratorのバージョンが入ります
* 本スクリプトは、CS4以前では動作を検証しておりません

----

### 基本的な使い方

#### 1. 対象の選択
<div class="fig center"><img src="https://www.graphicartsunit.com/saucer/images/reshape-to-symmetrical-segment/step1.png" alt="1.対象アンカーポイントの指定" class="noshadow"></div>

次のいずれかの選択で、対象となるアンカーポイントが指定されます。

* パス上のセグメントをひとつだけ選択
* パス上のアンカーポイントを2点だけ選択（連続していなくてもOK）
* 始点アンカーポイントのみを選択
* 終点アンカーポイントのみを選択

#### 2. 変更対象のアンカーポイント選択
<div class="fig center"><img src="https://www.graphicartsunit.com/saucer/images/reshape-to-symmetrical-segment/step2.png" alt="2.変更対象のアンカーポイント選択" class="noshadow"></div>

スクリプトを実行すると、ダイアログが表示されます。［変更対象のアンカーポイント］で選択したアンカーポイントが、変更の対象となります。パスの進行方向に対して前にくる方が［前］、後にくる方が［後］です。変更対象のアンカーポイントと方向線は、プレビューで赤く表示されるので分かります。

#### 3. スムーズポイントに変更するオプションを指定
<div class="fig center"><img src="https://www.graphicartsunit.com/saucer/images/reshape-to-symmetrical-segment/step3.png" alt="3.スムーズポイントに変更するオプション" class="noshadow"></div>

［スムーズポイントにする］をチェックすると、アンカーポイントはスムーズポイントに変換されます。セグメント外側の方向線も同じ角度になるように連動して動かします。

#### 4. 実行
<div class="fig center"><img src="https://www.graphicartsunit.com/saucer/images/reshape-to-symmetrical-segment/step4.png" alt="4.実行" class="noshadow"></div>

［実行］をクリックすると、処理が実行されます。

----

### カスタマイズ

スクリプトの5〜8行目の値を変更して、ダイアログの初期値やダイアログとメッセージの表示、非表示などを変更できます。

| キー | 型 | 説明 | 値 |
|:-----|:-----|:-----|:-----|
| point | Number | 変更対象のアンカーポイント | 0：前（初期値）｜1：後 |
| smooth | Boolean | スムーズポイントにする | true：オン（初期値）｜false：オフ |
| showDialog | Boolean | ダイアログを表示 | true：する（初期値）｜false：しない |
| showAlert | Boolean | エラーなどの警告を表示する | true：する（初期値）｜false：しない |

----

### 処理できない選択

以下の場合は不適切な選択として処理を中止します。

* 何も選択されていない
* 複数のオブジェクトが選択されている
* 複数のセグメントが選択されている
* 始点、終点以外でアンカーポイントが1つしか選択されていない
* アンカーポイントが3つ以上選択されている

----

### 注意

* 実行前にドキュメントを保存しておくことをお勧めします。
* 必要なオブジェクトが見つからないとき、選択が不適切な場合は処理を中断します。
* グループや複合パス、複合シェイプでの複数パスにまたがる選択はできません。単一のパスないでは処理できます。
* オブジェクトの種類や構造によって意図しない結果になる可能性もゼロではありません。

----

### 免責事項

* このスクリプトを使って起こったいかなる現象についても制作者は責任を負えません。すべて自己責任にてお使いください。
* OSのバージョンやその他の状況によって実行できないことがあるかもしれません。もし動かなかったらごめんなさい。

----

### ライセンス

* 方向線を対称にする.jsx
* Copyright (c) 2017 - 2020 Toshiyuki Takahashi
* Released under the MIT license
* [http://opensource.org/licenses/mit-license.php](http://opensource.org/licenses/mit-license.php)
* Created by Toshiyuki Takahashi ([Graphic Arts Unit](http://www.graphicartsunit.com/))
* [Twitter](https://twitter.com/gautt)