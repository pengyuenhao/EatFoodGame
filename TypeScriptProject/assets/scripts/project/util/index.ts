export function spriteRes(resourceUrl) {
	return new Promise((resolve, reject) => {
		cc.loader.loadRes(resourceUrl, cc.SpriteFrame, (err, spriteFrame) => {
			if (err) throw err
			resolve(spriteFrame)
		})
	})
}

export function randomCoin() {
	return Math.round(Math.random())
}

export function randomNumber(size) {
	return Math.floor(Math.random() * size)
}

export function randomValue(...values) {
	return values[randomNumber(values.length)]
}

