const game = GameController();
const gameDOM = DOMcontroller();
game.newGame();

// Restart button
const restart = document.querySelector(".restart-game");
restart.addEventListener('click', () => {
    game.restart();
    gameDOM.reset();
});


function GameBoard () {
    // Creating 3x3 board
    let board = [];
    for (let i = 0 ; i < 3 ; i++)
    {
        board[i] = []
        for (let j = 0 ; j < 3 ; j++)
        {
            board[i][j] = '*';
        }
    }

    
    // place marker
    const placeMarkerAt = (row, column, activePlayer) => {
        const value = board[row][column];

        if (value === '*')
        {
            board[row][column] = activePlayer.marker;
            return true;
        }
        else 
        {
            console.log("Invalid location, try again");
            return false;
        }
    };

    // resetting board
    const reset = () => {
        for (let i = 0 ; i < 3 ; i++)
        {
            for (let j = 0 ; j < 3 ; j++)
            {
                board[i][j] = '*';
            }
        }
    };

    // check status
    const gameStatus = (activePlayer) => {
        let marker = activePlayer.marker;
        
        const rowCheck = (() => {
            win = false;
            for (let i = 0 ; i < 3 ; i++)
            {
                let val0 = board[i][0];
                let val1 = board[i][1];
                let val2 = board[i][2];
                
                if (marker === val0 && marker === val1 && marker == val2)
                {
                    win = true;
                    break;
                }
            }
            return win;
        })();
        
        const colCheck = (() => {
            win = false;
            for (let i = 0 ; i < 3 ; i++)
            {
                let val0 = board[0][i];
                let val1 = board[1][i];
                let val2 = board[2][i];
                
                if (marker === val0 && marker === val1 && marker == val2)
                {
                    win = true;
                    break;
                }
            }
            return win;
        })();
        
        const diagCheck = (() => {
            // equal index check
            win1 = board[0][0] === marker && board[1][1] === marker && board[2][2] === marker;

            // index addition = 2 check
            win2 = board[0][2] === marker && board[1][1] === marker && board[2][0] === marker;
            
            return win1 || win2;
        })();
        
        // checks if board is filled
        const filled = (() => {
            let fill = true;
            
            for (let i = 0 ; i < 3 ; i++)
            {
                for (let j = 0 ; j < 3 ; j++)
                {
                    if (board[i][j] === "*")
                    {
                        fill = false;
                    }
                }
            }
            return fill;
        })();

        let status = "ongoing";
        if (rowCheck || colCheck || diagCheck)
        {
            status = "won";
        }
        else if (filled)
        {
            status = "tie";
        }
        
        return status;
    }
    
    // printing board
    // const print = () => {
    //     for (let i = 0 ; i < 3 ; i++)
    //     {
    //         console.log(`${board[i][0]} | ${board[i][1]} | ${board[i][2]}`);
    //     }
    // };

    return {placeMarkerAt, gameStatus, reset, /*print*/};
}

function GameController () {
    
    let p1name = "Player 1";
    let p2name = "Player 2";
    let GAME_STATE = true;
    
    const players = [
        {
            name: p1name,
            marker: 'X',
        },
        {
            name: p2name,
            marker: 'O',
        }
    ];
    
    let activePlayer = players[0];
    
    const switchActivePlayer = () => {
        if (activePlayer === players[0])
        {
            activePlayer = players[1];
        }
        else
        {
            activePlayer = players[0];
        }
    };

    let board = GameBoard();

    // starting a new game
    const newGame = () => {
        board.reset();
        activePlayer = players[0];
        GAME_STATE = true;
        // console.log("Welcome to Tic Tac Toe!");
        // board.print();
        // console.log(`${activePlayer.name}'s turn`);
    };

    // place markers using playRound
    const playRound = (r, c) => {
        if (!GAME_STATE)
        {
            // console.log(`Please start a new game`);
            return -1;
        }

        let validMarker = board.placeMarkerAt(r, c, activePlayer);
        if (!validMarker)
        {
            return -1;
        }

        let gameState = board.gameStatus(activePlayer);
        if (gameState === "ongoing")
        {
            nextRound();
        }
        else
        {
            endGame(gameState);
        }
        return 1;
    };

    //
    const nextRound = () => {
        switchActivePlayer();
        // board.print();
        // console.log(`${activePlayer.name}'s turn`);
    };

    //
    const endGame = (status="aborted") => {
        // // board.print();
        // if (status === "won")
        // {
        //     console.log(`${activePlayer.name} won!`);
        // }
        // else if (status === "tie")
        // {
        //     console.log(`Tie!`);
        // }
        // else if (status === "aborted")
        // {
        //     console.log(`Game Aborted.`);
        // }
        GAME_STATE = false;
        return status;
    };

    //
    const restart = () => {
        GAME_STATE = true;
        board.reset();
        activePlayer = players[0];
        // console.log(`Restarting...`);
        newGame();
    };

    //
    const getActivePlayer = () => {
        return activePlayer;
    }

    return {
        newGame,
        restart,
        playRound,
        getActivePlayer,
        gameStatus: board.gameStatus,
    }
}

function DOMcontroller () {
    
    // Generates 3x3 grid of tic tac toe
    const ttt_grid = document.querySelector('.ttt-grid');
    const gen3x3ttt = ((appendTo) => {
        for (let i = 0 ; i < 3 ; i++)
        {
            for (let j = 0 ; j < 3 ; j++)
            {
                let btn = document.createElement('button');
                btn.classList.add(`ttt-box-${i}${j}`);
                btn.classList.add(`ttt-box`);
                
                btn.addEventListener('click', () => {playMarker(i, j);});

                appendTo.append(btn);
            } 
        }
    })(ttt_grid);
    
    // Adding markers to tic tac toe board
    const playMarker = (row, col) => {
        let activePlayer = game.getActivePlayer();
        
        let validRound = game.playRound(row, col);
        updateGameStatus();
        if (validRound == -1)
        {
            return -1;
        }

        let ttt_box = document.querySelector(`.ttt-box-${row}${col}`);
        if (activePlayer.marker === "X")
        {
            ttt_box.classList.add(`x_marker`);
        }
        else if (activePlayer.marker === "O")
        {
            ttt_box.classList.add(`o_marker`);
        }
    };

    const updateGameStatus = () => {
        let game_status_text = document.querySelector('.game-status-text');
        
        let game_status = game.gameStatus(game.getActivePlayer());
        if (game_status === "ongoing")
        {
            game_status_text.textContent = `${game.getActivePlayer().name}'s Turn`;
        }
        else if (game_status === "won")
        {
            game_status_text.textContent = `${game.getActivePlayer().name} won!`;
        }
        else if (game_status === "tie")
        {
            game_status_text.textContent = `Tie!`;
        }
    };

    const reset = () => {
        // board DOM reset
        for (let i = 0 ; i < 3 ; i++)
        {
            for (let j = 0 ; j < 3 ; j++)
            {
                let btn = document.querySelector(`.ttt-box-${i}${j}`);
                btn.classList.remove(`x_marker`);
                btn.classList.remove(`o_marker`);
            } 
        }

        // Game status DOM reset
        let game_status_text = document.querySelector('.game-status-text');
        game_status_text.textContent = `${(game.getActivePlayer()).name}'s Turn`;
    };

    return {
        reset,
    };
}

