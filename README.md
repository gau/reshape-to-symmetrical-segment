# README

セグメント両端のアンカーポイントの方向線（ハンドル）を対称にするIllustrator用スクリプトです。

<div class="fig center" style="margin-bottom: 20px;"><img src="http://www.graphicartsunit.com/saucer/images/reshape-to-symmetrical-segment/eye.png" alt="イメージ" class="noshadow"></div>


### 更新履歴

* 0.5.0：新規作成（公開）

----

### 対応バージョン

* Illustrator CS5 〜 CC 2018

----

### ダウンロード

* [スクリプトをダウンロードする](https://github.com/gau/reshape-to-symmetrical-segment/archive/master.zip)

----

### インストール方法

1. ダウンロードしたファイルを解凍します。
2. 所定の場所に「セグメントを対称にする.jsx」をコピーします。Windows版ではお使いのIllustratorの種類によって保存する場所が異なりますのでご注意ください。
3. Illustratorを再起動します。
4. `ファイル > スクリプト > セグメントを対称にする`と表示されていればインストール成功です。

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

#### 1. 対象セグメントの選択
<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/reshape-to-symmetrical-segment/fig01.png" alt="通常操作で線幅を変更する" class="noshadow"></div>

パスのセグメントをひとつだけ選択します。［ダイレクト選択ツール］でセグメントをクリックするか、ドラッグで囲めば選択できます。または、連続するアンカーポイントを2点選択しても、その間のセグメントが対象になります。

#### 2. 変更対象のアンカーポイント選択
<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/reshape-to-symmetrical-segment/fig02.png" alt="通常操作で線幅を変更する" class="noshadow"></div>

スクリプトを実行すると、ダイアログが表示されます。［変更アンカーポイント］で選択したアンカーポイントが、変更の対象となります。パスの進行方向に対して前にくる方が［前］、後にくる方が［後］です。変更対象のアンカーポイントと方向線は、プレビューで赤く表示されるので分かります。

#### 3. スムーズポイントに変更するオプション
<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/reshape-to-symmetrical-segment/fig03.png" alt="通常操作で線幅を変更する" class="noshadow"></div>

［スムーズポイントにする］をチェックすると、アンカーポイントはスムーズポイントに変換されます。セグメント外側の方向線も同じ角度になるように連動して動かします。

#### 4. 実行
<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/reshape-to-symmetrical-segment/fig04.png" alt="通常操作で線幅を変更する" class="noshadow"></div>

［実行］をクリックすると、処理が実行されます。

----

### 複数セグメントへの処理は非対応

<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/reshape-to-symmetrical-segment/fig05.png" alt="このスクリプトを使うと" class="noshadow"></div>

複数セグメントへの同時処理は対応していません。複数のセグメントが選択されているときは、最初に取得できたセグメントが対象となります。

----

### 注意

* 一度に処理できるセグメントはひとつだけです。
* 必要なオブジェクトが見つからないときは処理を中断します。
* グループや複合パス、複合シェイプの全体が選択されているときは処理は行われませんが、ダイレクト選択ツールでセグメントが選択されている場合は動作します。
* オブジェクトの種類や構造によって意図しない結果になる可能性もゼロではありません。

----

### 免責事項

* このスクリプトを使って起こったいかなる現象についても制作者は責任を負えません。すべて自己責任にてお使いください。
* CC 2018で動作の確認はしましたが、OSのバージョンやその他の状況によって実行できないことがあるかもしれません。もし動かなかったらごめんなさい。

----

### ライセンス

* すべての線幅を変更.jsx
* Copyright (c) 2017 - 2018 Toshiyuki Takahashi
* Released under the MIT license
* [http://opensource.org/licenses/mit-license.php](http://opensource.org/licenses/mit-license.php)
* Created by Toshiyuki Takahashi ([Graphic Arts Unit](http://www.graphicartsunit.com/))
* [Twitter](https://twitter.com/gautt)