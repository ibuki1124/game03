// canvasのエレメント取得
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let block_size = 30; // 盤面のサイズ
let col = 20; //盤面の楯列
canvas.height = col * block_size; //盤面の高さ
let row = 10; //盤面の横列
canvas.width = row * block_size; //盤面の横幅
let board = [];

// 盤面の1ブロックずつ配列化
function drawBoard(col, row){
    for (let i = 0; i < col; i++){
        board.push([]);
        for (let j = 0; j < row; j++){
            board[i][j] = 0;
            // 1ブロックずつ枠線の表示
            ctx.strokeStyle = "gray";
            ctx.strokeRect(j * block_size, i * block_size, block_size, block_size);
        }
    }
}

drawBoard(col, row);

// 表示されるかの確認
board[0][0] = 1;
board[0][1] = 1;
board[1][1] = 1;
board[1][2] = 1;

// boardの要素が1の時に描画
for (let a = 0; a < col; a++){
    for (let s = 0; s < row; s++){
        if (board[a][s] == 1){
            ctx.fillStyle = "blue";
            ctx.strokeStyle = "black";
            ctx.rect(s * block_size, a * block_size, block_size, block_size);
            ctx.fill();
            ctx.stroke();
        }
    }
}