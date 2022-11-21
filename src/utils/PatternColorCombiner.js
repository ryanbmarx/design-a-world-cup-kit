import * as colorUtil from "./colors";

export class PatternColorCombiner {
	constructor(uniformImageURL, THREE) {
		this.THREE = THREE;
		this.uniformImage = new Image();
		this.uniformImage.crossOrigin = 'Anonymous';
		this.uniformImage.src = uniformImageURL;
		this.patternImage = null;
		this.patchImage = null;
		this.primaryColor = null;
		this.patternColor = null;
		this.useNumber = false;
		this.combineCanvas = document.createElement("canvas");
		this.combineContext = this.combineCanvas.getContext("2d");
		this.patternCanvas = document.createElement("canvas");
		this.patternContext = this.patternCanvas.getContext("2d");

		this.uniformImage.addEventListener("load", event => {
			this.combineCanvas.width = event.currentTarget.width;
			this.combineCanvas.height = event.currentTarget.height;
			this.patternCanvas.width = event.currentTarget.width;
			this.patternCanvas.height = event.currentTarget.height;
		});
	}

	setMaterial(material) {
		this.material = material;
		this.material.map = new this.THREE.CanvasTexture(this.combineCanvas);
		this.combineImagesAndColors();
	}

	updatePrimaryColor(primaryColor) {
		this.primaryColor = this.convertColor3to6digit(primaryColor);
		this.combineImagesAndColors();
	}

	updatePatternColor(patternColor) {
		if(!patternColor) patternColor = "#FFFFFF";
		this.patternColor = this.convertColor3to6digit(patternColor);
		if (this.patternContext != null) {
			// Draw pattern first
			if (this.patternImage != null) {
				this.patternContext.globalCompositeOperation = "source-in";
				this.patternContext.drawImage(this.patternImage, 0, 0);
			}

			// Multiply by the pattern color
			// white * color = color, black * color = black
			if (this.patternColor != null) {
				this.patternContext.globalCompositeOperation = "multiply";
				this.patternContext.fillStyle = this.patternColor;
				this.patternContext.fillRect(
					0,
					0,
					this.patternCanvas.width,
					this.patternCanvas.height
				);
			}

			// Restore the transparency
			if (this.patternImage != null) {
				this.patternContext.globalCompositeOperation = "destination-atop";
				this.patternContext.drawImage(this.patternImage, 0, 0);
			}

			this.combineImagesAndColors();
		}
	}

	updatePatternImage(patternImage) {
		this.patternImage = patternImage;
		this.updatePatternColor(this.patternColor);
	}

	updateNumber(number) {
		this.useNumber = number.length > 0;
		this.jerseyNumber = number;
		this.combineImagesAndColors();
	}

	updatePatchImage(patchImage) {
		this.patchImage = patchImage;
		this.combineImagesAndColors();
	}

	combineImagesAndColors() {
		if (this.uniformImage != null) {
			this.combineContext.globalCompositeOperation = "source-over";
			// Primary color - if no color yet fill with white
			if (this.primaryColor != null) {				
				this.combineContext.fillStyle = this.primaryColor;
			} else {
				this.combineContext.fillStyle = "#FFFFFF";
			}
			this.combineContext.fillRect(
				0,
				0,
				this.combineCanvas.width,
				this.combineCanvas.height
			);

			// Pattern with pattern color
			if (this.patternImage != null) {
				this.combineContext.drawImage(this.patternCanvas, 0, 0);
			}

			// Patch 
			if (this.patchImage != null) {
				this.combineContext.drawImage(this.patchImage, 240, 190, 75, 75);
			}

			// Update number if using it
			if (this.useNumber) {
				let sizePx = 200 - 25 * this.jerseyNumber.length;
				this.combineContext.textAlign = "center";
				this.combineContext.textBaseline = "middle";
				if(this.primaryColor == null) {
					this.combineContext.fillStyle = "#000000";
				} else {
					this.combineContext.fillStyle = colorUtil.getOverlayColor(this.primaryColor);
				}
				this.combineContext.font = "" + sizePx + "px 'Bebas Neue', monospace";
				this.combineContext.fillText(this.jerseyNumber, 790, 200);
				this.combineContext.lineWidth = 2;
				this.combineContext.strokeText(this.jerseyNumber, 790, 200);
			}

			// Lastly blend with uniform
			this.combineContext.globalCompositeOperation = "multiply";
			this.combineContext.drawImage(this.uniformImage, 0, 0);

			// Update the material
			if (this.material != null) {
				this.material.map.needsUpdate = true;
			}
		}
	}

	reset() {
		this.useNumber = false;
		this.primaryColor = null;
		this.patternColor = null;
		this.patternImage = null;
		this.patchImage = null;
		this.combineImagesAndColors();
	}

	convertColor3to6digit(color) {
		if (color == null) return null;

		if (color[0] != "#") {
			color = "#" + color;
		}
		if (color.length < 7) {
			color = color
				.split("")
				.map(item => {
					if (item == "#") {
						return item;
					}
					return item + item;
				})
				.join("");
		}
		return color;
	}
}
