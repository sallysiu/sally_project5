import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import Qs from "qs";
// import Boardgame from "./Game"



class App extends Component {
	constructor() {
		super();
		this.state = {
			searchQuery: "",
			boardgames: [],
			boardgameTitles: [],
			gameIds: [],
			gameInfo: [],
			description: [],
			categories: [],
			newState: []
		}
	}
	

	getGames = () => {

		axios({
			url: 'https://proxy.hackeryou.com',
			dataResponse: 'json',
			method: 'GET',
			paramsSerializer: function (params) {
				return Qs.stringify(params, { arrayFormat: 'brackets' })
			},
			params: {
				reqUrl: "https://www.boardgamegeek.com/xmlapi/search",
				params: {
					// search: this.state.searchQuery,
					search: "avalon",
					// type: "boardgame"
				},
				xmlToJSON: true
			}
		}).then((res) => {
			// console.log(res)
			const gameData = res.data.boardgames.boardgame
			// console.log(gameData)				

			let gameIds = [];
			let boardgameTitles = [];

			// limit to finding only 10 games!!!!
			for (let i = 0; i < gameData.length; i++) {
				gameIds.push(gameData[i].objectid)
				boardgameTitles.push(gameData[i].name.$t)
			}
			console.log(gameIds)
			console.log(boardgameTitles)
			


			this.setState({
				boardgamesTitles: boardgameTitles,
				gameIds: gameIds,
				// boardgames: gameData
			});

			// console.log("hello", this.state.gameIds)
	
			// this.getGameData()

			
		})


	}


	getGameInfo2 = () => {
		// const description = [];

		console.log(this.state.gameInfo, "hello")

		this.state.gameInfo.map((game) => {
			// console.log(game.id)
		// 	console.log(game.name[0].value)
		// 	console.log(game.description)
		// 	description.push(game.description);
		// 	return description;

			return 'muffin'
		})
		// console.log(description)

		// const categories = [];
		// console.log(this.state.gameInfo)




		//////// old category finder 
		// const categories = [];

		// this.state.gameInfo[0].link.map((category) => {

		// 	if (category.type === "boardgamecategory") {
		// 		// console.log(category.value)
		// 		categories.push(category.value)
		// 	}

		// 	this.setState({
		// 		categories: categories
		// 	})
			
		// 	return 'cake'
		// })






	};


	// getGameInfo = () => {
	// 	const description = [];
	// 	this.state.gameInfo.map((game) => {
	// 		description.push(game.description);
	// 		return description;
	// 	})
	// }//getgameinfo








	handleChange = (e) => {
		// console.log(e.target.value);
		this.setState({
			[e.target.id]: e.target.value
		})
	}

	// add games for users
	handleSubmit = (e) => {
		e.preventDefault();

		this.getGames();

		// clear the form
		this.setState({
			searchQuery: ""
		})
	}
			
	



	render() {
		return (
			<div className="App">
				<h1>Games shelf</h1>

				<form action="" onSubmit={this.handleSubmit}>
					<label htmlFor="searchQuery">Search for board games:</label>
					<input 
					onChange={this.handleChange} 
					value={this.state.searchQuery} 
					type="text" 
					id="searchQuery"
					/>
					<input type="submit" value="Find games" />
				</form>


				{/* <Boardgame 
				// gameTitle={this.state.boardgamesTitles} 
				// gameId={this.state.gameIds} 
				// gameFound={this.state.boardgames}
				// gameInfo={this.state.gameInfo}
				gameInfo={this.state.newState}
				/> */}

		

			</div>
		);
	}
}

export default App;
