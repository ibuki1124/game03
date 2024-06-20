// canvasのエレメント取得
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let block_size = 30; // 1ブロックのサイズ
let col = 20; //盤面の楯列
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
     [1,1,1,1],
     [0,0,0,0]
    ],
    [ //ミノ:O(黄色)
     [2,2],
     [2,2]
    ],
    [ //ミノ:S(緑色)
     [0,3,3],
     [3,3,0]
    ],
    [ //ミノ:Z(赤色)
     [4,4,0],
     [0,4,4]
    ],
    [ //ミノ:J(青色)
     [5,0,0],
     [5,5,5]
    ],
    [ //ミノ:L(橙色)
     [0,0,6],
     [6,6,6]
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
function minoColor(mino_number){
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

// 現在のテトロをcurrent_tetroに格納
let current_tetro = tetromino[random_mino];

// current_tetroの要素が0以外の時に描画
function drawMino(){
    clearFill(col, row);
    for (let i = 0; i < current_tetro.length; i++){
        for (let j = 0; j < current_tetro[0].length; j++){
            if (current_tetro[i][j] != 0){
                minoColor(random_mino + 1); //ミノの種類によって配色を変更
                ctx.strokeStyle = "black";
                ctx.rect((mino_x + j) * block_size, (mino_y + i) * block_size, block_size, block_size);
                ctx.fill();
                ctx.stroke();
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
                minoColor(board[i][j]); //ミノの種類によって配色を変更
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
let mino_x = 0;

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
let drop_speed = 1000;

// drop_speed秒毎に落下する
setInterval(function(){
    if (collisionMinoY(1) == true){
        mino_y++;
    }else{
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
    draw();
}, drop_speed);

// ミノの回転（0が右・1が左）
function spinMino(direcrtion){
    let spin_mino = [];
    if (direcrtion == 0){
        for (let i = 0; i < current_tetro[0].length; i++){
            spin_mino.push([]);
            for (let j = 0; j < current_tetro.length; j++){
                spin_mino[i][j] = current_tetro[current_tetro.length - j - 1][i];
                current_tetro[current_tetro.length - j - 1][i] = 0;
            }
        }
        current_tetro = spin_mino;
        spin_mino = [];
        return true;
    }else if (direcrtion == 1){
        for (let i = 0; i < current_tetro[0].length; i++){
            spin_mino.push([]);
            for (let j = 0; j < current_tetro.length; j++){
                spin_mino[i][j] = current_tetro[j][current_tetro[0].length - i - 1];
                current_tetro[j][current_tetro[0].length - i - 1] = 0;
            }
        }
        current_tetro = spin_mino;
        spin_mino = [];
        return true;
    }
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
    spin_mino = [];
    return true;
}

// テトロミノが置かれた際に再度画面上部に出現
function resetMino(){
    mino_x = 0;
    mino_y = 0;
    random_mino = Math.floor(Math.random() * 7);
    current_tetro = tetromino[random_mino];
}

moveMino();