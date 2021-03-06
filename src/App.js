import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import Qs from "qs";
import Boardgame from './Game';
import "./Media.css"



class App extends Component {
	constructor() {
		super();
		this.state = {
			searchQuery: "",
			boardgamesTitles: [],
			gameIds: [],
			gameInfo: [],
			// description: [],
			minplayers: [],
			maxplayers: [],
			rating: [],
			// categories: [],
			gameImg: [],
			// publisher: []
		}
	}



	getGames = () => { 
		
		this.setState({
			boardgameTitles: [],
			gameIds: [],
			gameInfo: [],
			// description: [],
			minplayers: [],
			maxplayers: [],
			rating: [],
			categories: [],
			gameImg: [],
			publisher: []
		})

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
					search: this.state.searchQuery,
					type: "boardgame"
				},
				xmlToJSON: true
			}
		}).then((res) => {
			// console.log(res)
			const gameData = res.data.boardgames.boardgame
			// console.log(typeof gameData)	
			// console.log(gameData.length)			

			let gameIds = [];
			let boardgameTitles = [];
			
			// multiple games found, shows as array of objects
			if (gameData.length > 10) { // current limit to getting data for 10 games
				for (let i = 0; i < 10; i++) {
					if (gameData[i].name.$t !== undefined) {
						gameIds.push(gameData[i].objectid)
						boardgameTitles.push(gameData[i].name.$t)
					}
				}
			} else {
				for (let i = 0; i < gameData.length; i++) {
					if (gameData[i].name.$t !== undefined) {
						gameIds.push(gameData[i].objectid)
						boardgameTitles.push(gameData[i].name.$t)
					}
				}
			}

			// single game found, length shows up as undefined
			// type is object instead of array of objects
			if (gameData.length === undefined) {
				gameIds.push(gameData.objectid)
				boardgameTitles.push(gameData.name.$t)
			}

			

			this.setState({
				boardgamesTitles: boardgameTitles,
				gameIds: gameIds,
			});
	
			this.getGameData()
		})
	}
	
	getGameData = () => {
		// map through state id array
		this.state.gameIds.map((id) => {
			axios({
				url: 'https://proxy.hackeryou.com',
				dataResponse: 'json',
				method: 'GET',
				paramsSerializer: function (params) {
					return Qs.stringify(params, { arrayFormat: 'brackets' })
				},
				params: {
					reqUrl: `https://www.boardgamegeek.com/xmlapi/boardgame/${id}`,
					params: {
						stats: 1,
					},
					xmlToJSON: true
				}
			})

				.then((info) => {
					// console.log('returning') //info.data.boardgames.boardgame)

					const gameInfo = info.data.boardgames.boardgame

					// making general array of all game info
					const copyArray = Array.from(this.state.gameInfo);

					copyArray.push(gameInfo);
					// console.log(copyArray)

					this.setState({
						gameInfo: copyArray
					})
					// console.log(this.state.gameInfo)


					// this.getGameInfo();
				})
			return this.state.gameInfo
		})
	}



	getGameInfo = () => {      /// purpose of making these to enter into state was for incorporating firebase as stretch goal, currently not being used
		/// making an array of game images        			//// ISSSUE
		const gameImg = []

		this.state.gameInfo.map((game) => {
			gameImg.push(game.image)
			return 'gameImg'
		});

		this.setState({
			gameImg: gameImg
		})
		console.log(this.state.gameImg)




		/// making an array of min players 
		const minplayers = []
		
		this.state.gameInfo.map((game) => {
			if (game.minplayers === "0") {
				minplayers.push("N/A");
			} else {
				minplayers.push(game.minplayers);
			}
			return minplayers
		});

		this.setState({
			minplayers: minplayers
		})
		// console.log(this.state.minplayers)



		/// making an array of max players 
		const maxplayers = []

		this.state.gameInfo.map((game) => {
			if (game.maxplayers === "0") {
				maxplayers.push("N/A")
			} else {
				maxplayers.push(game.maxplayers);
			}
			return maxplayers
		});

		this.setState({
			maxplayers: maxplayers
		})
		// console.log(this.state.maxplayers)


		/// making an array of average rating
		const rating = []

		this.state.gameInfo.map((game) => {

			if (game.statistics.ratings.average === "0") {
				rating.push("0")
			} else {
				rating.push(parseFloat(game.statistics.ratings.average).toFixed(2));
			}
			return rating
		});

		this.setState({
			rating: rating
		})
		// console.log(this.state.rating)


		/// making an array of categories 
		const categories = []

		this.state.gameInfo.map((game) => {
			// console.log(game.id, game.boardgamecategory.$t);
			const oneGame = [];

			if (game.boardgamecategory.length > 0 && game.boardgamecategory !== undefined) {
				game.boardgamecategory.map((category) => {
					oneGame.push(category.$t);
					return category
				})
			}
			else {
				oneGame.push(game.boardgamecategory.$t)
			}
			categories.push(oneGame)
			return categories
		});

		this.setState({
			categories: categories
		})
		// console.log(this.state.categories)

		


	}


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
				<h1 className="wrapper">Get Your Game On!</h1>

				<form action="" onSubmit={this.handleSubmit}>
					<label htmlFor="searchQuery" className="visuallyhidden">Search for board games: </label>
					<input 
					onChange={this.handleChange} 
					value={this.state.searchQuery} 
					type="text" 
					id="searchQuery"
					placeholder="Search for board games"
					/>
					<input type="submit" value="Find games" />
				</form>




				{/* game results */}

				
				<div className="GameSection wrapper">
					{this.state.gameInfo.map((game) => {
						// console.log(game.boardgamecategory)
						return (

							<Boardgame 
								id={game.objectid}
								image={game.image}
								title={game.name.$t || game.name.map((name) => {
									if (name.primary === "true") {
										return name.$t
									}
									return game.name.$t
								})
								}

								minplayers={game.minplayers}
								maxplayers={game.maxplayers}
								categories={game.boardgamecategory.$t ||
									 game.boardgamecategory.map((category) => {
									// const categories = [];
									// categories.push(category.$t)
										return category.$t	
								})
							}

								rating={(game.statistics.ratings.average === "0") ?
									" 0"
									:
									" " + (parseFloat(game.statistics.ratings.average)).toFixed(2)}
							/>
							



						)
					}
					)}	
				</div>



			</div>
		);
	}
}

export default App;
