var Maze2D;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ts/Cell.ts":
/*!********************!*\
  !*** ./ts/Cell.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Cell = void 0;
//Corey Wunderlich 2022
//https://www.wundervisionenvisionthefuture.com/
class Cell {
    constructor() {
        this._front = null;
        this._right = null;
        this._back = null;
        this._left = null;
    }
    get Front() { return this._front; }
    get Right() { return this._right; }
    get Back() { return this._back; }
    get Left() { return this._left; }
    set Front(value) { this._front = value; }
    set Right(value) { this._right = value; }
    set Back(value) { this._back = value; }
    set Left(value) { this._left = value; }
}
exports.Cell = Cell;


/***/ }),

/***/ "./ts/Maze.ts":
/*!********************!*\
  !*** ./ts/Maze.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Maze = void 0;
//Corey Wunderlich 2022
//https://www.wundervisionenvisionthefuture.com/
const MazeCell_1 = __webpack_require__(/*! ./MazeCell */ "./ts/MazeCell.ts");
class Maze {
    constructor(size_x, size_y) {
        this._size_x = size_x;
        this._size_y = size_y;
        this._grid = [];
        for (let y = 0; y < this._size_y; y++) {
            let row = [];
            for (let x = 0; x < this._size_x; x++) {
                const c = new MazeCell_1.MazeCell(x, y);
                if (y == 0) {
                    c.Back = MazeCell_1.MazeWall;
                }
                else if (y == this._size_y - 1) {
                    c.Front = MazeCell_1.MazeWall;
                }
                if (x == 0) {
                    c.Left = MazeCell_1.MazeWall;
                }
                else if (x == this._size_x - 1) {
                    c.Right = MazeCell_1.MazeWall;
                }
                row.push(c);
            }
            this._grid.push(row);
        }
    }
    get SizeX() { return this._size_x; }
    get SizeY() { return this._size_y; }
    *CellsItr() {
        for (let y = 0; y < this._size_y; y++) {
            for (let x = 0; x < this._size_x; x++) {
                yield this._grid[y][x];
            }
        }
        return;
    }
    GetCell(v) {
        return this.GetCellXY(v.X, v.Y);
    }
    GetCellXY(x, y) {
        if (x < 0 || x >= this._size_x || y < 0 || y >= this._size_y) {
            return MazeCell_1.MazeWall;
        }
        return this._grid[y][x];
    }
    Finalize() {
        const iterator = this.CellsItr();
        let itr_ptr = iterator.next();
        while (itr_ptr.done == false) {
            itr_ptr.value.Barricade();
            itr_ptr = iterator.next();
        }
    }
    static Generate(start_x, start_y, width, height) {
        const maze = new Maze(width, height);
        let current_cell = maze.GetCellXY(start_x, start_y);
        if (current_cell == null) {
            throw "Invalid Start Coordinates";
        }
        current_cell.Connected = true;
        // const end_point = new Vector(99,99);
        const path_stack = [];
        //While we are not at the endpoint
        //while(!current_cell.Position.Equals(end_point)){
        while (true) {
            //console.log(`${current_cell.Position.X} ${current_cell.Position.Y}`);
            //get all possible directions to move
            let vectors = current_cell.AvailableVectors;
            //If there is no where to go, back up
            if (vectors.length == 0) {
                //If there are no more cells to back up..
                //then something weird is happening break out
                if (path_stack.length == 0) {
                    break;
                }
                let stack_pop = path_stack.pop();
                if (stack_pop == undefined) {
                    throw "The Path Stack is corrupt";
                }
                current_cell = stack_pop;
                continue;
            }
            //Choose a random direction from available vectors
            let index = Math.floor(Math.random() * vectors.length);
            let next_vector = vectors[index];
            let reverse_next_vector = next_vector.Reverse();
            let next_cell_position = current_cell.Position.Add(next_vector);
            const next_cell = maze.GetCell(next_cell_position);
            if (next_cell == null) {
                throw "Something bad happened";
            }
            //If the cell in the chosen direction is already connected
            //Wall us off from going that way and try again.
            if (next_cell.Connected) {
                current_cell.SetCellVector(next_vector, MazeCell_1.MazeWall);
                continue;
            }
            //Make our connections between cells and move to the next cell
            current_cell.SetCellVector(next_vector, next_cell);
            next_cell.SetCellVector(reverse_next_vector, current_cell);
            path_stack.push(current_cell);
            current_cell = next_cell;
            current_cell.Connected = true;
        }
        console.log(`${current_cell.Position.X} ${current_cell.Position.Y}`);
        maze.Finalize();
        return maze;
    }
}
exports.Maze = Maze;


/***/ }),

/***/ "./ts/Maze2D.ts":
/*!**********************!*\
  !*** ./ts/Maze2D.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Maze2D = void 0;
const MazeCell_1 = __webpack_require__(/*! ./MazeCell */ "./ts/MazeCell.ts");
class Maze2D {
    constructor(canvas, maze) {
        this._canvas = canvas;
        this._maze = maze;
        let ctx = this._canvas.getContext('2d');
        if (ctx == null) {
            throw "Could not get 2D Context";
        }
        this._context = ctx;
        this._context.fillStyle = 'black';
        this._context.strokeStyle = 'white';
        this._context.lineWidth = 2;
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        this._wall_width = this._canvas.width / maze.SizeX;
        this._wall_height = this._canvas.height / maze.SizeY;
    }
    get Image() {
        return this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
    }
    CreateWalls(ctx, cell) {
        if (!cell.Connected) {
            return;
        }
        const x = this._wall_width * cell.Position.X;
        const y = this._wall_height * cell.Position.Y;
        ctx.beginPath();
        if (cell.Front == MazeCell_1.MazeWall) {
            ctx.moveTo(x, y + this._wall_height);
            ctx.lineTo(x + this._wall_width, y + this._wall_height);
        }
        if (cell.Right == MazeCell_1.MazeWall) {
            ctx.moveTo(x + this._wall_width, y + this._wall_height);
            ctx.lineTo(x + this._wall_width, y);
        }
        if (cell.Back == MazeCell_1.MazeWall) {
            ctx.moveTo(x + this._wall_width, y);
            ctx.lineTo(x, y);
        }
        if (cell.Left == MazeCell_1.MazeWall) {
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + this._wall_height);
        }
        ctx.stroke();
    }
    CreateMaze() {
        const iterator = this._maze.CellsItr();
        let itr_ptr = iterator.next();
        while (itr_ptr.done == false) {
            this.CreateWalls(this._context, itr_ptr.value);
            itr_ptr = iterator.next();
        }
    }
}
exports.Maze2D = Maze2D;


/***/ }),

/***/ "./ts/MazeCell.ts":
/*!************************!*\
  !*** ./ts/MazeCell.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MazeWall = exports.MazeCell = exports.LeftVector = exports.BackVector = exports.RightVector = exports.FrontVector = void 0;
//Corey Wunderlich 2022
//https://www.wundervisionenvisionthefuture.com/
const Vector_1 = __webpack_require__(/*! ./Vector */ "./ts/Vector.ts");
const Cell_1 = __webpack_require__(/*! ./Cell */ "./ts/Cell.ts");
exports.FrontVector = new Vector_1.Vector(0, 1);
exports.RightVector = new Vector_1.Vector(1, 0);
exports.BackVector = new Vector_1.Vector(0, -1);
exports.LeftVector = new Vector_1.Vector(-1, 0);
class MazeCell extends Cell_1.Cell {
    constructor(x, y) {
        super();
        this._position = new Vector_1.Vector(x, y);
        this._connected = false;
    }
    set Connected(value) {
        this._connected = value;
    }
    get Connected() { return this._connected; }
    get Position() {
        return this._position;
    }
    get AvailableVectors() {
        const directions = new Array();
        if (this.Front == null) {
            directions.push(exports.FrontVector);
        }
        if (this.Right == null) {
            directions.push(exports.RightVector);
        }
        if (this.Back == null) {
            directions.push(exports.BackVector);
        }
        if (this.Left == null) {
            directions.push(exports.LeftVector);
        }
        return directions;
    }
    get ConnectionCount() {
        let count = 0;
        if (this.Front != null) {
            count++;
        }
        if (this.Right != null) {
            count++;
        }
        if (this.Back != null) {
            count++;
        }
        if (this.Left != null) {
            count++;
        }
        return count;
    }
    Barricade() {
        if (this.Front == null) {
            this.Front = exports.MazeWall;
        }
        if (this.Right == null) {
            this.Right = exports.MazeWall;
        }
        if (this.Back == null) {
            this.Back = exports.MazeWall;
        }
        if (this.Left == null) {
            this.Left = exports.MazeWall;
        }
    }
    SetCellVector(v, cell) {
        if (exports.FrontVector.Equals(v)) {
            this.Front = cell;
        }
        else if (exports.RightVector.Equals(v)) {
            this.Right = cell;
        }
        else if (exports.BackVector.Equals(v)) {
            this.Back = cell;
        }
        else if (exports.LeftVector.Equals(v)) {
            this.Left = cell;
        }
    }
    GetCellVector(v) {
        if (exports.FrontVector.Equals(v)) {
            return this.Front;
        }
        if (exports.RightVector.Equals(v)) {
            return this.Right;
        }
        if (exports.BackVector.Equals(v)) {
            return this.Back;
        }
        if (exports.LeftVector.Equals(v)) {
            return this.Left;
        }
        return null;
    }
}
exports.MazeCell = MazeCell;
exports.MazeWall = new MazeCell(-1, -1);


/***/ }),

/***/ "./ts/Vector.ts":
/*!**********************!*\
  !*** ./ts/Vector.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vector = void 0;
//Corey Wunderlich 2022
//https://www.wundervisionenvisionthefuture.com/
//A Simple Vector to use that is not dependent on another library
class Vector {
    constructor(x, y) {
        this._y = y;
        this._x = x;
    }
    get X() { return this._x; }
    get Y() { return this._y; }
    Add(v) {
        return new Vector(this._x + v.X, this._y + v.Y);
    }
    Reverse() {
        return new Vector(this._x * -1, this._y * -1);
    }
    Equals(v) {
        return this._x == v.X && this._y == v.Y;
    }
}
exports.Vector = Vector;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**************************!*\
  !*** ./ts/Maze2DMain.ts ***!
  \**************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Maze2DMain = void 0;
//Corey Wunderlich 2022
//https://www.wundervisionenvisionthefuture.com/
const Maze_1 = __webpack_require__(/*! ./Maze */ "./ts/Maze.ts");
const Maze2D_1 = __webpack_require__(/*! ./Maze2D */ "./ts/Maze2D.ts");
class Maze2DMain {
    constructor(canvas_id) {
        this._canvas = document.getElementById(canvas_id);
        if (this._canvas == null) {
            throw "Canvas Not Found";
        }
        this._maze = null;
        this._maze_renderer = null;
    }
    Generate() {
        this._maze = Maze_1.Maze.Generate(0, 0, 100, 100);
        if (this._canvas != null) {
            this._maze_renderer = new Maze2D_1.Maze2D(this._canvas, this._maze);
            this._maze_renderer.CreateMaze();
        }
        return this._maze;
    }
}
exports.Maze2DMain = Maze2DMain;

})();

Maze2D = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=Maze2D.js.map