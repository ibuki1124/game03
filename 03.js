// canvasのエレメント取得
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// canvas2のエレメント取得
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext('2d');

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

// tetrominoの0~6までのindex番号をランダムで取得
let random_mino = Math.floor(Math.random() * 7);

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

// // 次に表示するテトロをnext_tetroに格納
let keep = random_mino;
let next_tetro = tetromino[keep];

// 次に出てくるテトロミノの表示canvas2
let col2 = next_tetro.length;
canvas2.height = col2 * block_size;
let row2 = next_tetro[0].length;
canvas2.width = row2 * block_size;

drawNextMino();
// 現在のテトロをcurrent_tetroに格納
random_mino = Math.floor(Math.random() * 7);
let current_tetro = tetromino[random_mino];

// current_tetroの要素が0以外の時に描画
function drawMino(){
    clearFill(col, row);
    for (let i = 0; i < current_tetro.length; i++){
        for (let j = 0; j < current_tetro[0].length; j++){
            if (current_tetro[i][j] != 0){
                minoColor(random_mino + 1, ctx); //ミノの種類によって配色を変更
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
    col2 = next_tetro.length;
    canvas2.height = col2 * block_size;
    row2 = next_tetro[0].length;
    canvas2.width = row2 * block_size;
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
    drawMino();
    drawBoardIndex(col, row);
}

// ミノのy座標
let mino_y = 0;
// ミノのx座標
let mino_x = Math.floor((row - current_tetro[0].length) / 2);

// 初期のミノの描画
draw();

// 重複した塗りつぶしをクリアする
function clearFill(y, x){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < y; i++){
        for (let j = 0; j < x; j++){
            // 1ブロックずつ枠線の表示
            ctx.strokeStyle = "gray";
            ctx.strokeRect(j * block_size, i * block_size, block_size, block_size);
        }
    }
}

// ミノの落下スピード
let drop_speed = 300;

// drop_speed秒毎に落下する
setInterval(function(){
    if (collisionMinoY(1) == true){
        mino_y++;
    }else if (collisionMinoY(1) == false){
        // y座標の衝突が起きた際にその座標にミノを置く
        for (let i = 0; i < current_tetro.length; i++){
            for (let j = 0; j < current_tetro[0].length; j++){
                if (current_tetro[i][j] != 0){
                    board[mino_y + i][mino_x + j] = current_tetro[i][j];
                }
            }
        }
        resetMino();
    }
    matchMino();
    draw();
}, drop_speed);

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
                while (collisionMinoY(1) == true){
                    mino_y++;
                }
                break;
        }
        draw();
    });
}

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
function collisionMinoY(n){
    for (let i = 0; i < current_tetro.length; i++){
        for (let j = 0; j < current_tetro[0].length; j++){
            if (current_tetro[i][j] != 0){
                if (mino_y + i + n < 0 || mino_y + i + n >= col || board[mino_y + i + n][mino_x + j] != 0){
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
    spinDirection(direcrtion, spin_mino);
    for (let i = 0; i < spin_mino.length; i++){
        for (let j = 0; j < spin_mino[0].length; j++){
            if (spin_mino[i][j] != 0){
                if (mino_y + i >= col){
                    return false;
                }else if (mino_x + j >= row){
                    mino_x--;
                }else if (mino_x + j < 0){
                    mino_x++;
                }else if (board[mino_y + i][mino_x + j] != 0){
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
                console.log(board[i][j])
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
    mino_x = Math.floor((row - current_tetro[0].length) / 2);
    mino_y = 0;
    let current = keep;
    current_tetro = tetromino[current];
    random_mino = Math.floor(Math.random() * 7);
    keep = random_mino;
    next_tetro = tetromino[keep];
    drawNextMino();
    random_mino = current;
}

moveMino();