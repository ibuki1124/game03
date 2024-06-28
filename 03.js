// canvasのエレメント取得
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// canvas2のエレメント取得
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext('2d');

const text = document.getElementById("text");

let block_size = 30; // 1ブロックのサイズ
// canvas
let col = 20; //盤面の縦列
canvas.height = col * block_size; //盤面の高さ
let row = 10; //盤面の横列
canvas.width = row * block_size; //盤面の横幅

let board = [];

// 盤面の1ブロックずつ配列化
function drawBoard(y, x){
    for (let i = 0; i < y; i++){
        board.push([]);
        for (let j = 0; j < x; j++){
            board[i][j] = 0;
            // 1ブロックずつ枠線の表示
            ctx.strokeStyle = "gray";
            ctx.strokeRect(j * block_size, i * block_size, block_size, block_size);
        }
    }
}

// 初期の盤面の描画
drawBoard(col, row);

// 盤面の初期化
function clearBoard(y, x){
    for (let i = 0; i < y; i++){
        for (let j = 0; j < x; j++){
            board[i][j] = 0;
        }
    }
}

// テトロミノ
let tetromino = [
    [ //ミノ:I(水色)
     [0,0,0,0],
     [1,1,1,1],
     [0,0,0,0]
    ],
    [ //ミノ:O(黄色)
     [2,2],
     [2,2]
    ],
    [ //ミノ:S(緑色)
     [0,3,3],
     [3,3,0],
     [0,0,0]
    ],
    [ //ミノ:Z(赤色)
     [4,4,0],
     [0,4,4],
     [0,0,0]
    ],
    [ //ミノ:J(青色)
     [5,0,0],
     [5,5,5],
     [0,0,0]
    ],
    [ //ミノ:L(橙色)
     [0,0,6],
     [6,6,6],
     [0,0,0]
    ],
    [ //ミノ:T(紫色)
     [0,7,0],
     [7,7,7],
     [0,0,0]
    ]
];

// 現在と次のミノを格納する変数
let current_tetro, keep, next_tetro, random_mino;
function mino(){
    // tetrominoの0~6までのindex番号をランダムで取得
    random_mino = Math.floor(Math.random() * 7);

    // // 次に表示するテトロをnext_tetroに格納
    keep = random_mino;
    next_tetro = tetromino[keep];

    // 現在のテトロをcurrent_tetroに格納
    random_mino = Math.floor(Math.random() * 7);
    current_tetro = tetromino[random_mino];
}
mino();

//ミノの種類によって配色を変更
function minoColor(mino_number, ctx){
    if (mino_number == 1){
        ctx.fillStyle = "#00ccff"; //水色
    }else if (mino_number == 2){
        ctx.fillStyle = "#ffff00"; //黄色
    }else if (mino_number == 3){
        ctx.fillStyle = "#00cc00"; //緑色
    }else if (mino_number == 4){
        ctx.fillStyle = "#cc0000"; //赤色
    }else if (mino_number == 5){
        ctx.fillStyle = "#0000cc"; //青色
    }else if (mino_number == 6){
        ctx.fillStyle = "#ff9900"; //橙色
    }else if (mino_number == 7){
        ctx.fillStyle = "#9900cc"; //紫色
    }
}

// 次に出てくるテトロミノの表示canvas2
function drawCanvas2(){
    let col2 = 2;
    canvas2.height = col2 * block_size;
    let row2 = next_tetro[0].length;
    canvas2.width = row2 * block_size;
}

// current_tetroの要素が0以外の時に描画
function drawMino(){
    ghost_y = mino_y;
    while (collisionMinoY(1, ghost_y) == true){
        ghost_y++;
    }
    drawGhost();
    for (let i = 0; i < current_tetro.length; i++){
        for (let j = 0; j < current_tetro[0].length; j++){
            if (current_tetro[i][j] != 0){
                minoColor(random_mino + 1, ctx); //ミノの種類によって配色を変更
                ctx.lineWidth = 1;
                ctx.strokeStyle = "black";
                ctx.rect((mino_x + j) * block_size, (mino_y + i) * block_size, block_size, block_size);
                ctx.fill();
                ctx.stroke();
            }
        }
    }
}

// next_tetroの要素が0以外の時に描画
function drawNextMino(){
    drawCanvas2();
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.beginPath();
    for (let i = 0; i < next_tetro.length; i++){
        for (let j = 0; j < next_tetro[0].length; j++){
            if (next_tetro[i][j] != 0){
                minoColor(keep + 1, ctx2);
                ctx2.strokeStyle = "black";
                ctx2.rect(j * block_size, i * block_size, block_size, block_size);
                ctx2.fill();
                ctx2.stroke();
            }
        }
    }
}

// すでに置かれているブロックの描画
function drawBoardIndex(y, x){
    for (let i = 0; i < y; i++){
        for (let j = 0; j < x; j++){
            if (board[i][j] != 0){
                ctx.beginPath();
                minoColor(board[i][j], ctx); //ミノの種類によって配色を変更
                ctx.strokeStyle = "black";
                ctx.rect(j * block_size, i * block_size, block_size, block_size);
                ctx.fill();
                ctx.stroke();
            }
        }
    }
}

// 描画に関する処理
function draw(){
    clearFill(col, row);
    drawBoardIndex(col, row);
    drawMino();
}

// ミノのy座標
let mino_y = 0;
// ミノのx座標
let mino_x = Math.floor((row - current_tetro[0].length) / 2);

// 重複した塗りつぶしをクリアする
function clearFill(y, x){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    drawStroke(y, x);
}

// 枠線の描画
function drawStroke(y, x){
    for (let i = 0; i < y; i++){
        for (let j = 0; j < x; j++){
            // 1ブロックずつ枠線の表示
            ctx.lineWidth = 1;
            ctx.strokeStyle = "gray";
            ctx.strokeRect(j * block_size, i * block_size, block_size, block_size);
        }
    }
}


let ghost_y; // 落ちる場所のy座標
// 落ちる場所の表示
function drawGhost(){
    for (let i = 0; i < current_tetro.length; i++){
        for (let j = 0; j < current_tetro[0].length; j++){
            if (current_tetro[i][j] != 0){
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#ffffff";
                ctx.strokeRect((mino_x + j) * block_size, (ghost_y + i) * block_size, block_size, block_size);
            }
        }
    }
}

// ミノの落下スピード
let drop_speed = 1000;
// ゲーム開始からの秒数カウント
let count_time = 0;

// 30秒ごとにテトロミノを落とす速度を上げる(0.3秒まで)
function count(){
    count_time++;
    if (count_time % 30 == 0){
        clearInterval(interval_time);
        if (drop_speed > 300){
            drop_speed = drop_speed - 100;
        }
        interval_time = setInterval(time, drop_speed);
        return;
    }
}

// drop_speed秒毎に落下する
function time(){
    if (collisionMinoY(1, mino_y) == true){
        mino_y++;
    }else if (collisionMinoY(1, mino_y) == false){
        // y座標の衝突が起きた際にその座標にミノを置く
        for (let i = 0; i < current_tetro.length; i++){
            for (let j = 0; j < current_tetro[0].length; j++){
                if (current_tetro[i][j] != 0){
                    board[mino_y + i][mino_x + j] = current_tetro[i][j];
                }
            }
        }
        if (resetMino() == false){
            return;
        }
    }
    matchMino();
    draw();
}

// ミノの回転（0が右・1が左）
function spinMino(direcrtion){
    let spin_mino = [];
    spinDirection(direcrtion, spin_mino)
    current_tetro = spin_mino;
    return true;
}

// ミノの回転方向の判定
function spinDirection(direcrtion, spin_mino){
    if (direcrtion == 0){
        for (let i = 0; i < current_tetro[0].length; i++){
            spin_mino.push([]);
            for (let j = 0; j < current_tetro.length; j++){
                spin_mino[i][j] = current_tetro[current_tetro.length - j - 1][i];
            }
        }
    }else if (direcrtion == 1){
        for (let i = 0; i < current_tetro[0].length; i++){
            spin_mino.push([]);
            for (let j = 0; j < current_tetro.length; j++){
                spin_mino[i][j] = current_tetro[j][current_tetro[0].length - i - 1];
            }
        }
    }
    return true;
}

// キーボードを押した時のミノの操作（WASDキーと矢印キー両方同じ操作が可能）
function moveMino(){
    addEventListener("keydown", (event)=>{
        if (game_status == true){
            switch (event.code){
                case "KeyW": case "ArrowUp": //右回転
                    if (collisionSpinMino(0) == true){
                        spinMino(0);
                    }
                    break;
                case "KeyA": case "ArrowLeft": //左に移動
                    if (collisionMinoX(-1) == true){
                        mino_x--;
                    }
                    break;
                case "KeyS": case "ArrowDown": //左回転
                        if (collisionSpinMino(1) == true){
                            spinMino(1);
                        }
                        break;
                case "KeyD": case "ArrowRight": //右に移動
                    if (collisionMinoX(1) == true){
                        mino_x++;
                    }
                    break;
                case "Space": //強制落下
                    while (collisionMinoY(1, mino_y) == true){
                        mino_y++;
                    }
                    break;
            }
            draw();
        }
    });
}

moveMino();

// テトリミノのx座標の当たり判定
function collisionMinoX(n){
    for (let i = 0; i < current_tetro.length; i++){
        for (let j = 0; j < current_tetro[0].length; j++){
            if (current_tetro[i][j] != 0){
                if (mino_x + j + n < 0 || mino_x + j + n >= row || board[mino_y + i][mino_x + j + n] != 0){
                    return false;
                }
            }
        }
    }
    return true;
}

// テトリミノのy座標の当たり判定
function collisionMinoY(n, y){
    for (let i = 0; i < current_tetro.length; i++){
        for (let j = 0; j < current_tetro[0].length; j++){
            if (current_tetro[i][j] != 0){
                if (y + i + n < 0 || y + i + n >= col || board[y + i + n][mino_x + j] != 0){
                    return false;
                }
            }
        }
    }
    return true;
}

// テトリミノの回転後の当たり判定
function collisionSpinMino(direcrtion){
    let spin_mino = [];
    let check; // 両サイドで+-された後に既に置かれたミノがあるかどうか
    spinDirection(direcrtion, spin_mino);
    for (let i = 0; i < spin_mino.length; i++){
        for (let j = 0; j < spin_mino[0].length; j++){
            if (spin_mino[i][j] != 0){
                if (mino_y + i >= col){
                    return false;
                }else if (mino_x + j >= row){
                    mino_x--;
                    check = 1;
                }else if (mino_x + j < 0){
                    mino_x++;
                    check = 2;
                }else if (board[mino_y + i][mino_x + j] != 0){
                    if (check == 1){
                        mino_x++;
                    }else if (check == 2){
                        mino_x--;
                    }
                    return false;
                }
            }
        }
    }
    return true;
}

// 横1列そろった時の判定
function matchMino(){
    let match = 0;
    for (let i = 0; i < col; i++){
        for (let j = 0; j < row; j++){
            if (board[i][j] == 0){
                match = 1;
            }
        }
        if (match == 0){
            for (let j = 0; j < row; j++){
                board[i][j] = 0;
            }
            for (let y = i; y > 0; y--){
                for (let x = 0; x < row; x++){
                    board[y][x] = board[y - 1][x];
                }
            }
        }
        match = 0;
    }
}

// テトロミノが置かれた際に再度画面上部に出現
function resetMino(){
    // 初期位置から動けなかった場合(ゲームオーバー)
    if (mino_y == 0){
        gameOver();
        return false;
    }
    mino_x = Math.floor((row - tetromino[keep].length) / 2);
    mino_y = 0;
    let current = keep;
    current_tetro = tetromino[current];
    random_mino = Math.floor(Math.random() * 7);
    keep = random_mino;
    next_tetro = tetromino[keep];
    drawNextMino();
    random_mino = current;
}

// ゲームが終了
function gameOver(){
    gameReset();
    ctx.font = "bold 38px 'Meiryo'";
    ctx.fillStyle = "#ff0000";
    ctx.textAlign = "center";
    let text = "ゲームオーバー";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    ctx.font = "bold 28px 'Meiryo'";
    ctx.fillStyle = "#33ff00";
    text = "再スタートはこちら";
    ctx.fillText(text, canvas.width / 2, canvas.height - 35);

    interval_text = setInterval(drawText, 500);
}

// ゲームオーバー時に三角を表示非表示切り替える
let change = 0;
function drawText(){
    if (change == 0){
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height - 5);
        ctx.lineTo((canvas.width / 2) - 15, canvas.height - 30)
        ctx.lineTo((canvas.width / 2) + 15, canvas.height - 30)
        ctx.lineTo(canvas.width / 2, canvas.height - 5)
        ctx.fill();
        change = 1;
    }else if (change == 1){
        ctx.clearRect(0, 600, canvas.width, -30);
        drawStroke(col, row)
        change = 0;
    }
}

// ゲーム開始有無
let game_status = false;
let interval_time, interval_count, interval_text;

// ゲーム・ボタンの状態(status)がtrueかfalseか
function statusTF(status1){
    game_status = status1;
    start.disabled = status1;

    if (game_status == true){
        text.innerHTML = "次のミノ";
    }else{
        text.innerHTML = "ゲームが開始していません";
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    }
}

// スタートボタン
let start = document.getElementById("start");
start.addEventListener("click", gameStart);

// スタートボタンが押された時
function gameStart(){
    statusTF(true);

    drawNextMino();
    draw();
    interval_time = setInterval(time, drop_speed);
    interval_count = setInterval(count, 1000);
    clearInterval(interval_text);
}

// リセットボタンが押された時
function gameReset(){
    statusTF(false);
    mino();

    mino_x = Math.floor((row - current_tetro[0].length) / 2);
    mino_y = 0;

    clearInterval(interval_time);
    count_time = 0;
    drop_speed = 1000;
    clearInterval(interval_count);
    clearBoard(col, row);
    clearFill(col, row);
}