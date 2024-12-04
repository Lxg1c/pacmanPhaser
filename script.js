class Pacman extends Phaser.Scene {
	constructor() {
		super()
		this.pacman = null
		this.direction = null
		this.previousDirection = 'left'
		this.blockSize = 16
		this.board = []
		this.speed = 170
		this.intersections = []
		this.nextIntersection = null
	}

	preload() {
		// Загружаем спрайты, карту

		// Tile Set
		this.load.image('tileset', './assets/tiles/tileset.png')

		// Json файл с местоположением стен карты
		this.load.tilemapTiledJSON('map', './assets/tiles/pacman-map.json')

		// Загружаем пакмана
		this.load.spritesheet('pacman1', './assets/pacman/pacman1.png', {
			frameWidth: 32,
			frameHeight: 32,
		})

		this.load.spritesheet('pacman2', './assets/pacman/pacman2.png', {
			frameWidth: 32,
			frameHeight: 32,
		})

		this.load.spritesheet('pacman3', './assets/pacman/pacman3.png', {
			frameWidth: 32,
			frameHeight: 32,
		})

		this.load.spritesheet('pacman4', './assets/pacman/pacman4.png', {
			frameWidth: 32,
			frameHeight: 32,
		})

		// Загружаем спрайт еды
		this.load.image('dot', './assets/items/dot.png')
	}

	create() {
		// Создаем объект tile set-а
		this.map = this.make.tilemap({ key: 'map' })

		console.log(this.map)

		const tileset = this.map.addTilesetImage('tileset')

		// Добавляем слой на карту
		const layer = this.map.createLayer('Tile Layer 1', [tileset])

		// Включаем коллизию у layer
		layer.setCollisionByExclusion(-1, true)

		// Создаем пакмана
		this.pacman = this.physics.add.sprite(230, 432, 'pacman1')

		// Создание анимации пакмана
		this.anims.create({
			key: 'pacmanAnim',
			frames: [
				{ key: 'pacman1' },
				{ key: 'pacman2' },
				{ key: 'pacman3' },
				{ key: 'pacman4' },
			],
			frameRate: 8,
			repeat: -1,
		})
		this.pacman.play('pacmanAnim')

		// Включаем коллизию между пакманом и слоем
		this.physics.add.collider(this.pacman, layer)

		// Создаем еду
		this.dots = this.physics.add.group()

		this.populateBoardAndTrackEmptyTiles(layer)

		this.physics.add.overlap(this.pacman, this.dots, this.eatDot, null, this)

		// Включаем отслеживание клавиш перемещения
		this.cursors = this.input.keyboard.createCursorKeys()
	}

	update() {}

	populateBoardAndTrackEmptyTiles(layer) {
		layer.forEachTile(tile => {
			if (!this.board[tile.y]) {
				this.board[tile.y] = []
			}
			// Save the index of the tile in the board
			this.board[tile.y][tile.x] = tile.index

			if (
				tile.y < 4 ||
				(tile.y > 11 && tile.y < 23 && tile.x > 6 && tile.x < 21) ||
				(tile.y === 17 && tile.x !== 6 && tile.x !== 21)
			)
				return
			let rightTile = this.map.getTileAt(
				tile.x + 1,
				tile.y,
				true,
				'Tile Layer 1'
			)
			let bottomTile = this.map.getTileAt(
				tile.x,
				tile.y + 1,
				true,
				'Tile Layer 1'
			)
			let rightBotomTile = this.map.getTileAt(
				tile.x + 1,
				tile.y + 1,
				true,
				'Tile Layer 1'
			)

			if (
				tile.index === -1 &&
				rightTile &&
				rightTile.index === -1 &&
				bottomTile &&
				bottomTile.index === -1 &&
				rightBotomTile &&
				rightBotomTile.index === -1
			) {
				const x = tile.x * tile.width
				const y = tile.y * tile.height
				this.dots.create(x + tile.width, y + tile.height, 'dot')
			}
		})
	}
}

const config = {
	type: Phaser.AUTO,
	width: 464,
	height: 560,
	parent: 'boardContainer',
	backgroundColor: '#000',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false,
		},
	},
	scene: Pacman,
}

const game = new Phaser.Game(config)
