import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props){
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
  class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]}
            onClick= {() => this.props.onClick(i)}
            />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            row: [],
            col: [],
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        //const new_row = this.state.row.slice();
        //const new_col = this.state.col.slice();

        

        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
                row: (~~(i / 3) + 1),
                col: i % 3 + 1,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            // this doesnt work, inf array
            //row: new_row.concat([~~(i / 3) + 1]),
            //col: new_col.concat([i % 3 + 1]),
        }); 
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {

      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
          //TODO: fix so that current move is bolded only, atm all buttons are bolded.
          const currentCol = step['col'];
          const currentRow = step['row'];
          const desc = move ?
          'Go to move #' + move + ' (' + currentCol + ', ' + currentRow +  ')' : 'Go to game start';
          const boldDesc = <strong>{desc}</strong>;
          return (
              <li key={move}>
                  <button onClick={() => this.jumpTo(move)}>
                      {boldDesc}
                  </button>
              </li>
          )
      })
      
    

      let status;

      if (winner){
          status = 'Winner: ' + winner;
      } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      
      return (
        <div className="game">
          <div className="game-board">
            <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
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
        return squares[a];
      }
    }
    return null;
  }
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
  