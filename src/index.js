import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props){
    return (
        <button className={`${props.winnerClass} square`} onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
  class Board extends React.Component {

    createBoard (row,col) {
      let cellCounter = 0;
      const board = [];
      for (let i=0; i<row; i++){
        const board_row = [];
        for (let j=0; j<col; j++){
          board_row.push(this.renderSquare(cellCounter++));
        }
        board.push(<div key={i} className='board-row'>{board_row}</div>);
      }
      return board;
    }

    renderSquare(i) {
      const winnerClass = this.props.winnerSquares && 
      (this.props.winnerSquares[0] === i 
        || this.props.winnerSquares[1] === i
        || this.props.winnerSquares[2] === i) ? 'square-highlight' : '';
      return (
        <Square
            winnerClass={winnerClass}
            key={i} 
            value={this.props.squares[i]}
            onClick= {() => this.props.onClick(i)}
            />
      );
    }
  
    render() {
      


      return (
        <div>
          {this.createBoard(3,3)}
        </div>
      );
    }
  }

  const newGameState = {
    history: [{ 
      squares: Array(9).fill(null),
    }],
    currentStepNumber: 0,
    xIsNext: true,
  };
  
  
  class Game extends React.Component {

    constructor(props){
        super(props);
        this.state = newGameState;
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.currentStepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares).winner || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
                row: (~~(i / 3) + 1),
                col: i % 3 + 1,
                stepNumber: history.length,
            }]),
            currentStepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        }); 
    }

    jumpTo(step){
        this.setState({
            currentStepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    sortMoves(){
      this.setState({
        history: this.state.history.reverse(),
      });
    }
    newGame(){
      this.setState(newGameState)
    }

    render() {

      const history = this.state.history;
      const current = history[this.state.currentStepNumber];
      const {winner,winnerRow} = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
          const sortedCol = step['col'] ? step['col']: '';
          const sortedRow= step['row'] ? step['row']: '';
          const rowColText = sortedCol ? `(${sortedCol}, ${sortedRow})`: '';
          const desc = step.stepNumber ?
          `Go to move #${step.stepNumber}`: 'Go to game start';
          const boldButton = move === this.state.currentStepNumber ? 'button-highlight' : ''

          return (
              <li key={move}>
                  <button className={`${boldButton}`} onClick={() => this.jumpTo(move)}>
                      {`${desc} ${rowColText}`}
                  </button>
              </li>
          )
      })
      moves[this.state.stepNumber] = <strong key={this.state.stepNumber}>{moves[this.state.stepNumber]}</strong>;
      let status;

      if (winner){
          status = 'Winner: ' + winner;
      } else if (history.length === 10) {
          status = "Draw. No one won.";
      } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      
      return (
        <div className="game">
          <div className="game-board">
            <Board 
            squares={current.squares}
            winnerSquares={winnerRow}
            onClick={(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button className="button" onClick={() => this.sortMoves()}>Sort moves</button>
            <button className="button" onClick={() => this.newGame()}>New Game</button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }



  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {winner: squares[a], winnerRow: lines[i]};
      }
    }
    return {winner: null, winnerRow: null};
  }
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
  