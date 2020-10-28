(function() {

	// Settings
	var settings = {
		'point' : 1,
		'smooth' : true,
		'showDialog' : true,
		'showAlert' : true
	};

	// Construct
	const SCRIPT_TITLE = '方向線を対称にする';
	const SCRIPT_VERSION = '0.6.0';
	const ILLUSTRATOR_VERSION = Number(app.version.split('.')[0]);

	// Get items
	var doc = app.activeDocument;
	var sel = app.selection;
	var textFrames = doc.textFrames;

	// Get text path
	var textPaths = [];
	if(sel.length === 0) {
		for (var i = 0; i < textFrames.length; i++) {
			try {
				var textPath = textFrames[i].textPath;
				if(textPath.selectedPathPoints.length > 0) textPaths.push(textPath);
			} catch(e) {
			}
		}
	} else if(sel.length === 1) {
		if(sel[0].typename === 'TextFrame' && sel[0].kind === TextType.PATHTEXT) {
			textPaths.push(sel[0].textPath);
			sel = [];
		}
	}

	// Validation
	if(!doc) {
		showAlert('対象ドキュメントがありません');
		return false;
	} else if(sel.length === 0 && textPaths.length === 0) {
		showAlert('対象オブジェクトがありません');
		return false;
	} else if(textPaths.length + sel.length > 1) {
		showAlert('複数のオブジェクトが選択されています');
		return false;
	}

	// Set the target path
	var targetPath = sel.length > 0 ? sel[0] : textPaths[0];

	// Save path point selection
	var pathPointSelection = [];
	for (var i = 0; i < targetPath.pathPoints.length; i++) {
		pathPointSelection[i] = targetPath.pathPoints[i].selected;
	}

	// Get the current layer
	var currentLayer = targetPath.typename == 'TextPath' ? targetPath.parent.layer :  targetPath.layer;

	// Get target points
	var targetPoints = getTargetPoints(targetPath);

	// Validation target points
	if(targetPoints.length < 2 || targetPoints.length > 2) {
		showAlert('セグメントを1つのみ、またはアンカーポイントを2点のみを選択してください');
		return false;
	}

	// UI dialog
	var MainDialog = function() {
		this.init();
		return this;
	};
	MainDialog.prototype.init = function() {

		var unit = 20;
		var thisObj = this;
		thisObj.dlg = new Window('dialog', SCRIPT_TITLE + ' - ver.' + SCRIPT_VERSION);
		thisObj.dlg.margins = [unit * 1.5, unit * 1.5, unit * 1.5, unit * 1.5];

		// ------------
		thisObj.original = thisObj.dlg.add('panel', undefined, '変更対象のアンカーポイント：');
		thisObj.original.minimumSize = [200, undefined];
		thisObj.original.alignment = 'left';
		thisObj.original.orientation = 'row';

		thisObj.ogroup = thisObj.original.add('group', undefined);
		thisObj.ogroup.margins = [unit / 2, unit, unit, unit / 2];
		thisObj.ogroup.alignment = 'left';
		thisObj.ogroup.orientation = 'row';

		thisObj.point = [
			thisObj.ogroup.add('radiobutton', undefined, '前'),
			thisObj.ogroup.add('radiobutton', undefined, '後')
		];
		for (var key in thisObj.point) {
			thisObj.point[key].minimumSize = [60, undefined];
			thisObj.point[key].value = false;
			thisObj.point[key].alignment = 'left';
			thisObj.point[key].addEventListener('click', preview);
			thisObj.point[key].onClick = function(){
				if(ILLUSTRATOR_VERSION >= 17) this.dispatchEvent(new UIEvent('click'));
			};
		}
		if(settings.point > thisObj.point.length - 1 || settings.point < 0 || isNaN(settings.point)) {
			settings.point = 0;
		} else {
			settings.point = Math.floor(settings.point);
		}
		thisObj.point[settings.point].value = true;

		// ------------
		thisObj.wgroup = thisObj.dlg.add('group', undefined);
		thisObj.wgroup.margins = [unit / 2, unit / 2, unit / 2, unit];
		thisObj.wgroup.alignment = 'left';
		thisObj.wgroup.orientation = 'column';

		// ------------
		thisObj.smooth = thisObj.wgroup.add('checkbox', undefined, 'スムーズポイントにする');
		if(targetPoints.length === 1) settings.smooth = true;
		thisObj.smooth.value = settings.smooth;
		thisObj.smooth.alignment = 'left';
		thisObj.smooth.addEventListener('click', preview);
		thisObj.smooth.onClick = function(){
			if(ILLUSTRATOR_VERSION >= 17) this.dispatchEvent(new UIEvent('click'));
		};

		// ------------
		thisObj.buttonGroup = thisObj.dlg.add('group', undefined);
		thisObj.buttonGroup.margins = [unit, unit * 0, unit, unit * 0];
		thisObj.buttonGroup.alignment = 'center';
		thisObj.buttonGroup.orientation = 'row';

		thisObj.cancel = thisObj.buttonGroup.add('button', undefined, 'キャンセル', {name: 'cancel'});
		thisObj.ok = thisObj.buttonGroup.add('button', undefined, '実行', { name:'ok'});

		thisObj.point[settings.point].dispatchEvent(new UIEvent('click'));

		function preview(event) {
			event.preventDefault();
			var target = event.target;
			thisObj.updateSettings();
			moveHundle(true);
			app.redraw();
			app.undo();
		}

		thisObj.ok.onClick = function() {
			try {
				thisObj.updateSettings();
				moveHundle(false);
				thisObj.closeDialog();
			} catch(e) {
				showAlert('エラーが発生して処理を実行できませんでした\nエラー内容：' + e);
			}
		}
		thisObj.cancel.onClick = function() {
			thisObj.closeDialog();
		}
	};
	MainDialog.prototype.updateSettings = function() {
		settings.smooth =　this.smooth.value;
		settings.point =　this.getSelectedIndex(this.point);

	};
	MainDialog.prototype.getSelectedIndex = function(array) {
		for (var i = 0; i < array.length; i++) {
			if(array[i].value) return i;
		}
		return -1;
	};
	MainDialog.prototype.showDialog = function() {
		this.dlg.show();
	};
	MainDialog.prototype.closeDialog = function() {
		this.dlg.close();
	};

	var dialog = new MainDialog();
	if(settings.showDialog) {
		dialog.showDialog();
	} else {
		try {
			moveHundle(false);
		} catch(e) {
			showAlert('エラーが発生して処理を実行できませんでした\nエラー内容：' + e);
		}
	}

	// Constructor of point
	function Point(pathpoint, isReverse) {
		this.pt = pathpoint;
		this.md = isReverse ? 'leftDirection' : 'rightDirection';
		this.sd = isReverse ? 'rightDirection' : 'leftDirection';
		return this;
	};

	// Main process
	function moveHundle(preview) {

		// Get target points
		var base = targetPoints[Math.abs(settings.point - 1)];
		var move = targetPoints[settings.point];

		var moveDirectionPoint;

		if(base.pt.anchor[0] !== base.pt[base.md][0] || base.pt.anchor[1] !== base.pt[base.md][1]) {

			// Angle and distance of the base point
			var directionRadian = getRadianFrom3Point(base.pt[base.md], base.pt.anchor, move.pt.anchor);
			var directionDistance = getDistance(base.pt.anchor, base.pt[base.md]);

			// distance between base point and move point
			var anchorRadian = getRadian(base.pt.anchor, move.pt.anchor);
			var anchorDistance = getDistance(base.pt.anchor, move.pt.anchor);

			// Coordinate(x) of the base point hundle
			var baseDirectionX = directionDistance * Math.cos(directionRadian);

			// Distance between base point hundle and move point hundle
			var directionDistance = anchorDistance - baseDirectionX * 2;

			// Offset of move point hundle
			var offset = {
				'x' : directionDistance * Math.cos(anchorRadian),
				'y' : directionDistance * Math.sin(anchorRadian)
			};
			moveDirectionPoint = [base.pt[base.md][0] + offset.x, base.pt[base.md][1] + offset.y];
			// Move sub direction
			if(settings.smooth) {
				var subDirectionRadian = getRadian(moveDirectionPoint, move.pt.anchor);
				var subDirectionDistance = getDistance(move.pt[move.sd], move.pt.anchor);
				var subDirectionOffset = {
					'x' : subDirectionDistance * Math.cos(subDirectionRadian),
					'y' : subDirectionDistance * Math.sin(subDirectionRadian)
				}
				move.pt[move.sd] = [move.pt.anchor[0] + subDirectionOffset.x, move.pt.anchor[1] + subDirectionOffset.y];
				move.pt.pointType = PointType.SMOOTH;
			}

		} else {
			moveDirectionPoint = move.pt.anchor;
			if(settings.smooth) {
				move.pt.pointType = PointType.SMOOTH;
			}
		}

		// Move hundle
		move.pt[move.md] = moveDirectionPoint;


		// Draw preview Elements
		if(preview) {

			drawLine(base.pt.anchor, move.pt.anchor, 1, 0.3, true);
			drawLine(base.pt[base.md], move.pt[move.md], 1, 0.3, true);

			var baseLines = [
				drawLine(base.pt[base.md], base.pt.anchor, 1, 1, true),
				drawLine(base.pt[base.sd], base.pt.anchor, 1, 1, true)
			];
			var baseCircles = [
				drawCircle(base.pt[base.md], 6, 1),
				drawCircle(base.pt[base.sd], 6, 1)
			];

			var moveLines = [
				drawLine(move.pt[move.md], move.pt.anchor, 1, 1, false),
				drawLine(move.pt[move.sd], move.pt.anchor, 1, 1, false)
			];
			var moveCircles = [
				drawCircle(move.pt.anchor, 10, 1),
				drawCircle(move.pt[move.md], 6, 1),
				drawCircle(move.pt[move.sd], 6, 1)
			];

			var subColor;
			var dcs = doc.documentColorSpace;
			if(dcs === DocumentColorSpace.CMYK) {
				subColor = new CMYKColor();
				subColor.black = 50;
				subColor.cyan = 0;
				subColor.magenta = 0;
				subColor.yellow = 0;
			} else {
				subColor = new RGBColor();
				subColor.red = 128;
				subColor.green = 128;
				subColor.blue = 128;
			}
			for (var i = 0; i < baseLines.length; i++) {
				baseLines[i].strokeColor = subColor;
			}
			for (var i = 0; i < baseCircles.length; i++) {
				baseCircles[i].fillColor = subColor;
			}

		}

		// Reselect target points
		for (var i = 0; i < targetPath.pathPoints.length; i++) {
			targetPath.pathPoints[i].selected = pathPointSelection[i];
		}

	}

	// Get distance from 2 points
	function getDistance(p1, p2) {
		return Math.sqrt(Math.pow( p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
	}

	// Get angle from 3 points
	function getRadianFrom3Point(p1, p2, p3) {
		var points = [
			{
				'x' : p1[0],
				'y' : p1[1]
			},
			{
				'x' : p2[0],
				'y' : p2[1]
			},
			{
				'x' : p3[0],
				'y' : p3[1]
			},
		];
		 
		var ba = [points[0].x - points[1].x, points[0].y - points[1].y]
		var bc = [points[2].x - points[1].x, points[2].y - points[1].y];

		var babc = ba[0] * bc[0] + ba[1] * bc[1];
		var ban = (ba[0] * ba[0]) + (ba[1] * ba[1]);
		var bcn = (bc[0] * bc[0]) + (bc[1] * bc[1]);
		var radian = Math.acos(babc / (Math.sqrt(ban * bcn)));
		return radian;
	}

	// Get angle from 2 points
	function getRadian(p1, p2) {
		return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
	}

	// Draw line
	function drawLine(from, to, strokeWidth, opacity, dashed) {

		var sw = 1 / doc.views[0].zoom * strokeWidth;

		var line = currentLayer.pathItems.add();
		line.setEntirePath([from, to]);
		var color;
		var dcs = doc.documentColorSpace;
		if(dcs === DocumentColorSpace.CMYK) {
			color = new CMYKColor();
			color.black = 0;
			color.cyan = 0;
			color.magenta = 100;
			color.yellow = 0;
		} else {
			color = new RGBColor();
			color.red = 255;
			color.green = 0;
			color.blue = 128;
		}
		line.filled = false;
		line.stroked = true;
		line.strokeWidth = sw;
		line.strokeColor = color;
		line.opacity = opacity * 100;
		if(dashed) line.strokeDashes = [sw * 2, sw * 2];
		// line.name = settings.pathName;

		return line;
	}

	// Draw circle
	function drawCircle(point, diameter, opacity) {

		var di = 1 / doc.views[0].zoom * diameter;

		var size = 10;
		var cir = currentLayer.pathItems.ellipse(point[1] + di / 2, point[0] - di / 2, di, di);
		var color;
		var dcs = doc.documentColorSpace;
		if(dcs == DocumentColorSpace.CMYK) {
			color = new CMYKColor();
			color.black = 0;
			color.cyan = 0;
			color.magenta = 100;
			color.yellow = 0;
		} else {
			color = new RGBColor();
			color.red = 255;
			color.green = 0;
			color.blue = 128;
		}
		cir.stroked = false;
		cir.filled = true;
		cir.fillColor = color;
		cir.opacity = opacity * 100;
		return cir;
	}

	// Get target path points
	function getTargetPoints(selectedItem) {
		var points = [];
		if(selectedItem.typename == 'PathItem' || selectedItem.typename == 'TextPath') {
			for(i = 0; i < selectedItem.pathPoints.length; i++) {
				if(selectedItem.pathPoints[i].selected === PathPointSelection.ANCHORPOINT) {
					var reverse = points.length > 0;
					points.push(new Point(selectedItem.pathPoints[i], reverse));
				}
			}
			if(points.length < 2) {
				points = [];
				if(selectedItem.pathPoints.length > 1 && selectedItem.selectedPathPoints.length !== 1 && selectedItem.pathPoints[0].selected === PathPointSelection.ANCHORPOINT) {
					points.push(new Point(selectedItem.pathPoints[0], false));
					points.push(new Point(selectedItem.pathPoints[1], true));
				} else if(selectedItem.pathPoints.length > 1 && selectedItem.selectedPathPoints.length !== 1 && selectedItem.pathPoints[selectedItem.pathPoints.length - 1].selected === PathPointSelection.ANCHORPOINT) {
					points.push(new Point(selectedItem.pathPoints[selectedItem.pathPoints.length - 2], false));
					points.push(new Point(selectedItem.pathPoints[selectedItem.pathPoints.length - 1], true));
				}
			}
			if(points.length < 2) {
				for(i = 0; i < selectedItem.pathPoints.length; i++) {
					var nextIndex = i == selectedItem.pathPoints.length - 1 ? 0 : i + 1;
					if(i == selectedItem.pathPoints.length - 1 && !selectedItem.closed) break;
					if((selectedItem.pathPoints[i].selected === PathPointSelection.RIGHTDIRECTION && selectedItem.pathPoints[nextIndex].selected === PathPointSelection.LEFTDIRECTION) || (selectedItem.pathPoints[i].selected === PathPointSelection.ANCHORPOINT && selectedItem.pathPoints[nextIndex].selected === PathPointSelection.ANCHORPOINT)) {
						points.push(new Point(selectedItem.pathPoints[i], false));
						points.push(new Point(selectedItem.pathPoints[nextIndex], true));
					}
				}
			}
		}
		return points;
	}

	// Show alert
	function showAlert(message) {
		if(settings.showAlert) alert(message);
	}
}());