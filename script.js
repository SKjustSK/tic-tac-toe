/*

GameController -> 
                play round -> let the active player place a marking???
                switch active player -> switches the active player
                game status -> will tell if the game has been won/lost/tied/in process 

                player objects -> player one and two
                name, marker

GameBoard -> start game -> generate a board
            place marker at -> places marker of active player at given location
            print board -> will display board

*/

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

    // printing board
    const print = () => {
        for (let i = 0 ; i < 3 ; i++)
        {
            console.log(`${board[i][0]} | ${board[i][1]} | ${board[i][2]}`);
        }
    };

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

    return {print, placeMarkerAt, gameStatus, reset};
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
        GAME_STATE = true;
        console.log("Welcome to Tic Tac Toe!");
        board.print();
        console.log(`${activePlayer.name}'s turn`);
    };

    // place markers using playRound
    const playRound = (r, c) => {
        if (!GAME_STATE)
        {
            console.log(`Please start a new game`);
            return;
        }

        validMark = false;
        do {
            validMark = board.placeMarkerAt(r, c, activePlayer);
        }
        while (!validMark)

        let gameState = board.gameStatus(activePlayer);
        if (gameState === "ongoing")
        {
            nextRound();
        }
        else
        {
            endGame(gameState);
        }
    };

    //
    const nextRound = () => {
        switchActivePlayer();
        board.print();
        console.log(`${activePlayer.name}'s turn`);
    };

    //
    const endGame = (status) => {
        board.print();
        if (status === "won")
        {
            console.log(`${activePlayer.name} won!`);
        }
        else if (status === "tie")
        {
            console.log(`Tie!`);
        }
        GAME_STATE = false;
        board.reset();
        activePlayer = players[0];
    };

    //
    const restart = () => {
        GAME_STATE = true;
        board.reset();
        activePlayer = players[0];
        console.log(`Restarting...`);
        newGame();
    };

    return {
        newGame,
        restart,
        playRound,
    }
}


const game = GameController();