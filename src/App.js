import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import _ from "lodash"

function getAllIndexes(arr, val) {
	var indexes = [],
		i;
	for (i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);
	return indexes;
}

class Check extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div
				style={{
					color: this.props.tickValue == "x" ? "#ee6e73" : "#02d1b2"
				}}
				className="tick-box"
				onClick={value => this.props.setValue(this.props.value)}>
				{this.props.tickValue}
			</div>
		);
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			moves: [null, null, null, null, null, null, null, null, null],
			firstPlayer: "x",
			secondPlayer: "o",
			mode: "firstPlayer"
		};
		this.createBoard = this.createBoard.bind(this);
		this.tick = this.tick.bind(this);
		this.checkWin = this.checkWin.bind(this);
		this.chooseXO = this.chooseXO.bind(this);
		this.miniMax = this.miniMax.bind(this);
		this.godMode = this.godMode.bind(this);
		this.winCombo = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[6, 4, 2]
		];
	}

	chooseXO(value) {
		console.log("st");
		if (value == "x") {
			this.setState({
				moves: Array(9).fill(null),
				firstPlayer: "x",
				secondPlayer: "o",
				mode: "firstPlayer"
			});
		} else if (value == "o") {
			this.setState({
				moves: Array(9).fill(null),
				firstPlayer: "o",
				secondPlayer: "x",
				mode: "firstPlayer"
			});
		}
	}

	miniMax(board, player, origPlayer, origOpponent) {
		let opponent = player == "x" ? "o" : "x";
		let tempBoard = JSON.parse(JSON.stringify(board));
		let freeSlots = getAllIndexes(tempBoard, null);
		if (this.checkWin(tempBoard, origPlayer) == "win") {
			return { score: 1 };
		} else if (this.checkWin(tempBoard, origOpponent) == "win") {
			return { score: -1 };
		} else if (freeSlots.length == 0) {
			return { score: 0 };
		} else {
			let scores = [];
			for (let o of freeSlots) {
				tempBoard[o] = player;
				let score = this.miniMax(
					tempBoard,
					opponent,
					origPlayer,
					origOpponent
				).score;
				tempBoard[o] = null;
				scores.push({ index: o, score: score });
			}
			if (player == origPlayer) {
				return _.maxBy(scores, "score");
			} else if (player == origOpponent) {
				return _.minBy(scores, "score");
			}
		}
	}

	godMode() {
		let mode = this.state.computer ? false : true;
		this.setState({
			moves: Array(9).fill(null),
			mode: "firstPlayer",
			computer: mode
		});
	}

	checkGameStatus(value) {
		if (this.checkWin(this.state.moves, value) == "win") {
			alert(
				this.state.firstPlayer == value
					? "first player win"
					: "second player win"
			);
			this.setState({
				moves: Array(9).fill(null),
				mode: "firstPlayer"
			});
		} else if (this.checkWin(this.state.moves, value) == "tie") {
			alert("It's a tie");
			this.setState({
				moves: Array(9).fill(null),
				mode: "firstPlayer"
			});
		} else if (this.state.computer && this.state.mode == "secondPlayer") {
			let ultimateSmackDown = this.miniMax(
				this.state.moves,
				this.state.secondPlayer,
				this.state.secondPlayer,
				this.state.firstPlayer
			).index;
			this.tick(ultimateSmackDown);
		}
	}

	checkWin(board, value) {
		let arr = getAllIndexes(board, value);
		let winner = false;
		for (let o of this.winCombo) {
			if (_.intersection(o, arr).length == 3) {
				winner = true;
				return "win";
			}
		}
		if (!winner && this.state.moves.indexOf(null) == -1) {
			return "tie";
		}
	}

	tick(value) {
		let tick =
			this.state.mode == "firstPlayer"
				? this.state.firstPlayer
				: this.state.secondPlayer;
		let mode =
			this.state.mode == "firstPlayer" ? "secondPlayer" : "firstPlayer";
		if (!this.state.moves[value]) {
			let tempArr = this.state.moves;
			tempArr[value] = tick;
			this.setState(
				{
					moves: tempArr,
					mode: mode
				},
				() => this.checkGameStatus(tick)
			);
		}
	}

	createBoard() {
		let arr = [];
		for (let i = 0; i < 9; i++) {
			arr.push(
				<Check
					key={i}
					mode={this.state.mode}
					setValue={this.tick}
					value={i}
					tickValue={this.state.moves[i]}
				/>
			);
		}
		return arr;
	}

	render() {
		return (
			<div>
				<div className="board">{this.createBoard()}</div>
				<div className="control">
					<div>
						<h3>I want to be</h3>
						<div
							className="radio-wrapper"
							onClick={() => this.chooseXO("x")}>
							<div
								className={
									this.state.firstPlayer == "x"
										? "radio-tile active"
										: "radio-tile"
								}>
								X
							</div>
						</div>
						<div
							className="radio-wrapper"
							onClick={() => this.chooseXO("o")}>
							<div
								className={
									this.state.firstPlayer == "o"
										? "radio-tile active"
										: "radio-tile"
								}>
								O
							</div>
						</div>
					</div>
					<div>
						<h3>Bot mode</h3>
						<button
							className={this.state.computer ? "active" : ""}
							onClick={() => this.godMode()}>
							{this.state.computer ? "that's enough" : "fight me"}
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
