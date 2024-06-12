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
     [0,0,0,0],
     [1,1,1,1],
     [0,0,0,0],
     [0,0,0,0]
    ],
    [ //ミノ:O(黄色)
     [0,0,0,0],
     [0,2,2,0],
     [0,2,2,0],
     [0,0,0,0]
    ],
    [ //ミノ:S(緑色)
     [0,0,0,0],
     [0,3,3,0],
     [3,3,0,0],
     [0,0,0,0]
    ],
    [ //ミノ:Z(赤色)
     [0,0,0,0],
     [4,4,0,0],
     [0,4,4,0],
     [0,0,0,0]
    ],
    [ //ミノ:J(青色)
     [0,0,0,0],
     [5,0,0,0],
     [5,5,5,0],
     [0,0,0,0]
    ],
    [ //ミノ:L(橙色)
     [0,0,0,0],
     [0,0,6,0],
     [6,6,6,0],
     [0,0,0,0]
    ],
    [ //ミノ:T(紫色)
     [0,0,0,0],
     [0,7,0,0],
     [7,7,7,0],
     [0,0,0,0]
    ]
];

// tetrominoの0~6までのindex番号をランダムで取得
let random_mino = Math.floor(Math.random() * 7);

//ミノの種類によって配色を変更
function minoColor(mino_number){
    if (mino_number == 0){
        ctx.fillStyle = "#00ccff"; //水色
    }else if (mino_number == 1){
        ctx.fillStyle = "#ffff00"; //黄色
    }else if (mino_number == 2){
        ctx.fillStyle = "#00cc00"; //緑色
    }else if (mino_number == 3){
        ctx.fillStyle = "#cc0000"; //赤色
    }else if (mino_number == 4){
        ctx.fillStyle = "#0000cc"; //青色
    }else if (mino_number == 5){
        ctx.fillStyle = "#ff9900"; //橙色
    }else if (mino_number == 6){
        ctx.fillStyle = "#9900cc"; //紫色
    }
}

// 現在のテトロをcurrent_tetroに格納
let current_tetro = [];
current_tetro = tetromino[random_mino];

// current_tetroの要素が0以外の時に描画
function drawMino(){
    clearFill(col, row);
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            if (current_tetro[i][j] != 0){
                minoColor(random_mino); //ミノの種類によって配色を変更
                ctx.strokeStyle = "black";
                ctx.rect((mino_x + j) * block_size, (mino_y + i) * block_size, block_size, block_size);
                ctx.fill();
                ctx.stroke();
            }
        }
    }
}

// ミノのy座標
let mino_y = 0;
// ミノのx座標
let mino_x = 0;

// 初期のミノの描画
drawMino();

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
    mino_y++;
    drawMino();
}, drop_speed);

// キーボードを押した時のミノの操作（WASDキーと矢印キー両方同じ操作が可能）
function moveMino(){
    addEventListener("keydown", (event)=>{
        switch (event.code){
            case "KeyW": case "ArrowUp": //右回転
                // 右回転の処理
                break;
            case "KeyA": case "ArrowLeft": //左に移動
                mino_x--;
                break;
            case "KeyS": case "ArrowDown": //左回転
                // 左回転の処理
                break;
            case "KeyD": case "ArrowRight": //右に移動
                mino_x++;
                break;
            case "Space": //強制落下
                // 強制落下の処理
                break;
        }
        drawMino();
    });
}

moveMino();