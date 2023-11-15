// emptyRoom Room value is exactly one of these four strings.
// It is impossible for a Room variable to contain any other string.
// type Room = "emptyRoom" | "keyRoom" | "brightRoom" | "exit";
type Room = String | null;

export function play(): void {
	
	console.info("Welcome to the text adventure! Open your browser's developer console to play.");
	console.info("Enter EN to play in English.");
	console.info("Masukkan ID untuk bermain dalam Bahasa Indonesia.");
	console.info("「JA」を入れて日本語で遊ぶ。");
	let language: string | null = prompt("Select your language.");
	let english: string = "EN"
	let indonesian: string = "ID"
	let japanese: string = "JA"
	while (language == null || language != english || language != indonesian || language != japanese) {
		console.error("Invalid input.");
		console.info("Enter EN to play in English.");
		console.info("Masukkan ID untuk bermain dalam Bahasa Indonesia.");
		console.info("「JA」を入れて日本語で遊ぶ。");
		language = prompt("Select your language.");
	}

	switch(language) {
		case english:
			console.warn("Please enter your name.");
			break;
		case indonesian:
			console.warn("Silahkan masukkan namamu.")
			break;
		case japanese:
			console.warn("名前を入れてください")
			break;
		default:
			console.error("Unrecognized language.")
			break;
	}
	
	let playerName: string | null = "";
	switch (language) {
		case english:
			playerName = prompt("Please enter your name.");
			break;
		case indonesian:
			playerName = prompt("Silahkan masukkan namamu.")
			break;
		case japanese:
			playerName = prompt("名前を入れてください")
			break;
		default:
			console.error("Unrecognized language.")
			break;
	}

	while (playerName == null || playerName == "") {//check if no input
		
		switch (language) {
			case english:
				console.error("Invalid input.");
				playerName = prompt("Please enter your name.");
				break;
			case indonesian:
				console.error("Masukkan anda tidak valid..");
				playerName = prompt("Silahkan masukkan namamu.")
				break;
			case japanese:
				console.error("不正な入力。");
				playerName = prompt("名前を入れてください")
				break;
			default:
				console.error("Unrecognized language.")
				break;
		}
	}
	console.log(playerName);

	switch (language) {
		case english:
			console.info("Hello, " + playerName + ".");

			console.info("You are in a building. Your goal is to exit this building.");
			console.info("You are in an empty room. There are doors on the \
							north and west walls of this room.");
			break;
		case indonesian:
			console.info("Halo, " + playerName + ".");

			console.info("Anda berada di sebuah gedung. Tujuan anda adalah keluar dari gedung ini.");
			console.info("Anda berada di ruangan kosong. \
							Ada pintu di dinding utara dan dinding timur dalam ruangan ini.");
			break;
		case japanese:
			console.info("ようこそ " + playerName + "さん。");

			console.info("建物にいる。ゴールは「出る」。");
			console.info("空室にいる。北へドアがある。西にドアがある。");
			break;
		default:
			console.error("Unrecognized language.")
			break;
	}

	//initializing vars
	let currentRoom: Room = "emptyRoom";
	let hasKey: boolean = false;
	let windowOpen: boolean = false;
	let moveCount: number = 0;

	while (currentRoom != "exit") {//while still playing game
		if (moveCount > 0) {
			console.info("👣 ", moveCount);
		}

		let command: string | null = "";
		switch (language) {
			case english:
				console.warn("Please enter a command.");
				command = prompt("Please enter a command.");
				while (command == null || command == "") {//checking for valid input
					console.error("Invalid input.");
					command = prompt("Please enter a command.");
				}
				break;
			case indonesian:
				console.warn("Silahkan masukkan perintah.");
				command = prompt("Silahkan masukkan perintah.");
				while (command == null || command == "") {//checking for valid input
					console.error("Masukkan anda tidak valid.");
					command = prompt("Silahkan masukkan perintah.");
				}
				break;
			case japanese:
				console.warn("コマンドを入れてください。");
				command = prompt("コマンドを入れてください。");
				while (command == null || command == "") {//checking for valid input
					console.error("不正な入力。");
					command = prompt("コマンドを入れてください。");
				}
				break;
			default:
				console.error("Unrecognized language.")
				break;
		}
		
		console.log(command);

		switch (currentRoom) {//check which room in now
			case "emptyRoom":
				switch (command) {//check where to go from empty room
					/**
					 * EXITS:
					 * WEST -> Key Room
					 * NORTH -> Bright Room
					 */
					case "west":
					case "barat":
					case "にし":
						currentRoom = "keyRoom";
						switch (language) {
							case english:
								console.info("You go through the west door. You are in a room with a table.");
								if (hasKey) {
									console.info("There is a door on the east wall of this room.");
								}
								console.info("On the table there is a key.");
								break;
							case indonesian:
								console.info("Anda masuk melalui pintu barat. Anda berada di sebuah ruangan dengan sebuah meja.");
								if (hasKey) {
									console.info("Di dinding timur ruangan ini ada sebuah pintu.");
								}
								console.info("Di atas meja ada kunci.");
								break;
							case japanese:
								console.info("西のドアを通てテーブルがある部屋にいる。");
								if (hasKey) {
									console.info("東へドアがある。");
								}
								console.info("テーブルの上に鍵がある。");
								break;
							default:
								console.error("Unrecognized language.")
								break;
						}
						
						break;
					case "north":
					case "utara":
					case "きた":
						if (hasKey) {
							currentRoom = "brightRoom";
							console.info("You unlock the north door with the key and \
											go through the door.");
							console.info("You are in a bright room. There is a door on the south \
											wall of this room and a window on the east wall.");
						} else {
							console.error("You try to open the north door, but it is locked.");
						}
						break;
					default:
						console.error("Unrecognized command.");
						break;
				}
				break;

			case "keyRoom":
				switch (command) {//check where to go from key room
					/**
					 * EXITS:
					 * EAST -> Empty Room
					 * 
					 * COMMANDS:
					 * TAKE KEY -> take the key from the table
					 */
					case "east":
					case "timur":
					case "ひがし":
						currentRoom = "emptyRoom";
						console.info("You are in an empty room. There are doors on the north \
										and west walls of this room.");
						break;
					case "take key":
					case "ambil kunci":
					case "キーをとる":
						if (hasKey) {
							console.error("You already have the key.");
						} else {
							console.info("You take the key from the table.");
							hasKey = true;
						}
						break;
					default:
						console.error("Unrecognized command.");
						break;
				}
				break;

			case "brightRoom":
				switch (command) {//check where to go from bright room
					/**
					 * EXITS:
					 * SOUTH -> Empty Room
					 * EAST -> Window (to exit)
					 * 
					 * COMMANDS:
					 * OPEN WINDOW -> Open the window (if not already open)
					 */
					case "south":
					case "selatan":
					case "みなみ":
						currentRoom = "emptyRoom";
						console.info("You are in an empty room. There are doors on the north \
										and west walls of this room.");
						break;
					case "east":
					case "timur":
					case "ひがし":
						if (windowOpen) {
							currentRoom = "exit";
							console.info("You step out from the open window.");
						} else {
							console.error("The window is closed.");
						}
						break;
					case "open window":
					case "buka jendela":
					case "まどをあける":
						if (windowOpen) {
							console.error("The window is already open.");
						} else {
							console.info("You open the window.");
							windowOpen = true;
						}
						break;
					default:
						console.error("Unrecognized command.");
						break;
				}
				break;
			default:
				console.error("Fatal errror. Unrecognized room.");
				break;
		}
	}

	console.info("You have exited the building. You win!");
	console.info("Congratulations, " + playerName + "!");
}
